import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrichedBookings } from '../api/holidaze';
import { handleAvatarUpdate } from '../utils/handleAvatarUpdate';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [newAvatar, setNewAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
      getEnrichedBookings(storedUser.name)
        .then(setBookings)
        .catch((err) => console.error('Failed to load bookings', err))
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  if (!user) return null;

  function handleAvatarChangeSubmit(e) {
    e.preventDefault();
    handleAvatarUpdate({
      user,
      avatarUrl: newAvatar,
      setUser,
      setModal,
    });
    setNewAvatar('');
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

        <div className="mb-8 flex items-center gap-4">
          <img
            src={user.avatar?.url || 'https://via.placeholder.com/100'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <form onSubmit={handleAvatarChangeSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="New avatar URL"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              required
              className="border rounded px-3 py-1 w-64"
            />
            <button
              type="submit"
              className="bg-accent text-white px-4 py-1 rounded hover:opacity-90"
            >
              Update
            </button>
          </form>
        </div>

        <p className="mb-2 text-gray-600">Email: {user.email}</p>
        <p className="mb-6 text-gray-600">
          Role: {user.venueManager ? 'Venue Manager' : 'Customer'}
        </p>

        <h2 className="text-2xl font-semibold mb-4">Upcoming bookings</h2>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-white shadow rounded p-4">
                {booking.venue?.name ? (
                  <h3
                    className="text-xl font-semibold text-accent hover:underline cursor-pointer"
                    onClick={() => navigate(`/venue/${booking.venue.id}`)}
                  >
                    {booking.venue.name}
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-400">
                    Unknown Venue
                  </h3>
                )}

                <p className="text-sm text-gray-600">
                  From: {new Date(booking.dateFrom).toLocaleDateString()} – To:{' '}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found.</p>
        )}
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
