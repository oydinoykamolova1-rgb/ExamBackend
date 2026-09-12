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
    const contentType = response.headers.get('content-type') || '';

    // If server returned HTML (e.g. Vercel static rewrite to index.html) or error status
    if (
      contentType.includes('text/html') ||
      response.status === 405 ||
      response.status === 404 ||
      response.status === 502 ||
      response.status === 503
    ) {
      console.warn(`[API Client] Static server returned HTML/Status ${response.status} for ${endpoint}. Falling back to client-side Mock Engine.`);
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

    // Try parsing JSON; if text/html was returned, catch block will intercept SyntaxError
    const data = await response.json();
    return data;
  } catch (error) {
    // Catch fetch/network errors or JSON syntax errors (e.g. HTML returned as 200 OK)
    if (
      error.name === 'SyntaxError' ||
      error.name === 'TypeError' ||
      error.message.includes('JSON') ||
      error.message.includes('Unexpected token') ||
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch')
    ) {
      console.warn(`[API Client] Non-JSON or Network error for ${endpoint}. Falling back to client-side Mock Engine.`, error);
      return handleMockRequest(endpoint, config);
    }
    throw error;
  }
}


