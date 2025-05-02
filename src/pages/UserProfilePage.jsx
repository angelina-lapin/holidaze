import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE } from '../api/constants';
import { getHeaders } from '../api/headers';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setAvatarUrl(parsedUser.avatar?.url || 'https://via.placeholder.com/150');

    async function fetchBookings() {
      try {
        const res = await fetch(
          `${API_BASE}/holidaze/profiles/${parsedUser.name}/bookings`,
          {
            headers: getHeaders(),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await res.json();
        setBookings(data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }

    fetchBookings();
  }, [navigate]);

  function handleAvatarChange(e) {
    const newUrl = e.target.value;
    setAvatarUrl(newUrl);
    setUser((prev) => ({ ...prev, avatar: { url: newUrl } }));
    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, avatar: { url: newUrl } })
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Update Avatar URL:
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={handleAvatarChange}
                className="w-full max-w-xs border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="border rounded p-4 bg-white shadow-sm"
                >
                  <p className="font-medium">{booking.venue.name}</p>
                  <p className="text-sm text-gray-600">
                    From: {new Date(booking.dateFrom).toLocaleDateString()}{' '}
                    <br />
                    To: {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">You have no upcoming bookings.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
