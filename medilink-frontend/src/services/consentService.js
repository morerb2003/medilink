import api from './api';

export async function request(payload) {
  const response = await api.post('consents/request', payload);
  return response.data;
}

export async function approve({ consentId, durationHours }) {
  const response = await api.post(`consents/${consentId}/approve`, { durationHours });
  return response.data;
}

export async function reject(consentId) {
  const response = await api.post(`consents/${consentId}/reject`);
  return response.data;
}

export async function revoke(consentId) {
  const response = await api.post(`consents/${consentId}/revoke`);
  return response.data;
}

export async function listRequests({ userId, role }) {
  const params = role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId };
  const response = await api.get('consents', { params });
  return response.data;
}

export async function checkConsent(patientId, doctorId) {
  const response = await api.get('consents/check', {
    params: { patientId, doctorId },
  });
  return response.data;
}
