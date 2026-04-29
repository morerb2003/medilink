import api from './api';

export async function upload(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  const response = await api.post('records', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function listMine(patientId) {
  const response = await api.get(`records/self/${patientId}`);
  return response.data;
}

export async function listForPatient(patientId, doctorId) {
  const response = await api.get(`records/patient/${patientId}`, {
    params: { doctorId },
  });
  return response.data;
}
