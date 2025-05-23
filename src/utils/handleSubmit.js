import { getHeaders } from '../api/headers';
import { BASE_URL } from '../api/constants';
import { getVenuesByManager } from '../api/holidaze';

export async function handleSubmit(
  e,
  newVenue,
  user,
  setShowForm,
  setNewVenue,
  setVenues,
  openModal
) {
  e.preventDefault();

  if (!user || !user.name) {
    return openModal({
      isOpen: true,
      title: 'Error',
      message: 'User not authenticated.',
    });
  }

  const payload = {
    name: newVenue.name,
    description: newVenue.description,
    price: Number(newVenue.price),
    maxGuests: Number(newVenue.maxGuests),
    rating: Number(newVenue.rating) || 0,
    location: {
      address: newVenue.location.address || '',
      city: newVenue.location.city || '',
      country: newVenue.location.country || '',
    },
    meta: {
      wifi: !!newVenue.meta.wifi,
      parking: !!newVenue.meta.parking,
      breakfast: !!newVenue.meta.breakfast,
      pets: !!newVenue.meta.pets,
    },
    media: Array.isArray(newVenue.media)
      ? newVenue.media.filter((m) => m.url?.startsWith('http'))
      : [],
  };

  try {
    const headers = getHeaders();

    const response = await fetch(`${BASE_URL}/venues`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create venue');
    }

    const created = await response.json();

    const updatedVenues = await getVenuesByManager(user.name);
    setVenues(updatedVenues);

    setShowForm(false);
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

    openModal({
      isOpen: true,
      title: 'Success',
      message: `Venue "${created.data.name}" was created successfully!`,
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    openModal({
      isOpen: true,
      title: 'Error',
      message: error.message || 'Failed to create venue.',
    });
  }
}
