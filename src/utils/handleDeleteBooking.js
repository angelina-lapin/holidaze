import { deleteBooking, getEnrichedBookings } from '../api/holidaze';

export async function handleDeleteBooking({
  bookingId,
  profileName,
  setBookings,
  setModal,
}) {
  const confirmed = confirm('Are you sure you want to cancel this booking?');
  if (!confirmed) return;

  try {
    await deleteBooking(bookingId);
    const updated = await getEnrichedBookings(profileName);
    setBookings(updated);

    if (setModal) {
      setModal({
        isOpen: true,
        title: 'Booking cancelled',
        message: 'The booking was successfully deleted.',
      });
    }
  } catch (error) {
    console.error('Failed to delete booking:', error);
    if (setModal) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Could not delete booking.',
      });
    }
  }
}
