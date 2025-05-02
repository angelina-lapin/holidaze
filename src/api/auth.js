import { API_BASE } from './constants';

const AUTH_URL = `${API_BASE}/auth`;

export async function login(email, password) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return await response.json();
}

export async function register(name, email, password, venueManager = false) {
  console.log('Registration body:', { name, email, password, venueManager });

  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  const response = await fetch(`${AUTH_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  localStorage.removeItem('user');
}
