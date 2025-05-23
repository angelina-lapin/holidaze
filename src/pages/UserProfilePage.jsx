import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrichedBookings } from '../api/holidaze';
import { handleAvatarUpdate } from '../utils/handleAvatarUpdate';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingList from '../components/BookingList';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { useModal } from '../hooks/useModal';
import { useUser } from '../hooks/useUser';

export default function UserProfilePage() {
  const { user, setUser } = useUser();
  const [myBookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { modal, openModal, closeModal } = useModal();
  const [newAvatar, setNewAvatar] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    getEnrichedBookings(user.name)
      .then(setBookings)
      .catch((err) => console.error('Failed to load bookings', err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleAvatarChangeSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    handleAvatarUpdate({
      user,
      avatarUrl: newAvatar,
      setUser,
      setModal: openModal,
    });
    setNewAvatar('');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

        {/* Аватар и форма */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={user.avatar?.url || 'https://via.placeholder.com/100'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <form
            onSubmit={handleAvatarChangeSubmit}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="url"
              placeholder="New avatar URL"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              required
              className="border rounded px-3 py-1 w-full sm:w-64"
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
        <EmptyState
          loading={loading}
          items={myBookings}
          message="You have no bookings yet."
        />
        {!loading && myBookings.length > 0 && (
          <BookingList
            bookings={myBookings}
            user={user}
            setModal={openModal}
            setBookings={setBookings}
          />
        )}
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
