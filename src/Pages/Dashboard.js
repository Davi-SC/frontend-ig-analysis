import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID || "859402103106794";
const IG_APP_SECRET = process.env.REACT_APP_IG_APP_SECRET || "";
const IG_REDIRECT_URI = process.env.REACT_APP_IG_REDIRECT_URI || "https://socialdatalab.vercel.app/dashboard";

const IG_BUSINESS_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_comments",
].join(",");

const PERMISSIONS = [
  "instagram_basic",
  "instagram_manage_insights",
  "instagram_manage_comments",
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
];

export default function Dashboard() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const d = t.dashboard;

  const [sdkReady, setSdkReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loginMethod, setLoginMethod] = useState(null); // 'facebook' | 'instagram'
  const [accessToken, setAccessToken] = useState(null);
  const [igAccountId, setIgAccountId] = useState(null);

  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedMediaId, setSelectedMediaId] = useState(null);

  const [loading, setLoading] = useState({ profile: false, insights: false, comments: false });
  const [errors, setErrors] = useState({ profile: null, insights: null, comments: null });

  // ── Initialize Facebook SDK ──
  useEffect(() => {
    if (window.FB) {
      setSdkReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v21.0",
      });
      setSdkReady(true);
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // ── Graph API helper ──
  const graphGet = useCallback(
    (path) =>
      new Promise((resolve, reject) => {
        window.FB.api(path, "GET", { access_token: accessToken }, (res) => {
          if (res && !res.error) resolve(res);
          else reject(res?.error || { message: "Unknown error" });
        });
      }),
    [accessToken]
  );

  // ── Fetch IG Business Account ID from connected Pages ──
  const resolveIgAccount = useCallback(
    async (token) => {
      // We need to use the token directly because state may not be set yet
      const fetchWithToken = (path) =>
        new Promise((resolve, reject) => {
          window.FB.api(path, "GET", { access_token: token }, (res) => {
            if (res && !res.error) resolve(res);
            else reject(res?.error || { message: "Unknown error" });
          });
        });

      const pages = await fetchWithToken("/me/accounts");
      if (!pages.data || pages.data.length === 0)
        throw new Error(d.errors?.noPages || "No Facebook Pages found");

      const page = pages.data[0];
      const pageDetails = await fetchWithToken(
        `/${page.id}?fields=instagram_business_account`
      );

      if (!pageDetails.instagram_business_account)
        throw new Error(d.errors?.noIgBusiness || "No Instagram Business account linked");

      return pageDetails.instagram_business_account.id;
    },
    [d.errors]
  );

  // ── Facebook Login ──
  const handleLogin = () => {
    if (!sdkReady) return;

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          setAccessToken(token);
          setIsConnected(true);
          setLoginMethod("facebook");

          resolveIgAccount(token)
            .then((igId) => setIgAccountId(igId))
            .catch((err) =>
              setErrors((prev) => ({ ...prev, profile: err.message || String(err) }))
            );
        }
      },
      { scope: PERMISSIONS.join(",") }
    );
  };

  // ── Instagram Business Login — redirect to OAuth ──
  const handleInstagramLogin = () => {
    const url =
      `https://www.instagram.com/oauth/authorize` +
      `?enable_fb_login=0` +
      `&force_authentication=1` +
      `&client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(IG_BUSINESS_SCOPES)}` +
      `&response_type=code`;
    window.location.href = url;
  };

  // ── Handle Instagram OAuth callback (code in URL) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code || isConnected) return;

    // Remove code from URL to avoid reuse on refresh
    window.history.replaceState({}, document.title, window.location.pathname);

    // Exchange code for short-lived token
    fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: FB_APP_ID,
          client_secret: IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: IG_REDIRECT_URI,
          code,
        }),
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.access_token) {
          setAccessToken(data.access_token);
          setIgAccountId(String(data.user_id));
          setIsConnected(true);
          setLoginMethod("instagram");
        } else {
          setErrors((e) => ({ ...e, profile: data.error_message || "Instagram login failed" }));
        }
      })
      .catch(() => setErrors((e) => ({ ...e, profile: "Failed to exchange Instagram code" })));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Logout ──
  const handleLogout = () => {
    if (window.FB && loginMethod === "facebook") {
      window.FB.logout(() => {});
    }
    setIsConnected(false);
    setAccessToken(null);
    setIgAccountId(null);
    setProfile(null);
    setInsights(null);
    setMediaList([]);
    setComments([]);
    setSelectedMediaId(null);
    setLoginMethod(null);
    setErrors({ profile: null, insights: null, comments: null });
  };

  // ── Fetch Profile — adapts to login method ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    setLoading((l) => ({ ...l, profile: true }));
    setErrors((e) => ({ ...e, profile: null }));

    if (loginMethod === "instagram") {
      // Instagram Business Login uses a different base URL
      fetch(
        `https://graph.instagram.com/v21.0/${igAccountId}?fields=username,name,biography,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`
      )
        .then((r) => r.json())
        .then((data) => setProfile(data))
        .catch((err) => setErrors((e) => ({ ...e, profile: err.message })))
        .finally(() => setLoading((l) => ({ ...l, profile: false })));
    } else {
      graphGet(
        `/${igAccountId}?fields=username,name,biography,profile_picture_url,followers_count,follows_count,media_count`
      )
        .then((data) => setProfile(data))
        .catch((err) => setErrors((e) => ({ ...e, profile: err.message })))
        .finally(() => setLoading((l) => ({ ...l, profile: false })));
    }
  }, [igAccountId, accessToken, loginMethod, graphGet]);

  // ── Fetch Media list ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    const fetchMedia = loginMethod === "instagram"
      ? fetch(`https://graph.instagram.com/v21.0/${igAccountId}/media?fields=id,caption,timestamp,media_type,thumbnail_url,media_url&limit=6&access_token=${accessToken}`).then((r) => r.json())
      : graphGet(`/${igAccountId}/media?fields=id,caption,timestamp,media_type,thumbnail_url,media_url&limit=6`);

    fetchMedia
      .then((data) => {
        setMediaList(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedMediaId(data.data[0].id);
        }
      })
      .catch(() => {});
  }, [igAccountId, accessToken, loginMethod, graphGet]);

  // ── Fetch Insights ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    setLoading((l) => ({ ...l, insights: true }));
    setErrors((e) => ({ ...e, insights: null }));

    const insightsPath = `/${igAccountId}/insights?metric=reach,profile_views,accounts_engaged&period=day&metric_type=total_value&since=${Math.floor(Date.now() / 1000) - 28 * 86400}&until=${Math.floor(Date.now() / 1000)}`;

    const fetchInsights = loginMethod === "instagram"
      ? fetch(`https://graph.instagram.com/v21.0${insightsPath}&access_token=${accessToken}`).then((r) => r.json())
      : graphGet(insightsPath);

    fetchInsights
      .then((data) => setInsights(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, insights: err.message })))
      .finally(() => setLoading((l) => ({ ...l, insights: false })));
  }, [igAccountId, accessToken, loginMethod, graphGet]);

  // ── Fetch Comments ──
  useEffect(() => {
    if (!selectedMediaId || !accessToken) return;

    setLoading((l) => ({ ...l, comments: true }));
    setErrors((e) => ({ ...e, comments: null }));

    const fetchComments = loginMethod === "instagram"
      ? fetch(`https://graph.instagram.com/v21.0/${selectedMediaId}/comments?fields=id,text,username,timestamp&limit=10&access_token=${accessToken}`).then((r) => r.json())
      : graphGet(`/${selectedMediaId}/comments?fields=id,text,username,timestamp&limit=10`);

    fetchComments
      .then((data) => setComments(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, comments: err.message })))
      .finally(() => setLoading((l) => ({ ...l, comments: false })));
  }, [selectedMediaId, accessToken, loginMethod, graphGet]);

  // ── Helpers ──
  const sumInsightValues = (metricName) => {
    if (!insights) return 0;
    const metric = insights.find((m) => m.name === metricName);
    if (!metric || !metric.values) return 0;
    return metric.values.reduce((acc, v) => acc + (v.value || 0), 0);
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString(language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── RENDER ──
  return (
    <div className="page-container" style={{ alignItems: "stretch" }}>
      <LanguageSelector />

      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div className="dashboard-header">
          <Link to="/" className="back-link">
            {d.backToHome}
          </Link>
          <h1>{d.title}</h1>
          <p className="dashboard-subtitle">{d.subtitle}</p>

          {!isConnected ? (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary connect-btn"
                onClick={handleLogin}
                disabled={!sdkReady}
                id="btn-connect-facebook"
                style={{ background: "linear-gradient(135deg, #1877f2, #0a5dc2)" }}
              >
                Login with Facebook
              </button>
              <button
                className="btn btn-primary connect-btn"
                onClick={handleInstagramLogin}
                id="btn-connect-instagram"
                style={{ background: "linear-gradient(135deg, #e1306c, #833ab4)" }}
              >
                Login with Instagram
              </button>
            </div>
          ) : (
            <div className="connection-status">
              <span className="status-connected">
                ✅ {d.connected}
                {loginMethod === "instagram" && (
                  <span style={{ marginLeft: "8px", fontSize: "0.75rem", background: "linear-gradient(135deg,#e1306c,#833ab4)", color: "#fff", padding: "2px 8px", borderRadius: "12px" }}>via Instagram</span>
                )}
                {loginMethod === "facebook" && (
                  <span style={{ marginLeft: "8px", fontSize: "0.75rem", background: "#1877f2", color: "#fff", padding: "2px 8px", borderRadius: "12px" }}>via Facebook</span>
                )}
              </span>
              <button className="btn disconnect-btn" onClick={handleLogout} id="btn-disconnect">
                {d.disconnectButton}
              </button>
            </div>
          )}
        </div>

        {/* ─ Not connected state ─ */}
        {!isConnected && (
          <div className="dashboard-section card">
            <h2>{d.howItWorks}</h2>
            <div className="permissions-grid">
              {[
                { icon: "👤", perm: "instagram_basic", desc: d.permBasicDesc },
                { icon: "📊", perm: "instagram_manage_insights", desc: d.permInsightsDesc },
                { icon: "💬", perm: "instagram_manage_comments", desc: d.permCommentsDesc },
                { icon: "📄", perm: "pages_show_list + pages_read_engagement", desc: d.permPagesDesc },
              ].map((p, i) => (
                <div key={i} className="permission-card">
                  <span className="permission-icon">{p.icon}</span>
                  <span className="permission-badge">{p.perm}</span>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ Connected: Profile Section ─ */}
        {isConnected && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>👤 {d.profileTitle}</h2>
              <span className="permission-badge permission-badge--blue">
                {loginMethod === "instagram" ? "instagram_business_basic" : "instagram_basic"}
              </span>
            </div>

            {loading.profile && <LoadingSpinner />}
            {errors.profile && <ErrorMessage message={errors.profile} />}

            {profile && (
              <div className="profile-card card">
                <div className="profile-top">
                  {profile.profile_picture_url && (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.username}
                      className="profile-avatar"
                    />
                  )}
                  <div className="profile-info">
                    <h3>@{profile.username}</h3>
                    {profile.name && <p className="profile-name">{profile.name}</p>}
                    {profile.biography && (
                      <p className="profile-bio">{profile.biography}</p>
                    )}
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard label={d.followers} value={profile.followers_count} icon="👥" />
                  <MetricCard label={d.following} value={profile.follows_count} icon="➡️" />
                  <MetricCard label={d.posts} value={profile.media_count} icon="📷" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─ Connected: Insights Section ─ */}
        {isConnected && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>📊 {d.insightsTitle}</h2>
              <span className="permission-badge permission-badge--green">
                instagram_manage_insights
              </span>
            </div>

            {loading.insights && <LoadingSpinner />}
            {errors.insights && <ErrorMessage message={errors.insights} />}

            {insights && (
              <div className="card">
                <p className="insights-period">{d.insightsPeriod}</p>
                <div className="metrics-grid">
                  <MetricCard
                    label={d.reach}
                    value={sumInsightValues("reach").toLocaleString()}
                    icon="🌐"
                  />
                  <MetricCard
                    label={d.accountsEngaged || "Accounts Engaged"}
                    value={sumInsightValues("accounts_engaged").toLocaleString()}
                    icon="👥"
                  />
                  <MetricCard
                    label={d.profileViews}
                    value={sumInsightValues("profile_views").toLocaleString()}
                    icon="🔍"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─ Connected: Comments Section ─ */}
        {isConnected && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>💬 {d.commentsTitle}</h2>
              <span className="permission-badge permission-badge--purple">
                {loginMethod === "instagram" ? "instagram_business_manage_comments" : "instagram_manage_comments"}
              </span>
            </div>

            {mediaList.length > 0 && (
              <div className="media-selector">
                <label>{d.selectPost}</label>
                <select
                  value={selectedMediaId || ""}
                  onChange={(e) => setSelectedMediaId(e.target.value)}
                  className="media-select"
                  id="select-media"
                >
                  {mediaList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.caption
                        ? m.caption.substring(0, 60) + (m.caption.length > 60 ? "..." : "")
                        : `${m.media_type} — ${formatDate(m.timestamp)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {loading.comments && <LoadingSpinner />}
            {errors.comments && <ErrorMessage message={errors.comments} />}

            {!loading.comments && comments.length === 0 && isConnected && (
              <div className="card empty-state">
                <p>💬 {d.noComments}</p>
              </div>
            )}

            {comments.length > 0 && (
              <div className="card comments-list">
                {comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-username">@{c.username}</span>
                      <span className="comment-date">{formatDate(c.timestamp)}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div className="nav-links" style={{ marginTop: "var(--spacing-xl)", marginBottom: "var(--spacing-lg)" }}>
          <Link to="/" className="nav-link">🏠 {d.homeLink}</Link>
          <Link to="/privacy" className="nav-link">🔒 {d.privacyLink}</Link>
          <Link to="/terms" className="nav-link">📋 {d.termsLink}</Link>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──
function MetricCard({ label, value, icon }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <span className="metric-value">{typeof value === "number" ? value.toLocaleString() : value}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error-card">
      <span>⚠️</span>
      <p>{message}</p>
    </div>
  );
}
