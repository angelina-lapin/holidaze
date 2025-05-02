import { login } from '../api/auth';
import { getHeaders } from '../api/headers';
import { API_BASE } from '../api/constants';

export async function handleLoginSubmit(email, password, setModal, navigate) {
  try {
    const user = await login(email, password);
    const userData = user.data || user;

    const name = userData.name;
    const token = userData.accessToken;

    if (!name || !token) {
      throw new Error('Invalid user data returned from server');
    }

    localStorage.setItem('user', JSON.stringify(userData));

    const profileRes = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
      headers: getHeaders(),
    });

    if (!profileRes.ok) {
      throw new Error('Failed to fetch profile');
    }

    const profileData = await profileRes.json();

    const isManager =
      profileData.data?.venueManager === true ||
      profileData.data?.venueManager === 'true';

    navigate(isManager ? '/manager-profile' : '/user-profile');
  } catch (error) {
    console.error('Login error:', error);
    setModal({
      isOpen: true,
      title: 'Login failed',
      message: error.message,
    });
  }
}
