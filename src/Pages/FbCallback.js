import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Rota dedicada ao callback OAuth do Facebook (implicit flow).
 * O Facebook redireciona para /auth/fb/callback#access_token=...
 * Esta página processa o token, salva no backend e redireciona para /dashboard.
 */
export default function FbCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processando login com Facebook...");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // 1. Lê o token do hash da URL
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const token = hash.get("long_lived_token") || hash.get("access_token");

        console.log("[FbCallback] hash completo:", window.location.hash);
        console.log("[FbCallback] token extraído:", token ? token.substring(0, 30) + "..." : "NULO");

        if (!token) {
          throw new Error("Token não encontrado na URL. O login pelo Facebook falhou.");
        }

        // 2. Busca as Pages do Facebook
        setStatus("Buscando páginas do Facebook...");
        const pagesRes = await fetch(
          `https://graph.facebook.com/v25.0/me/accounts?access_token=${token}`
        );
        const pages = await pagesRes.json();
        console.log("[FbCallback] /me/accounts:", JSON.stringify(pages));

        if (!pages.data || pages.data.length === 0) {
          throw new Error("Nenhuma Página do Facebook encontrada na conta.");
        }

        // 3. Busca a conta Instagram Business vinculada à primeira Page
        setStatus("Buscando conta Instagram Business...");
        const page = pages.data[0];
        const pageRes = await fetch(
          `https://graph.facebook.com/v25.0/${page.id}?fields=instagram_business_account{id,username}&access_token=${token}`
        );
        const pageDetails = await pageRes.json();
        console.log("[FbCallback] pageDetails:", JSON.stringify(pageDetails));

        if (!pageDetails.instagram_business_account) {
          throw new Error("Nenhuma conta Instagram Business vinculada à página.");
        }

        const igUserId = pageDetails.instagram_business_account.id;
        const igUsername = pageDetails.instagram_business_account.username || "";
        console.log("[FbCallback] igUserId:", igUserId, "| igUsername:", igUsername);

        // 4. Salva no backend
        setStatus("Salvando no banco de dados...");
        console.log("[FbCallback] chamando POST /oauth/fb/save...");
        const saveRes = await fetch(`${BACKEND_URL}/oauth/fb/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token, user_id: igUserId, username: igUsername }),
        });
        const saveData = await saveRes.json().catch(() => ({}));
        console.log("[FbCallback] /oauth/fb/save status:", saveRes.status, "| body:", JSON.stringify(saveData));

        if (!saveRes.ok) {
          // Loga mas não bloqueia — o usuário ainda pode usar o dashboard
          console.warn("[FbCallback] Aviso: token salvo em sessão mas falhou no banco:", saveData.detail || saveRes.status);
        } else {
          console.log("[FbCallback] Salvo com sucesso no banco!");
        }

        // 5. Passa o contexto de sessão para o Dashboard via sessionStorage
        sessionStorage.setItem("fb_access_token", token);
        sessionStorage.setItem("fb_ig_user_id", igUserId);

        // 6. Redireciona para o dashboard
        setStatus("Redirecionando...");
        navigate("/dashboard", { replace: true });

      } catch (err) {
        console.error("[FbCallback] Erro:", err.message);
        setError(err.message);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", gap: "16px",
        fontFamily: "sans-serif", padding: "24px", textAlign: "center"
      }}>
        <span style={{ fontSize: "2rem" }}>⚠️</span>
        <h2 style={{ color: "#c0392b" }}>Erro no login com Facebook</h2>
        <p style={{ color: "#555", maxWidth: "400px" }}>{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 24px", borderRadius: "8px", border: "none",
            background: "#1877f2", color: "#fff", cursor: "pointer", fontSize: "1rem"
          }}
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", gap: "16px",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        width: "48px", height: "48px", border: "5px solid #e0e0e0",
        borderTop: "5px solid #1877f2", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#555", fontSize: "1rem" }}>{status}</p>
    </div>
  );
}
