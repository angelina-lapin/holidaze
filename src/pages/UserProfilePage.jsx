import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrichedBookings } from '../api/holidaze';
import { handleAvatarChangeSubmit } from '../utils/handleAvatarChangeSubmit';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import BookingList from '../components/BookingList';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [myBookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: '',
    onConfirm: null,
  });
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

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={user.avatar?.url || 'https://via.placeholder.com/100'}
            alt="avatar"
            className="w-24 h-24 max-w-full rounded-full object-cover border"
          />
          <form
            onSubmit={(e) =>
              handleAvatarChangeSubmit({
                e,
                user,
                newAvatar,
                setUser,
                setModal,
                setNewAvatar,
              })
            }
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
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
        <BookingList
          bookings={myBookings}
          loading={loading}
          user={user}
          setModal={setModal}
          setBookings={setBookings}
        />
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
