import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import BookingList from '../components/BookingList';
import { useNavigate } from 'react-router-dom';
import { getVenuesByManager, getEnrichedBookings } from '../api/holidaze';
import { handleDeleteVenue } from '../utils/handleDeleteVenue';
import { handleAvatarChangeSubmit } from '../utils/handleAvatarChangeSubmit';
import { handleFormSubmit } from '../utils/handleFormSubmit';
import { handleEditClick } from '../utils/handleEditClick';
import { resetVenueForm } from '../utils/resetVenueForm';
import { useUser } from '../hooks/useUser';
import { useModal } from '../hooks/useModal';

export default function ManagerProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
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
            className="w-24 h-24 rounded-full object-cover border"
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
        <EmptyState
          loading={loading}
          items={venues}
          message="You have not created any venues yet."
        />
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-white h-52 rounded shadow animate-pulse"
              />
            ))}
          </div>
        )}
        {!loading && venues.length > 0 && (
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
                    onClick={() =>
                      handleEditClick(
                        venue,
                        setNewVenue,
                        setEditingVenueId,
                        setShowForm
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 text-sm"
                    onClick={() =>
                      handleDeleteVenue(
                        venue.id,
                        user.name,
                        setVenues,
                        openModal
                      )
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
            resetVenueForm(setNewVenue, setMediaInput, setEditingVenueId);
            setShowForm(!showForm);
          }}
          className="mt-6 mb-6 bg-accent text-white py-2 px-4 rounded hover:opacity-90"
        >
          {showForm ? 'Cancel' : 'Add Venue'}
        </button>

        {showForm && (
          <form
            onSubmit={(e) =>
              handleFormSubmit({
                e,
                editingVenueId,
                newVenue,
                user,
                setEditingVenueId,
                setShowForm,
                setNewVenue,
                setVenues,
                setModal: openModal,
              })
            }
            className="space-y-4 border-t pt-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={newVenue.name}
              onChange={(e) =>
                setNewVenue({ ...newVenue, name: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={newVenue.description}
              onChange={(e) =>
                setNewVenue({ ...newVenue, description: e.target.value })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="url"
              placeholder="Add Image URL and press Enter"
              value={mediaInput}
              onChange={(e) => setMediaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (mediaInput.trim()) {
                    setNewVenue({
                      ...newVenue,
                      media: [...newVenue.media, { url: mediaInput.trim() }],
                    });
                    setMediaInput('');
                  }
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newVenue.price}
              onChange={(e) =>
                setNewVenue({ ...newVenue, price: Number(e.target.value) })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max Guests"
              value={newVenue.maxGuests}
              onChange={(e) =>
                setNewVenue({ ...newVenue, maxGuests: Number(e.target.value) })
              }
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={newVenue.rating}
              onChange={(e) =>
                setNewVenue({ ...newVenue, rating: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Address"
                value={newVenue.location.address}
                onChange={(e) =>
                  setNewVenue({
                    ...newVenue,
                    location: {
                      ...newVenue.location,
                      address: e.target.value,
                    },
                  })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="City"
                value={newVenue.location.city}
                onChange={(e) =>
                  setNewVenue({
                    ...newVenue,
                    location: {
                      ...newVenue.location,
                      city: e.target.value,
                    },
                  })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={newVenue.location.country}
                onChange={(e) =>
                  setNewVenue({
                    ...newVenue,
                    location: {
                      ...newVenue.location,
                      country: e.target.value,
                    },
                  })
                }
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {['wifi', 'parking', 'breakfast', 'pets'].map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={newVenue.meta[feature]}
                    onChange={(e) =>
                      setNewVenue({
                        ...newVenue,
                        meta: {
                          ...newVenue.meta,
                          [feature]: e.target.checked,
                        },
                      })
                    }
                  />
                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="bg-accent text-white py-2 px-4 rounded hover:opacity-90"
            >
              {editingVenueId ? 'Update Venue' : 'Create Venue'}
            </button>
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
