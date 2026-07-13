import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const machineApi = {
  getMachines: () => api.get('/api/machines'),
  getTelemetry: (id) => api.get(`/api/telemetry/${id}`),
  predictFailure: (data) => api.post('/api/predict', data),
  getAlerts: () => api.get('/api/alerts'),
};

export default api;
