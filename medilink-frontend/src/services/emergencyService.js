import api from './api';

export async function accessByHealthId({ healthId, doctorId, ipAddress = '0.0.0.0' }) {
  const response = await api.post(`emergency/health-id/${healthId}`, null, {
    params: { doctorId, ipAddress },
  });
  return response.data;
}

export async function accessByQR({ token, doctorId, ipAddress = '0.0.0.0' }) {
  const response = await api.post(
    'emergency/qr',
    { token },
    {
      params: { doctorId, ipAddress },
    },
  );
  return response.data;
}
