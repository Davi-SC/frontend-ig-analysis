/**
 * backendClient.js — Cliente centralizado para o backend Instagram Analytics API
 *
 * Todas as chamadas ao backend passam por aqui. O access_token nunca
 * sai do backend — o frontend só envia o profile_id via header X-Profile-ID.
 *
 * Uso:
 *   import { backendGet, backendPost } from '../api/backendClient';
 *   const data = await backendGet('/data/profile');
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PROFILE_ID_KEY = "ig_profile_id";

// ── Gerenciamento do profile_id na sessão ─────────────────────────────────────

export function saveProfileId(profileId) {
  sessionStorage.setItem(PROFILE_ID_KEY, profileId);
}

export function getProfileId() {
  return sessionStorage.getItem(PROFILE_ID_KEY);
}

export function clearProfileId() {
  sessionStorage.removeItem(PROFILE_ID_KEY);
}

// ── Helpers internos ──────────────────────────────────────────────────────────

function buildHeaders(requiresAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth) {
    const profileId = getProfileId();
    if (!profileId) throw new Error("Usuário não autenticado. Faça login novamente.");
    headers["X-Profile-ID"] = profileId;
  }
  return headers;
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.detail || json?.message || `Erro ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

// ── GET autenticado ───────────────────────────────────────────────────────────

export async function backendGet(path, params = {}) {
  const url = new URL(`${BACKEND_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: buildHeaders(true),
  });
  return handleResponse(res);
}

// ── POST autenticado ──────────────────────────────────────────────────────────

export async function backendPost(path, body = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

// ── POST público (sem X-Profile-ID — usado no OAuth) ─────────────────────────

export async function backendPostPublic(path, body = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

// ── GET público (sem X-Profile-ID — usado no OAuth) ──────────────────────────

export async function backendGetPublic(path) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
}
