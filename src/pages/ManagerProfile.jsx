import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getUser } from '../utils/storage';
import { getVenuesByManager } from '../api/holidaze';
import { useNavigate } from 'react-router-dom';
import { handleSubmit } from '../utils/handleSubmit';
import { handleDeleteVenue } from '../utils/handleDeleteVenue';
import { handleAvatarUpdate } from '../utils/handleAvatarUpdate';
import { handleUpdateVenue } from '../utils/handleUpdateVenue';

export default function ManagerProfile() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getUser());
  const [showForm, setShowForm] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
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
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [newAvatar, setNewAvatar] = useState('');
  const [mediaInput, setMediaInput] = useState('');

  useEffect(() => {
    if (!user?.name) return;
    getVenuesByManager(user.name)
      .then(setVenues)
      .catch((err) => console.error('Error loading venues:', err))
      .finally(() => setLoading(false));
  }, [user]);

  function handleAvatarChangeSubmit(e) {
    e.preventDefault();
    if (!user) return;

    handleAvatarUpdate({
      user,
      avatarUrl: newAvatar,
      setUser,
      setModal,
    });
    setNewAvatar('');
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

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.name || 'Venue Manager'}!
        </h1>

        <div className="mb-6 flex items-center gap-4">
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

        <p className="mb-4 text-muted">
          Manage your venues and track bookings.
        </p>

        <div className="mb-6">
          <button
            onClick={() => {
              resetVenueForm();
              setShowForm(!showForm);
            }}
            className="mt-2 bg-accent text-white py-2 px-4 rounded hover:opacity-90"
          >
            {showForm ? 'Cancel' : 'Add Venue'}
          </button>

          {showForm && (
            <form
              onSubmit={(e) => {
                if (editingVenueId) {
                  handleUpdateVenue(
                    e,
                    editingVenueId,
                    newVenue,
                    setEditingVenueId,
                    setShowForm,
                    setNewVenue,
                    setVenues,
                    setModal
                  );
                } else {
                  handleSubmit(
                    e,
                    newVenue,
                    setShowForm,
                    setNewVenue,
                    setVenues
                  );
                }
              }}
              className="mt-4 space-y-4 border-t pt-4"
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
              {newVenue.media.length > 0 && (
                <ul className="text-sm text-gray-600 list-disc pl-4">
                  {newVenue.media.map((img, i) => (
                    <li key={i}>{img.url}</li>
                  ))}
                </ul>
              )}

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
                  setNewVenue({
                    ...newVenue,
                    maxGuests: Number(e.target.value),
                  })
                }
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (optional)"
                value={newVenue.rating}
                onChange={(e) =>
                  setNewVenue({
                    ...newVenue,
                    rating: e.target.value,
                  })
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
        </div>

        {loading ? (
          <p>Loading venues...</p>
        ) : venues.length === 0 ? (
          <p>You have not created any venues yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold text-accent mb-2">
                  {venue.name}
                </h2>
                <p className="text-sm text-muted mb-2">
                  {venue.description || 'No description'}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Bookings: {venue._count?.bookings || 0}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => handleEditClick(venue)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    onClick={() =>
                      handleDeleteVenue(venue.id, setVenues, setModal)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
