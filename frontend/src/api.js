/**
 * api.js
 * ------
 * Axios wrapper for all backend API calls.
 * The proxy in package.json forwards /api/* to http://localhost:8000
 */

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes – model inference can be slow
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Upload a file and extract its text content.
 * @param {File} file - The file object from an <input type="file">
 * @returns {Promise<{text: string, filename: string, char_count: number}>}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  // Do NOT set Content-Type manually — axios must set it automatically
  // so the multipart boundary is included correctly.
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': undefined },
  });
  return response.data;
}

/**
 * Run the full simplification pipeline on the provided text.
 * @param {string} text  - Educational content to simplify
 * @param {string} level - Learner level key
 * @returns {Promise<SimplifyResponse>}
 */
export async function simplifyContent(text, level) {
  const response = await api.post('/simplify', { text, level });
  return response.data;
}

/**
 * Health check – verifies the backend is reachable.
 * @returns {Promise<object>}
 */
export async function healthCheck() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
