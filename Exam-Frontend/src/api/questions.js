import { request } from './client';

export async function fetchQuestionsByExamApi(examId) {
  return request(`/questions/exam/${examId}`);
}

export async function addQuestionApi(data) {
  return request('/questions', {
    method: 'POST',
    body: data,
  });
}

export async function deleteQuestionApi(id) {
  return request(`/questions/${id}`, {
    method: 'DELETE',
  });
}
