import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import BookingList from '../components/BookingList';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/storage';
import { getVenuesByManager, getEnrichedBookings } from '../api/holidaze';
import { handleSubmit } from '../utils/handleSubmit';
import { handleUpdateVenue } from '../utils/handleUpdateVenue';
import { handleDeleteVenue } from '../utils/handleDeleteVenue';
import { handleAvatarChangeSubmit } from '../utils/handleAvatarChangeSubmit';
import { useModal } from '../hooks/useModal';

export default function ManagerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [mediaInput, setMediaInput] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [myBookings, setMyBookings] = useState([]);

  const { modal, openModal, closeModal } = useModal();

  const [newVenue, setNewVenue] = useState({
    name: '',
    description: '',
    media: [],
    price: '',
    maxGuests: '',
    rating: '',
    location: { address: '', city: '', country: '' },
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
  });

  useEffect(() => {
    if (!user?.name) return;

    setLoading(true);
    Promise.all([getVenuesByManager(user.name), getEnrichedBookings(user.name)])
      .then(([venuesData, bookingsData]) => {
        setVenues(venuesData);
        setMyBookings(bookingsData);
      })
      .catch((err) => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  }, [user]);

  function handleEditClick(venue) {
    setNewVenue({
      name: venue.name,
      description: venue.description,
      media: venue.media || [],
      price: venue.price,
      maxGuests: venue.maxGuests,
      rating: venue.rating || '',
      location: venue.location || { address: '', city: '', country: '' },
      meta: venue.meta || {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
    });
    setEditingVenueId(venue.id);
    setShowForm(true);
  }

  function resetVenueForm() {
    setNewVenue({
      name: '',
      description: '',
      media: [],
      price: '',
      maxGuests: '',
      rating: '',
      location: { address: '', city: '', country: '' },
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
    });
    setMediaInput('');
    setEditingVenueId(null);
  }

  function handleFormSubmit(e) {
    if (editingVenueId) {
      handleUpdateVenue(
        e,
        editingVenueId,
        newVenue,
        setEditingVenueId,
        setShowForm,
        setNewVenue,
        setVenues,
        openModal
      );
    } else {
      handleSubmit(e, newVenue, setShowForm, setNewVenue, setVenues);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.name || 'Venue Manager'}!
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
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
                setModal: openModal,
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

        <h2 className="text-2xl font-semibold mt-10 mb-4">Your Venues</h2>
        {loading ? (
          <p>Loading venues...</p>
        ) : venues.length === 0 ? (
          <p>You have not created any venues yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded shadow p-4">
                <h2
                  className="text-lg font-semibold text-accent mb-1 cursor-pointer hover:underline"
                  onClick={() => navigate(`/venue/${venue.id}`)}
                >
                  {venue.name}
                </h2>
                <p className="text-sm text-muted mb-1">
                  {venue.description || 'No description'}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Bookings: {venue.bookings?.length || 0}
                </p>

                <div className="flex gap-2 mb-2">
                  <button
                    className="bg-accent text-white px-4 py-1 rounded hover:opacity-90 text-sm"
                    onClick={() => handleEditClick(venue)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 text-sm"
                    onClick={() =>
                      handleDeleteVenue(venue.id, setVenues, openModal)
                    }
                  >
                    Delete
                  </button>
                </div>

                {venue.bookings?.length > 0 && (
                  <div className="border-t pt-2 mt-2 text-sm text-gray-600">
                    <strong>Bookings:</strong>
                    <ul className="list-disc ml-4 mt-1">
                      {venue.bookings.map((booking) => (
                        <li key={booking.id}>
                          {new Date(booking.dateFrom).toLocaleDateString()} –{' '}
                          {new Date(booking.dateTo).toLocaleDateString()} (
                          {booking.guests} guests)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            resetVenueForm();
            setShowForm(!showForm);
          }}
          className="mt-6 mb-6 bg-accent text-white py-2 px-4 rounded hover:opacity-90"
        >
          {showForm ? 'Cancel' : 'Add Venue'}
        </button>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="space-y-4 border-t pt-4">
            {/* поля формы без изменений */}
            {/* ... */}
          </form>
        )}

        <h2 className="text-2xl font-semibold mb-4">Your bookings</h2>
        <BookingList
          bookings={myBookings}
          loading={loading}
          user={user}
          setModal={openModal}
          setBookings={setMyBookings}
        />
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
