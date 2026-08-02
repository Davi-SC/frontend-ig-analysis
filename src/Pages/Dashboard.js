import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";
import {
  backendGet,
  backendPost,
  backendGetPublic,
  saveProfileId,
  getProfileId,
  clearProfileId,
} from "../api/backendClient";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const { language } = useLanguage();
  const t = getTranslation(language);
  const d = t.dashboard;

  // ── Estado de sessão — apenas profile_id, nunca o token ──────────────────
  const [isConnected, setIsConnected] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // ── Dados do backend ──────────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [bestHours, setBestHours] = useState([]);
  const [byFormat, setByFormat] = useState([]);
  const [engagementTrend, setEngagementTrend] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postEngagement, setPostEngagement] = useState([]);

  // ── Estado de UI ──────────────────────────────────────────────────────────
  const [collecting, setCollecting] = useState(false);
  const [collectSteps, setCollectSteps] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    analytics: false,
    engagement: false,
  });
  const [errors, setErrors] = useState({
    profile: null,
    posts: null,
    analytics: null,
    engagement: null,
    oauth: null,
  });
  const [oauthLoading, setOauthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'posts' | 'analytics'

  // ── Helper: setar erro pontual ────────────────────────────────────────────
  const setError = (key, msg) => setErrors((e) => ({ ...e, [key]: msg }));
  const clearError = (key) => setErrors((e) => ({ ...e, [key]: null }));

  // ── Inicializa sessão ─────────────────────────────────────────────────────
  // Recupera profile_id do sessionStorage (persiste refresh de página)
  useEffect(() => {
    const saved = getProfileId();
    if (saved) {
      setProfileId(saved);
      setIsConnected(true);
    }
  }, []);

  // ── Handle OAuth callback ─────────────────────────────────────────────────
  useEffect(() => {
    // Facebook: profile_id injetado pelo FbCallback.js via sessionStorage
    const fbProfileId = sessionStorage.getItem("fb_profile_id");
    if (fbProfileId && !isConnected) {
      sessionStorage.removeItem("fb_profile_id");
      _connectWithProfileId(fbProfileId, true);
      return;
    }

    // Instagram: code nos query params → backend troca por token e retorna profile_id
    const provider = sessionStorage.getItem("oauth_provider");
    if (!provider || isConnected) return;

    if (provider === "instagram") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      sessionStorage.removeItem("oauth_provider");
      window.history.replaceState({}, "", window.location.pathname);

      setOauthLoading(true);
      clearError("oauth");

      fetch(`${BACKEND_URL}/oauth/callback?code=${encodeURIComponent(code)}&is_instagram_only=true`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.user_id) throw new Error(data.detail || "Falha na troca do token OAuth.");
          _connectWithProfileId(String(data.user_id), true);
        })
        .catch((err) => setError("oauth", err.message || "Erro no OAuth callback."))
        .finally(() => setOauthLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Conectar: salva profile_id e dispara coleta inicial se for 1ª vez ────
  const _connectWithProfileId = useCallback(async (pid, isFirstLogin = false) => {
    saveProfileId(pid);
    setProfileId(pid);
    setIsConnected(true);

    if (isFirstLogin) {
      setCollecting(true);
      setCollectSteps([]);
      try {
        // Usa fetch direto pois o profileId ainda não está no state
        const res = await fetch(`${BACKEND_URL}/collect/initial`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Profile-ID": pid },
        });
        const data = await res.json().catch(() => ({}));
        setCollectSteps(data.steps || []);
      } catch (e) {
        setCollectSteps([{ service: "collect", status: "error", message: e.message }]);
      } finally {
        setCollecting(false);
      }
    }
  }, []);

  // ── Busca dados do backend sempre que conectar ────────────────────────────
  useEffect(() => {
    if (!isConnected || !profileId) return;

    // Perfil
    setLoading((l) => ({ ...l, profile: true }));
    backendGet("/data/profile")
      .then(setProfile)
      .catch((e) => setError("profile", e.message))
      .finally(() => setLoading((l) => ({ ...l, profile: false })));

    // Posts (últimos 20)
    setLoading((l) => ({ ...l, posts: true }));
    backendGet("/data/posts", { limit: 20 })
      .then((r) => {
        setPosts(r.data || []);
        if (r.data && r.data.length > 0) setSelectedPostId(r.data[0].post_id);
      })
      .catch((e) => setError("posts", e.message))
      .finally(() => setLoading((l) => ({ ...l, posts: false })));

    // Analytics em paralelo
    setLoading((l) => ({ ...l, analytics: true }));
    Promise.allSettled([
      backendGet("/analytics/top-posts", { metric: "er_simple", limit: 10 }),
      backendGet("/analytics/best-hours"),
      backendGet("/analytics/by-format"),
      backendGet("/analytics/engagement-trend", { days: 30 }),
    ]).then(([tp, bh, bf, et]) => {
      if (tp.status === "fulfilled") setTopPosts(tp.value.data || []);
      if (bh.status === "fulfilled") setBestHours(bh.value.data || []);
      if (bf.status === "fulfilled") setByFormat(bf.value.data || []);
      if (et.status === "fulfilled") setEngagementTrend(et.value.data || []);
      setLoading((l) => ({ ...l, analytics: false }));
    });
  }, [isConnected, profileId]);

  // ── Busca engajamento do post selecionado ─────────────────────────────────
  useEffect(() => {
    if (!selectedPostId || !isConnected) return;
    setLoading((l) => ({ ...l, engagement: true }));
    backendGet(`/data/engagement/${selectedPostId}`)
      .then((r) => setPostEngagement(r.data || []))
      .catch((e) => setError("engagement", e.message))
      .finally(() => setLoading((l) => ({ ...l, engagement: false })));
  }, [selectedPostId, isConnected]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearProfileId();
    setIsConnected(false);
    setProfileId(null);
    setProfile(null);
    setSnapshots([]);
    setPosts([]);
    setTopPosts([]);
    setBestHours([]);
    setByFormat([]);
    setEngagementTrend([]);
    setSelectedPostId(null);
    setPostEngagement([]);
    setCollectSteps([]);
    setErrors({ profile: null, posts: null, analytics: null, engagement: null, oauth: null });
    sessionStorage.removeItem("oauth_provider");
  };

  // ── Refresh manual ────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setCollecting(true);
    setCollectSteps([]);
    try {
      const data = await backendPost("/collect/refresh");
      setCollectSteps(data.steps || []);
    } catch (e) {
      setCollectSteps([{ service: "collect", status: "error", message: e.message }]);
    } finally {
      setCollecting(false);
    }
  };

  // ── OAuth login handlers ──────────────────────────────────────────────────
  const handleLogin = async () => {
    try {
      clearError("oauth");
      const data = await backendGetPublic("/oauth/fb/url");
      sessionStorage.setItem("oauth_provider", "facebook");
      window.location.href = data.url;
    } catch (err) {
      setError("oauth", "Erro ao iniciar login com Facebook: " + err.message);
    }
  };

  const handleInstagramLogin = async () => {
    try {
      clearError("oauth");
      const data = await backendGetPublic("/oauth/ig/url");
      sessionStorage.setItem("oauth_provider", "instagram");
      window.location.href = data.url;
    } catch (err) {
      setError("oauth", "Erro ao iniciar login com Instagram: " + err.message);
    }
  };

  // ── Helpers de formatação ─────────────────────────────────────────────────
  const fmt = (n) => (typeof n === "number" ? n.toLocaleString("pt-BR") : "—");
  const fmtPct = (n) => (typeof n === "number" ? (n * 100).toFixed(2) + "%" : "—");
  const fmtER = (n) => (typeof n === "number" ? (n * 100).toFixed(3) + "%" : "—");
  const fmtDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="page-container" style={{ alignItems: "stretch" }}>
      <LanguageSelector />

      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ── */}
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
          {errors.oauth && <ErrorMessage message={errors.oauth} />}

          {/* Login / Logout */}
          {!isConnected ? (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary connect-btn" onClick={handleLogin} id="btn-connect-facebook"
                style={{ background: "linear-gradient(135deg, #1877f2, #0a5dc2)" }}>
                Login with Facebook
              </button>
              <button className="btn btn-primary connect-btn" onClick={handleInstagramLogin} id="btn-connect-instagram"
                style={{ background: "linear-gradient(135deg, #e1306c, #833ab4)" }}>
                Login with Instagram
              </button>
            </div>
          ) : (
            <div className="connection-status">
              <span className="status-connected">✅ {d.connected}</span>
              <button className="btn" onClick={handleRefresh} disabled={collecting} id="btn-refresh"
                style={{ marginLeft: "8px", fontSize: "0.85rem", padding: "6px 14px" }}>
                {collecting ? "Atualizando…" : "🔄 Atualizar dados"}
              </button>
              <button className="btn disconnect-btn" onClick={handleLogout} id="btn-disconnect">
                {d.disconnectButton}
              </button>
            </div>
          )}
        </div>

        {/* ── Coleta em andamento ── */}
        {collecting && (
          <div className="dashboard-section card" style={{ textAlign: "center" }}>
            <LoadingSpinner />
            <p style={{ marginTop: "12px", color: "var(--color-text-secondary)" }}>
              Coletando dados do Instagram… isso pode levar alguns instantes.
            </p>
          </div>
        )}

        {/* ── Resultado da coleta ── */}
        {!collecting && collectSteps.length > 0 && (
          <div className="dashboard-section card">
            <h3 style={{ marginBottom: "12px" }}>📋 Resultado da Coleta</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {collectSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem" }}>
                  <span>{s.status === "error" ? "❌" : s.status === "skipped" ? "⏭️" : "✅"}</span>
                  <span style={{ fontWeight: 600 }}>{s.service}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{s.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Não conectado: explicação ── */}
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

        {/* ── Dashboard conectado ── */}
        {isConnected && (
          <>
            {/* ── Tabs ── */}
            <div style={{ display: "flex", gap: "8px", margin: "16px 0", borderBottom: "2px solid var(--color-border, #2a2a2a)", paddingBottom: "0" }}>
              {[
                { id: "overview", label: "👤 Visão Geral" },
                { id: "posts", label: "📷 Posts" },
                { id: "analytics", label: "📊 Analytics" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 20px", border: "none", background: "transparent", cursor: "pointer",
                    fontWeight: activeTab === tab.id ? 700 : 400,
                    color: activeTab === tab.id ? "var(--color-primary, #e1306c)" : "var(--color-text-secondary)",
                    borderBottom: activeTab === tab.id ? "2px solid var(--color-primary, #e1306c)" : "2px solid transparent",
                    marginBottom: "-2px", fontSize: "0.95rem",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ══════════════ TAB: VISÃO GERAL ══════════════ */}
            {activeTab === "overview" && (
              <div className="dashboard-section">
                {/* Perfil */}
                <div className="section-header">
                  <h2>👤 {d.profileTitle}</h2>
                  <span className="permission-badge permission-badge--blue">instagram_basic</span>
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
                      <MetricCard label={d.following} value={profile.follows_count} icon="➡️" />
                      <MetricCard label={d.posts} value={profile.media_count} icon="📷" />
                    </div>
                  </div>
                )}

                {/* Crescimento de seguidores (snapshots) */}
                {snapshots.length > 0 && (
                  <div className="card" style={{ marginTop: "16px" }}>
                    <h3 style={{ marginBottom: "12px" }}>📈 Crescimento de Seguidores (30 dias)</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                      Dados coletados diariamente pelo pipeline ETL.
                    </p>
                    {/* Mini spark representation */}
                    <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "60px" }}>
                      {snapshots.slice(-30).map((s, i) => {
                        const max = Math.max(...snapshots.map((x) => x.followers_count || 0));
                        const h = max > 0 ? ((s.followers_count || 0) / max) * 100 : 0;
                        return (
                          <div key={i} title={`${s.date}: ${fmt(s.followers_count)} seguidores`}
                            style={{ flex: 1, height: `${h}%`, background: "var(--color-primary, #e1306c)", borderRadius: "2px 2px 0 0", opacity: 0.8 }} />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════ TAB: POSTS ══════════════ */}
            {activeTab === "posts" && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>📷 Posts Recentes</h2>
                  <span className="permission-badge permission-badge--green">instagram_basic</span>
                </div>

                {loading.posts && <LoadingSpinner />}
                {errors.posts && <ErrorMessage message={errors.posts} />}

                {posts.length > 0 && (
                  <>
                    {/* Seletor de post para ver engajamento */}
                    <div className="media-selector" style={{ marginBottom: "16px" }}>
                      <label>{d.selectPost}</label>
                      <select value={selectedPostId || ""} onChange={(e) => setSelectedPostId(e.target.value)}
                        className="media-select" id="select-media">
                        {posts.map((p) => (
                          <option key={p.post_id} value={p.post_id}>
                            {p.caption ? p.caption.substring(0, 60) + (p.caption.length > 60 ? "…" : "")
                              : `${p.media_type} — ${fmtDate(p.published_at)}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grade de posts */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                      {posts.map((p) => {
                        const snap = p.latest_snapshot;
                        const isSelected = p.post_id === selectedPostId;
                        return (
                          <div key={p.post_id} onClick={() => setSelectedPostId(p.post_id)}
                            className="card" style={{ cursor: "pointer", border: isSelected ? "2px solid var(--color-primary, #e1306c)" : "2px solid transparent", padding: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{p.media_type}</span>
                              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>{fmtDate(p.published_at)}</span>
                            </div>
                            <p style={{ fontSize: "0.82rem", marginBottom: "10px", lineHeight: 1.4,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {p.caption || "(sem legenda)"}
                            </p>
                            {snap && (
                              <div style={{ display: "flex", gap: "12px", fontSize: "0.8rem" }}>
                                <span>❤️ {fmt(snap.like_count)}</span>
                                <span>💬 {fmt(snap.comments_count)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Engajamento do post selecionado */}
                    {selectedPostId && (
                      <div className="card">
                        <h3 style={{ marginBottom: "12px" }}>📈 Métricas de Engajamento</h3>
                        {loading.engagement && <LoadingSpinner />}
                        {errors.engagement && <ErrorMessage message={errors.engagement} />}

                        {postEngagement.length > 0 && (() => {
                          const latest = postEngagement[postEngagement.length - 1];
                          return (
                            <div className="metrics-grid">
                              <MetricCard label="ER Simples" value={fmtER(latest.er_simple)} icon="📊" />
                              <MetricCard label="ER por Alcance" value={fmtER(latest.er_reach)} icon="🌐" />
                              <MetricCard label="ER por Views" value={fmtER(latest.er_views)} icon="👁️" />
                              <MetricCard label="Alcance Relativo" value={fmtPct(latest.relative_reach)} icon="📡" />
                              <MetricCard label="Amplification Rate" value={fmtER(latest.amplification_rate)} icon="🔁" />
                              <MetricCard label="Dias publicado" value={latest.days_since_published} icon="📅" />
                            </div>
                          );
                        })()}

                        {postEngagement.length === 0 && !loading.engagement && (
                          <p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "16px" }}>
                            Nenhuma métrica de engajamento calculada para este post ainda.
                            Execute uma coleta para atualizar.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {!loading.posts && posts.length === 0 && (
                  <div className="card empty-state">
                    <p>📷 Nenhum post encontrado. Execute uma coleta inicial para carregar os dados.</p>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════ TAB: ANALYTICS ══════════════ */}
            {activeTab === "analytics" && (
              <div className="dashboard-section">
                {loading.analytics && <LoadingSpinner />}
                {errors.analytics && <ErrorMessage message={errors.analytics} />}

                {/* Top Posts */}
                {topPosts.length > 0 && (
                  <div className="card" style={{ marginBottom: "16px" }}>
                    <h3 style={{ marginBottom: "4px" }}>🏆 Top Posts por ER Simples</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                      Ranking dos posts com maior taxa de engajamento relativa ao número de seguidores.
                    </p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--color-border, #2a2a2a)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px", opacity: 0.7 }}>#</th>
                            <th style={{ textAlign: "left", padding: "8px 4px", opacity: 0.7 }}>Post</th>
                            <th style={{ textAlign: "right", padding: "8px 4px", opacity: 0.7 }}>ER Simples</th>
                            <th style={{ textAlign: "right", padding: "8px 4px", opacity: 0.7 }}>ER Alcance</th>
                            <th style={{ textAlign: "right", padding: "8px 4px", opacity: 0.7 }}>Tipo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPosts.map((p, i) => (
                            <tr key={p.post_id || i} style={{ borderBottom: "1px solid var(--color-border, #1a1a1a)" }}>
                              <td style={{ padding: "8px 4px", opacity: 0.6 }}>{i + 1}</td>
                              <td style={{ padding: "8px 4px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.post_meta?.caption
                                  ? p.post_meta.caption.substring(0, 50) + (p.post_meta.caption.length > 50 ? "…" : "")
                                  : p.post_id}
                              </td>
                              <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600, color: "var(--color-primary, #e1306c)" }}>
                                {fmtER(p.er_simple)}
                              </td>
                              <td style={{ padding: "8px 4px", textAlign: "right" }}>{fmtER(p.er_reach)}</td>
                              <td style={{ padding: "8px 4px", textAlign: "right", opacity: 0.7, fontSize: "0.75rem" }}>
                                {p.post_meta?.media_type || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Engajamento por Formato */}
                {byFormat.length > 0 && (
                  <div className="card" style={{ marginBottom: "16px" }}>
                    <h3 style={{ marginBottom: "4px" }}>🎞️ Engajamento por Tipo de Mídia</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                      Comparação de desempenho médio entre IMAGE, CAROUSEL_ALBUM e VIDEO.
                    </p>
                    <div className="metrics-grid">
                      {byFormat.map((f) => (
                        <div key={f.media_type} className="metric-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                            {f.media_type === "VIDEO" ? "🎬" : f.media_type === "CAROUSEL_ALBUM" ? "📑" : "🖼️"} {f.media_type}
                          </span>
                          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{f.post_count} posts</span>
                          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>ER Simples</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary, #e1306c)" }}>{fmtER(f.avg_er_simple)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>ER Alcance</span>
                              <span style={{ fontSize: "0.85rem" }}>{fmtER(f.avg_er_reach)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Melhores Horários */}
                {bestHours.length > 0 && (
                  <div className="card" style={{ marginBottom: "16px" }}>
                    <h3 style={{ marginBottom: "4px" }}>⏰ Melhores Horários para Publicar</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                      Horários do dia com maior ER Simples médio histórico.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {bestHours.slice(0, 5).map((h, i) => {
                        const maxER = bestHours[0]?.avg_er_simple || 1;
                        const barW = Math.round((h.avg_er_simple / maxER) * 100);
                        return (
                          <div key={h.hour} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ width: "52px", fontSize: "0.82rem", fontWeight: i === 0 ? 700 : 400 }}>
                              {String(h.hour).padStart(2, "0")}:00
                            </span>
                            <div style={{ flex: 1, height: "20px", background: "var(--color-border, #1a1a1a)", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: `${barW}%`, height: "100%", background: i === 0 ? "var(--color-primary, #e1306c)" : "var(--color-secondary, #833ab4)", borderRadius: "4px" }} />
                            </div>
                            <span style={{ width: "70px", textAlign: "right", fontSize: "0.82rem" }}>{fmtER(h.avg_er_simple)}</span>
                            <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>({h.post_count} posts)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tendência de Engajamento */}
                {engagementTrend.length > 0 && (
                  <div className="card">
                    <h3 style={{ marginBottom: "4px" }}>📈 Tendência de Engajamento (30 dias)</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                      ER Simples médio diário calculado pelo pipeline ETL.
                    </p>
                    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "80px" }}>
                      {engagementTrend.map((d, i) => {
                        const max = Math.max(...engagementTrend.map((x) => x.avg_er_simple || 0));
                        const h = max > 0 ? ((d.avg_er_simple || 0) / max) * 100 : 0;
                        return (
                          <div key={i} title={`${d.date}: ${fmtER(d.avg_er_simple)}`}
                            style={{ flex: 1, height: `${h}%`, background: "var(--color-primary, #e1306c)", borderRadius: "2px 2px 0 0", opacity: 0.8, minHeight: "2px" }} />
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.72rem", opacity: 0.5 }}>
                      <span>{engagementTrend[0]?.date}</span>
                      <span>{engagementTrend[engagementTrend.length - 1]?.date}</span>
                    </div>
                  </div>
                )}

                {!loading.analytics && topPosts.length === 0 && byFormat.length === 0 && (
                  <div className="card empty-state">
                    <p>📊 Nenhum dado analítico disponível. Execute uma coleta para calcular as métricas.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="nav-links" style={{ marginTop: "var(--spacing-xl)", marginBottom: "var(--spacing-lg)" }}>
          <Link to="/" className="nav-link">🏠 {d.homeLink}</Link>
          <Link to="/privacy" className="nav-link">🔒 {d.privacyLink}</Link>
          <Link to="/terms" className="nav-link">📋 {d.termsLink}</Link>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({ label, value, icon }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <span className="metric-value">{typeof value === "number" ? value.toLocaleString("pt-BR") : value}</span>
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
