export function resetVenueForm(setNewVenue, setMediaInput, setEditingVenueId) {
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
