import api from './api';

export const startInterview = async (type, targetRole, experienceLevel) => {
  const response = await api.post('/interview/start', { type, targetRole, experienceLevel });
  return response.data.data; // { sessionId, questions }
};

export const submitAnswer = async (sessionId, questionIndex, answer, duration) => {
  const response = await api.post(`/interview/${sessionId}/submit`, { questionIndex, answer, duration });
  return response.data.data;
};

export const analyzeInterview = async (sessionId) => {
  const response = await api.post(`/interview/${sessionId}/analyze`);
  return response.data.data; // feedback object
};

export const getSessions = async () => {
  const response = await api.get('/interview/sessions');
  return response.data.data;
};

export const getSessionById = async (sessionId) => {
  const response = await api.get(`/interview/sessions/${sessionId}`);
  return response.data.data;
};
