import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function Dashboard() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const d = t.dashboard;

  const [isConnected, setIsConnected]   = useState(false);
  const [loginMethod, setLoginMethod]   = useState(null); // 'facebook' | 'instagram'
  const [accessToken, setAccessToken]   = useState(null);
  const [igAccountId, setIgAccountId]   = useState(null);

  const [profile, setProfile]           = useState(null);
  const [insights, setInsights]         = useState(null);
  const [mediaList, setMediaList]       = useState([]);
  const [comments, setComments]         = useState([]);
  const [selectedMediaId, setSelectedMediaId] = useState(null);

  const [loading, setLoading]   = useState({ profile: false, insights: false, comments: false });
  const [errors, setErrors]     = useState({ profile: null, insights: null, comments: null });
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError]     = useState(null);

  // ── Unified Graph API helper (adapts base URL by provider) ──
  const graphGet = useCallback(async (path) => {
    const baseUrl = loginMethod === "instagram"
      ? "https://graph.instagram.com/v21.0"
      : "https://graph.facebook.com/v21.0";
    const sep = path.includes("?") ? "&" : "?";
    const res  = await fetch(`${baseUrl}${path}${sep}access_token=${accessToken}`);
    const data = await res.json();
    if (data.error) throw data.error;
    return data;
  }, [accessToken, loginMethod]);

  // ── Facebook Login — backend gera a URL, frontend só redireciona ──
  const handleLogin = async () => {
    try {
      setOauthError(null);
      const res  = await fetch(`${BACKEND_URL}/oauth/fb/url`);
      const data = await res.json();
      sessionStorage.setItem("oauth_provider", "facebook");
      window.location.href = data.url;
    } catch (err) {
      setOauthError("Erro ao iniciar login com Facebook: " + err.message);
    }
  };

  // ── Instagram Login — backend gera a URL, frontend só redireciona ──
  const handleInstagramLogin = async () => {
    try {
      setOauthError(null);
      const res  = await fetch(`${BACKEND_URL}/oauth/ig/url`);
      const data = await res.json();
      sessionStorage.setItem("oauth_provider", "instagram");
      window.location.href = data.url;
    } catch (err) {
      setOauthError("Erro ao iniciar login com Instagram: " + err.message);
    }
  };

  // ── Handle OAuth callback ──
  // Após o login, o Instagram/Facebook redireciona de volta com ?code= na URL.
  // O frontend lê o code, envia pro backend e recebe o token pronto.
  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const code     = params.get("code");
    const provider = sessionStorage.getItem("oauth_provider");

    if (!code || !provider || isConnected) return;

    // Limpa a URL e o sessionStorage antes de qualquer trabalho assíncrono
    sessionStorage.removeItem("oauth_provider");
    window.history.replaceState({}, "", window.location.pathname);

    setOauthLoading(true);
    setOauthError(null);

    const isInstagram = provider === "instagram";

    fetch(`${BACKEND_URL}/oauth/callback?code=${encodeURIComponent(code)}&is_instagram_only=${isInstagram}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.access_token) {
          throw new Error(data.detail || "Falha na troca do token OAuth.");
        }

        const token = data.access_token;
        setAccessToken(token);
        setLoginMethod(provider);

        if (isInstagram) {
          // Para Instagram, o backend já retorna o user_id
          setIgAccountId(String(data.user_id || ""));
          setIsConnected(true);
        } else {
          // Para Facebook, precisamos resolver a conta IG Business vinculada à Página
          try {
            const pagesRes   = await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${token}`);
            const pages      = await pagesRes.json();
            if (!pages.data || pages.data.length === 0)
              throw new Error(d.errors?.noPages || "Nenhuma Página do Facebook encontrada.");

            const page       = pages.data[0];
            const pageRes    = await fetch(`https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${token}`);
            const pageDetails = await pageRes.json();
            if (!pageDetails.instagram_business_account)
              throw new Error(d.errors?.noIgBusiness || "Nenhuma conta Instagram Business vinculada.");

            setIgAccountId(pageDetails.instagram_business_account.id);
            setIsConnected(true);
          } catch (err) {
            setErrors((prev) => ({ ...prev, profile: err.message }));
          }
        }
      })
      .catch((err) => setOauthError(err.message || "Erro no OAuth callback."))
      .finally(() => setOauthLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Logout ──
  const handleLogout = () => {
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
    setOauthError(null);
    sessionStorage.removeItem("oauth_provider");
  };

  // ── Fetch Profile ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;
    setLoading((l) => ({ ...l, profile: true }));
    setErrors((e)  => ({ ...e, profile: null }));

    graphGet(`/${igAccountId}?fields=username,name,biography,profile_picture_url,followers_count,follows_count,media_count`)
      .then((data) => setProfile(data))
      .catch((err) => setErrors((e) => ({ ...e, profile: err.message || String(err) })))
      .finally(() => setLoading((l) => ({ ...l, profile: false })));
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Media list ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;

    graphGet(`/${igAccountId}/media?fields=id,caption,timestamp,media_type,thumbnail_url,media_url&limit=6`)
      .then((data) => {
        setMediaList(data.data || []);
        if (data.data && data.data.length > 0) setSelectedMediaId(data.data[0].id);
      })
      .catch(() => {});
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Insights ──
  useEffect(() => {
    if (!igAccountId || !accessToken) return;
    setLoading((l) => ({ ...l, insights: true }));
    setErrors((e)  => ({ ...e, insights: null }));

    const insightsPath = `/${igAccountId}/insights?metric=reach,profile_views,accounts_engaged&period=day&metric_type=total_value&since=${Math.floor(Date.now() / 1000) - 28 * 86400}&until=${Math.floor(Date.now() / 1000)}`;

    graphGet(insightsPath)
      .then((data) => setInsights(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, insights: err.message || String(err) })))
      .finally(() => setLoading((l) => ({ ...l, insights: false })));
  }, [igAccountId, accessToken, graphGet]);

  // ── Fetch Comments ──
  useEffect(() => {
    if (!selectedMediaId || !accessToken) return;
    setLoading((l) => ({ ...l, comments: true }));
    setErrors((e)  => ({ ...e, comments: null }));

    graphGet(`/${selectedMediaId}/comments?fields=id,text,username,timestamp&limit=10`)
      .then((data) => setComments(data.data || []))
      .catch((err) => setErrors((e) => ({ ...e, comments: err.message || String(err) })))
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
    return new Date(ts).toLocaleDateString(
      language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US",
      { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  // ── RENDER ──
  return (
    <div className="page-container" style={{ alignItems: "stretch" }}>
      <LanguageSelector />

      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div className="dashboard-header">
          <Link to="/" className="back-link">{d.backToHome}</Link>
          <h1>{d.title}</h1>
          <p className="dashboard-subtitle">{d.subtitle}</p>

          {/* OAuth loading/error */}
          {oauthLoading && (
            <div style={{ textAlign: "center", padding: "16px", color: "var(--color-text-secondary)" }}>
              <LoadingSpinner />
              <p style={{ marginTop: "8px" }}>Autenticando...</p>
            </div>
          )}
          {oauthError && (
            <div className="error-card" style={{ marginTop: "12px", textAlign: "left" }}>
              <span>⚠️</span>
              <p><strong>Erro de autenticação:</strong> {oauthError}</p>
            </div>
          )}

          {!isConnected ? (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary connect-btn"
                onClick={handleLogin}
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
                { icon: "👤", perm: "instagram_basic",             desc: d.permBasicDesc },
                { icon: "📊", perm: "instagram_manage_insights",   desc: d.permInsightsDesc },
                { icon: "💬", perm: "instagram_manage_comments",   desc: d.permCommentsDesc },
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
                    <img src={profile.profile_picture_url} alt={profile.username} className="profile-avatar" />
                  )}
                  <div className="profile-info">
                    <h3>@{profile.username}</h3>
                    {profile.name && <p className="profile-name">{profile.name}</p>}
                    {profile.biography && <p className="profile-bio">{profile.biography}</p>}
                  </div>
                </div>
                <div className="metrics-grid">
                  <MetricCard label={d.followers} value={profile.followers_count} icon="👥" />
                  <MetricCard label={d.following} value={profile.follows_count}   icon="➡️" />
                  <MetricCard label={d.posts}     value={profile.media_count}     icon="📷" />
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
              <span className="permission-badge permission-badge--green">instagram_manage_insights</span>
            </div>

            {loading.insights && <LoadingSpinner />}
            {errors.insights && <ErrorMessage message={errors.insights} />}

            {insights && (
              <div className="card">
                <p className="insights-period">{d.insightsPeriod}</p>
                <div className="metrics-grid">
                  <MetricCard label={d.reach}                        value={sumInsightValues("reach").toLocaleString()}             icon="🌐" />
                  <MetricCard label={d.accountsEngaged || "Accounts Engaged"} value={sumInsightValues("accounts_engaged").toLocaleString()} icon="👥" />
                  <MetricCard label={d.profileViews}                 value={sumInsightValues("profile_views").toLocaleString()}    icon="🔍" />
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
