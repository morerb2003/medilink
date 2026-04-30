import api from './api';

export async function getProfile(patientId) {
  const response = await api.get(`patients/${patientId}`);
  return response.data;
}

export async function updateProfile(patientId, payload) {
  const response = await api.put(`patients/${patientId}`, payload);
  return response.data;
}

export async function generateQR(patientId) {
  const response = await api.get(`patients/qr/${patientId}`);
  return response.data;
}

export async function searchPatients(query) {
  const response = await api.get('patients/search', {
    params: { query },
  });
  return response.data;
}
