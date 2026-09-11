import { request } from './client';

export async function loginApi(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerApi(fullName, email, password, role) {
  return request('/auth/register', {
    method: 'POST',
    body: { fullName, email, password, role: parseInt(role, 10) },
  });
}
