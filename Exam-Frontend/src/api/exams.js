import { request } from './client';

export async function fetchActiveExamsApi() {
  return request('/exams');
}

export async function fetchExamByIdApi(id) {
  return request(`/exams/${id}`);
}

export async function fetchMyCreatedExamsApi() {
  return request('/exams/my-created');
}

export async function createExamApi(data) {
  return request('/exams', {
    method: 'POST',
    body: data,
  });
}

export async function updateExamApi(id, data) {
  return request(`/exams/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteExamApi(id) {
  return request(`/exams/${id}`, {
    method: 'DELETE',
  });
}
