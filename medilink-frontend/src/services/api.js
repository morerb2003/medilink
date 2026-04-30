import axios from 'axios';

let accessToken = null;
let unauthorizedHandler = null;

function normalizeApiBaseUrl(rawUrl) {
  if (!rawUrl) {
    return '/api/v1';
  }

  if (rawUrl === '/api' || rawUrl === '/api/v1') {
    return '/api/v1';
  }

  if (/^https?:\/\//.test(rawUrl)) {
    const url = new URL(rawUrl);
    const normalizedPath = url.pathname.replace(/\/$/, '');
    if (normalizedPath.endsWith('/api/v1')) {
      url.pathname = normalizedPath;
    } else if (normalizedPath.endsWith('/api')) {
      url.pathname = `${normalizedPath}/v1`;
    } else {
      url.pathname = `${normalizedPath}/api/v1`;
    }
    return url.toString().replace(/\/$/, '');
  }

  const normalizedPath = rawUrl.replace(/\/$/, '');
  if (normalizedPath.endsWith('/api/v1')) {
    return normalizedPath;
  }
  if (normalizedPath.endsWith('/api')) {
    return `${normalizedPath}/v1`;
  }
  return `${normalizedPath}/api/v1`;
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
