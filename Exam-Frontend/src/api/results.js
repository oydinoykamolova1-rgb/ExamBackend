import { request } from './client';

export async function submitExamApi(examId, answers) {
  return request('/results/submit', {
    method: 'POST',
    body: { examId, answers },
  });
}

export async function fetchMyResultsApi() {
  return request('/results/my-results');
}

export async function fetchExamResultsApi(examId) {
  return request(`/results/exam/${examId}`);
}

export async function fetchResultByIdApi(id) {
  return request(`/results/${id}`);
}
