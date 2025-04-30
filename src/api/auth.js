import { API_BASE } from './constants';

const AUTH_URL = `${API_BASE}/auth`;

export async function login(email, password) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  data.venueManager =
    data.venueManager === true || data.venueManager === 'true';
  return data;
}

export async function register(name, email, password, venueManager = false) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ name, email, password, venueManager }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Registration failed');
  }

  return await response.json();
}

export async function logout() {
  const token = JSON.parse(localStorage.getItem('user'))?.accessToken;

  if (!token) {
    throw new Error('No token found');
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const response = await fetch(`${AUTH_URL}/logout`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  localStorage.removeItem('user');
}
