import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID || "YOUR_APP_ID";

const PERMISSIONS = [
  "instagram_business_basic",
  "instagram_business_manage_insights",
  "instagram_business_manage_comments",
  "pages_show_list",
  "pages_read_engagement",
];

export default function Dashboard() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const d = t.dashboard;

  const [sdkReady, setSdkReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
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

  // ── Login ──
  const handleLogin = () => {
    if (!sdkReady) return;

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          setAccessToken(token);
          setIsConnected(true);

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

  // ── Logout ──
  const handleLogout = () => {
    if (window.FB) {
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
    setErrors({ profile: null, insights: null, comments: null });
  };

  // ── Fetch Profile (instagram_business_basic) ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    setLoading((l) => ({ ...l, profile: true }));
    setErrors((e) => ({ ...e, profile: null }));

    graphGet(
      `/${igAccountId}?fields=username,name,biography,profile_picture_url,followers_count,follows_count,media_count`
    )
      .then((data) => setProfile(data))
      .catch((err) => setErrors((e) => ({ ...e, profile: err.message })))
      .finally(() => setLoading((l) => ({ ...l, profile: false })));
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Media list for insights + comments ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    graphGet(`/${igAccountId}/media?fields=id,caption,timestamp,media_type,thumbnail_url,media_url&limit=6`)
      .then((data) => {
        setMediaList(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedMediaId(data.data[0].id);
        }
      })
      .catch(() => {});
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Insights (instagram_business_manage_insights) ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    setLoading((l) => ({ ...l, insights: true }));
    setErrors((e) => ({ ...e, insights: null }));

    graphGet(
      `/${igAccountId}/insights?metric=reach,impressions,profile_views&period=day&since=${Math.floor(Date.now() / 1000) - 28 * 86400}&until=${Math.floor(Date.now() / 1000)}`
    )
      .then((data) => setInsights(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, insights: err.message })))
      .finally(() => setLoading((l) => ({ ...l, insights: false })));
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Comments (instagram_business_manage_comments) ──
  useEffect(() => {
    if (!selectedMediaId || !accessToken) return;

    setLoading((l) => ({ ...l, comments: true }));
    setErrors((e) => ({ ...e, comments: null }));

    graphGet(`/${selectedMediaId}/comments?fields=id,text,username,timestamp&limit=10`)
      .then((data) => setComments(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, comments: err.message })))
      .finally(() => setLoading((l) => ({ ...l, comments: false })));
  }, [selectedMediaId, accessToken, graphGet]);

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
            <button
              className="btn btn-primary connect-btn"
              onClick={handleLogin}
              disabled={!sdkReady}
              id="btn-connect-instagram"
            >
              📸 {d.connectButton}
            </button>
          ) : (
            <div className="connection-status">
              <span className="status-connected">✅ {d.connected}</span>
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
                { icon: "👤", perm: "instagram_business_basic", desc: d.permBasicDesc },
                { icon: "📊", perm: "instagram_business_manage_insights", desc: d.permInsightsDesc },
                { icon: "💬", perm: "instagram_business_manage_comments", desc: d.permCommentsDesc },
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
                instagram_business_basic
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
                instagram_business_manage_insights
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
                    label={d.impressions}
                    value={sumInsightValues("impressions").toLocaleString()}
                    icon="👁️"
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
                instagram_business_manage_comments
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
