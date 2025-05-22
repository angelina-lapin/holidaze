export function handleEditClick(
  venue,
  setNewVenue,
  setEditingVenueId,
  setShowForm
) {
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
