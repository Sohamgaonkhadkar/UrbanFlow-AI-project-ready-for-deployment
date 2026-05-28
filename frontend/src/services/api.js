import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

export const getForecast = async (payload) => {
  const response = await api.post('/predict', payload);
  return response.data;
};

export default api;