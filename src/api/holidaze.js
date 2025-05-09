import { getHeaders } from './headers';
import { BASE_URL } from './constants';

export async function getVenues() {
  try {
    const response = await fetch(`${BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

export async function getVenueById(id) {
  try {
    const response = await fetch(`${BASE_URL}/venues/${id}?_bookings=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch venue');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching venue by id:', error);
    return null;
  }
}

export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  console.log('Sending booking with:', { dateFrom, dateTo, guests, venueId });

  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      dateFrom,
      dateTo,
      guests,
      venueId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Booking failed');
  }

  const existingMap = JSON.parse(localStorage.getItem('bookingVenues') || '{}');
  existingMap[result.data.id] = venueId;
  localStorage.setItem('bookingVenues', JSON.stringify(existingMap));

  return result.data;
}

export async function getBookingsByProfile(profileName) {
  const response = await fetch(`${BASE_URL}/profiles/${profileName}/bookings`, {
    headers: getHeaders(),
  });

  const data = await response.json();
  console.log('Fetched bookings:', data.data);

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return data.data;
}

export async function getEnrichedBookings(profileName) {
  const bookings = await getBookingsByProfile(profileName);
  console.log('Fetched bookings:', bookings);

  const venueMap = JSON.parse(localStorage.getItem('bookingVenues') || '{}');

  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      let venueId =
        booking.venueId || booking.venue?.id || venueMap[booking.id];

      if (!venueId) {
        console.warn(`Booking ${booking.id} has no venue`);
        return { ...booking, venue: null };
      }

      try {
        const venue = await getVenueById(venueId);
        return { ...booking, venue };
      } catch (error) {
        console.error(`Failed to enrich booking ${booking.id}`, error);
        return { ...booking, venue: null };
      }
    })
  );

  console.log('Enriched bookings:', enrichedBookings);
  return enrichedBookings;
}

export async function updateProfileAvatar(profileName, avatarUrl, avatarAlt) {
  const response = await fetch(`${BASE_URL}/profiles/${profileName}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update avatar');
  }

  const data = await response.json();
  return data.data;
}

export async function deleteBooking(id) {
  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }

  return true;
}
