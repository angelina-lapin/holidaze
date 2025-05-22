import { removeUser } from './storage';

export function handleLogout(setUser, navigate) {
  removeUser();
  setUser(null);
  navigate('/');
}
