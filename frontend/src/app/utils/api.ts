import axios from 'axios';

// Si existe la variable de entorno (en la nube), úsala. Si no, usa localhost (en tu PC).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});
// Interceptor: Antes de enviar la petición, pega el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;