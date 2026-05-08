import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;
export const useApi = !!API_URL;

export const api = axios.create({
  baseURL: API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "buybuddy_token";

// Per-tab token storage so that each browser tab can hold its own session.
// We try sessionStorage first (tab-scoped); fall back to localStorage only if
// sessionStorage is unavailable (e.g. Safari private mode).
const tokenStore: Storage = (() => {
  try {
    sessionStorage.setItem("__b", "1");
    sessionStorage.removeItem("__b");
    return sessionStorage;
  } catch {
    return localStorage;
  }
})();

export const setToken = (t: string | null) => {
  if (t) tokenStore.setItem(TOKEN_KEY, t);
  else tokenStore.removeItem(TOKEN_KEY);
};
export const getToken = () => tokenStore.getItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Normalize Mongo _id → id, keep all other fields
export const normalize = <T extends { _id?: string; id?: string }>(o: T): T & { id: string } => {
  const { _id, ...rest } = o as any;
  return { id: _id || (o as any).id, ...rest };
};
