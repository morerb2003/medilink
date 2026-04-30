import api from './api';

export async function initiateAccess({ healthIdOrQrToken, doctorId, reason, ipAddress = '0.0.0.0' }) {
  const response = await api.post('emergency/initiate', {
    healthIdOrQrToken,
    doctorId,
    reason,
    ipAddress,
  });
  return response.data;
}

export async function verifyOtp({ sessionId, otp, doctorId }) {
  const response = await api.post('emergency/verify-otp', {
    sessionId,
    otp,
    doctorId,
  });
  return response.data;
}

// Legacy wrappers updated to use reason
export async function accessByHealthId({ healthId, doctorId, reason, ipAddress = '0.0.0.0' }) {
  const response = await api.post(`emergency/health-id/${healthId}`, null, {
    params: { doctorId, ipAddress, reason },
  });
  return response.data;
}

export async function accessByQR({ token, doctorId, reason, ipAddress = '0.0.0.0' }) {
  const response = await api.post(
    'emergency/qr',
    { token },
    {
      params: { doctorId, ipAddress, reason },
    },
  );
  return response.data;
}
