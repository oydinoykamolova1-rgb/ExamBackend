import { handleMockRequest } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If server returned 405 Method Not Allowed or 404 Not Found (common on static hostings like Vercel without API server)
    if (response.status === 405 || response.status === 404 || response.status === 502 || response.status === 503) {
      console.warn(`[API Client] Server returned ${response.status} for ${endpoint}. Falling back to client-side Mock Engine.`);
      return handleMockRequest(endpoint, config);
    }

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return response.json();
  } catch (error) {
    // Catch fetch/network errors (e.g. backend server offline or CORS) and fallback to mock
    if (error.name === 'TypeError' || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.warn(`[API Client] Network error connecting to ${BASE_URL}${endpoint}. Falling back to client-side Mock Engine.`, error);
      return handleMockRequest(endpoint, config);
    }
    throw error;
  }
}

