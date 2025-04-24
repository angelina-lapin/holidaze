const BASE_URL = 'https://v2.api.noroff.dev/holidaze';

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
    const response = await fetch(`${BASE_URL}/venues/${id}`);
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
