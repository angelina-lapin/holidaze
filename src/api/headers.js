import { API_KEY } from './constants';

export function getHeaders() {
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = new Headers();

  if (user?.accessToken) {
    headers.set('Authorization', `Bearer ${user.accessToken}`);
  }

  headers.set('Content-Type', 'application/json');
  headers.set('X-Noroff-API-Key', API_KEY);

  return headers;
}
