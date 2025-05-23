import { handleUpdateVenue } from './handleUpdateVenue';
import { handleSubmit } from './handleSubmit';

export function handleFormSubmit({
  e,
  editingVenueId,
  newVenue,
  user,
  setEditingVenueId,
  setShowForm,
  setNewVenue,
  setVenues,
  setModal,
}) {
  e.preventDefault();

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
      user,
      setShowForm,
      setNewVenue,
      setVenues,
      setModal
    );
  }
}
