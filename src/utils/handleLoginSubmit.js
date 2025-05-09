import { login } from '../api/auth';
import { API_BASE, API_KEY } from '../api/constants';
import { setUser, setToken } from '../utils/storage';

export async function handleLoginSubmit(email, password, setModal, navigate) {
  try {
    const loginRes = await login(email, password);
    const loginData = loginRes.data || loginRes;

    const name = loginData.name;
    const token = loginData.accessToken;

    if (!name || !token) {
      throw new Error('Invalid login response');
    }

    const profileRes = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
    });

    if (!profileRes.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profileData = await profileRes.json();

    const fullUser = {
      ...loginData,
      ...profileData.data,
    };

    setUser(fullUser);
    setToken(token);

    navigate(fullUser.venueManager ? '/manager-profile' : '/user-profile');
  } catch (error) {
    console.error('Login error:', error);
    setModal({
      isOpen: true,
      title: 'Login failed',
      message: error.message,
    });
  }
}
