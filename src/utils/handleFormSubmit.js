import { handleUpdateVenue } from './handleUpdateVenue';
import { handleSubmit } from './handleSubmit';

export function handleFormSubmit({
  e,
  editingVenueId,
  newVenue,
  setEditingVenueId,
  setShowForm,
  setNewVenue,
  setVenues,
  setModal,
}) {
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
    handleSubmit(e, newVenue, setShowForm, setNewVenue, setVenues);
  }
}
