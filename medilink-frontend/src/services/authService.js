import api from './api';

export async function login(payload) {
  const response = await api.post('auth/login', payload);
  return response.data;
}

export async function register(payload) {
  const response = await api.post('auth/register', payload);
  return response.data;
}

export async function refresh(token) {
  const response = await api.post('auth/refresh', { token });
  return response.data;
}

export async function logout() {
  try {
    await api.post('auth/logout');
  } catch (error) {
    if (error.response?.status !== 404) {
      throw error;
    }
  }
}
