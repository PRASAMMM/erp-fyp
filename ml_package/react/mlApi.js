// ─── api/mlApi.js ─────────────────────────────────────────────────────────────
// Add these functions to your existing src/services/api.js file
// (or create this as a separate src/services/mlApi.js and import where needed)

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── ML API functions ─────────────────────────────────────────────────────────

/**
 * Get full ML prediction for the currently logged-in student.
 * Pulls their real data from the DB automatically.
 */
export const getStudentPrediction = async (studentId) => {
  const res = await api.get(`/api/ml/predict/${studentId}`);
  return res.data;
};

/**
 * Get prediction with manual feature values (for demo / testing).
 */
export const getPredictionManual = async (features) => {
  const res = await api.post('/api/ml/predict', features);
  return res.data;
};

/**
 * Get all at-risk students (admin/faculty only).
 */
export const getAtRiskStudents = async () => {
  const res = await api.get('/api/ml/at-risk');
  return res.data;
};

/**
 * Check if Flask ML service is running.
 */
export const checkMLHealth = async () => {
  const res = await api.get('/api/ml/health');
  return res.data;
};

export default api;
