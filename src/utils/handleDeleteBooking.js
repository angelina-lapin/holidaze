import { deleteBooking, getEnrichedBookings } from '../api/holidaze';

export async function handleDeleteBooking({
  bookingId,
  profileName,
  setBookings,
  setModal,
}) {
  try {
    await deleteBooking(bookingId);
    const updated = await getEnrichedBookings(profileName);
    setBookings(updated);

    if (setModal) {
      setModal({
        isOpen: true,
        type: 'info',
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
