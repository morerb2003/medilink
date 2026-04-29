import api from './api';

export async function request(payload) {
  const response = await api.post('consent/request', payload);
  return response.data;
}

export async function approve(consentId) {
  const response = await api.post(`consent/${consentId}/approve`);
  return response.data;
}

export async function reject(consentId) {
  const response = await api.post(`consent/${consentId}/reject`);
  return response.data;
}

export async function revoke(consentId) {
  const response = await api.post(`consent/${consentId}/revoke`);
  return response.data;
}

export async function listRequests() {
  return [];
}

export async function checkConsent(patientId, doctorId) {
  const response = await api.get('consent/check', {
    params: { patientId, doctorId },
  });
  return response.data;
}
