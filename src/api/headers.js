import { API_KEY } from './constants';
import { getToken } from '../utils/storage';

export function getHeaders() {
  const token = getToken();

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
