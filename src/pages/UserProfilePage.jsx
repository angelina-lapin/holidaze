import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong>{' '}
          {user.venueManager ? 'Venue Manager' : 'Customer'}
        </p>
      </div>
    </div>
  );
}
