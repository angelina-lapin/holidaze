import { BASE_URL } from '../api/constants';
import { getHeaders } from '../api/headers';

export async function handleUpdateVenue(
  e,
  venueId,
  updatedVenue,
  setEditingVenueId,
  setShowForm,
  setNewVenue,
  setVenues,
  setModal
) {
  e.preventDefault();

  try {
    const headers = getHeaders();

    const payload = {
      name: updatedVenue.name,
      description: updatedVenue.description,
      price: Number(updatedVenue.price),
      maxGuests: Number(updatedVenue.maxGuests),
      rating: Number(updatedVenue.rating) || 0,
      location: {
        address: updatedVenue.location.address || '',
        city: updatedVenue.location.city || '',
        country: updatedVenue.location.country || '',
      },
      meta: {
        wifi: !!updatedVenue.meta.wifi,
        parking: !!updatedVenue.meta.parking,
        breakfast: !!updatedVenue.meta.breakfast,
        pets: !!updatedVenue.meta.pets,
      },
      media: Array.isArray(updatedVenue.media)
        ? updatedVenue.media.filter((m) => m.url?.startsWith('http'))
        : [],
    };

    const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update venue');
    }

    const result = await response.json();

    setVenues((prev) => prev.map((v) => (v.id === venueId ? result.data : v)));

    setEditingVenueId(null);
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

    setModal({
      isOpen: true,
      title: 'Venue Updated',
      message: 'The venue was successfully updated.',
    });
  } catch (error) {
    console.error('Update error:', error);
    setModal({
      isOpen: true,
      title: 'Error',
      message: error.message || 'Something went wrong updating the venue.',
    });
  }
}
