import { useEffect, useState } from 'react';
import { getUser } from '../utils/storage';

export function useUser() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const stored = getUser();
    if (stored) setUser(stored);
  }, []);

  return { user, setUser };
}
