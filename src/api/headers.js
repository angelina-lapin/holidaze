import { API_KEY } from './constants';

export function getHeaders() {
  const user = localStorage.getItem('user');
  let token;

  try {
    token = JSON.parse(user)?.accessToken;
  } catch (error) {
    console.error('Failed to parse token from localStorage');
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (API_KEY) {
    headers.set('X-Noroff-API-Key', API_KEY);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
