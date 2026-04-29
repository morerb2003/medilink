import axios from 'axios';

let accessToken = null;
let unauthorizedHandler = null;

function normalizeApiBaseUrl(rawUrl) {
  if (!rawUrl) {
    return '/api';
  }

  if (rawUrl === '/api') {
    return rawUrl;
  }

  if (/^https?:\/\//.test(rawUrl)) {
    const url = new URL(rawUrl);
    const normalizedPath = url.pathname.replace(/\/$/, '');
    url.pathname = normalizedPath.endsWith('/api')
      ? normalizedPath
      : `${normalizedPath}/api`;
    return url.toString().replace(/\/$/, '');
  }

  const normalizedPath = rawUrl.replace(/\/$/, '');
  return normalizedPath.endsWith('/api') ? normalizedPath : `${normalizedPath}/api`;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();

      if (unauthorizedHandler) {
        unauthorizedHandler();
      } else if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
