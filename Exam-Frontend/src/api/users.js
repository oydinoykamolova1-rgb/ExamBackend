import { request } from './client';

export async function fetchAllUsersApi() {
  return request('/users');
}

export async function updateUserApi(id, fullName, role) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: { fullName, role: parseInt(role, 10) },
  });
}

export async function deleteUserApi(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}
