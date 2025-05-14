import { BASE_URL } from '../api/constants';
import { getHeaders } from '../api/headers';
import { getUser } from './storage';
import { getVenuesByManager } from '../api/holidaze';

export async function handleDeleteVenue(venueId, setVenues, setModal) {
  try {
    const headers = getHeaders();

    const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete venue');
    }

    const user = getUser();
    const updatedVenues = await getVenuesByManager(user.name);
    setVenues(updatedVenues);

    setModal({
      isOpen: true,
      title: 'Venue Deleted',
      message: 'The venue was successfully deleted.',
    });
  } catch (error) {
    console.error('Failed to delete venue:', error);
    setModal({
      isOpen: true,
      title: 'Error',
      message: error.message || 'Something went wrong while deleting venue.',
    });
  }
}
