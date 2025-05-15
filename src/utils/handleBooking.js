import { createBooking } from '../api/holidaze';

export async function handleConfirmBooking({
  venueId,
  dateFrom,
  dateTo,
  guests,
  setModal,
  setShowBookingForm,
  setSelectedRange,
  navigate,
  user,
}) {
  try {
    console.log('Creating booking (confirm):', {
      venueId,
      dateFrom,
      dateTo,
      guests,
    });

    await createBooking({ venueId, dateFrom, dateTo, guests });

    const redirectPath = user?.venueManager
      ? '/manager-profile'
      : '/user-profile';

    setModal({
      isOpen: true,
      title: 'Booking successful',
      message: 'Your booking was created successfully!',
      onClose: () => navigate(redirectPath),
    });

    if (setShowBookingForm) setShowBookingForm(false);
    if (setSelectedRange) setSelectedRange([null, null]);
  } catch (error) {
    console.error('Booking error (confirm):', error);
    setModal({
      isOpen: true,
      title: 'Booking failed',
      message: error.message || 'An error occurred while booking.',
    });
  }
}

export async function handleBookingSubmit({
  e,
  user,
  venueId,
  startDate,
  endDate,
  guests,
  bookedDates,
  setModal,
  setShowBookingForm,
  setSelectedRange,
  navigate,
}) {
  e.preventDefault();

  if (!user || !venueId || !startDate || !endDate) {
    return setModal({
      isOpen: true,
      title: 'Missing Information',
      message: 'Please make sure all booking details are filled in.',
    });
  }

  const isConflicting = bookedDates.some((d) => d >= startDate && d <= endDate);

  if (isConflicting) {
    return setModal({
      isOpen: true,
      title: 'Booking conflict',
      message: 'Selected dates overlap with an existing booking.',
    });
  }

  console.log('Creating booking (submit):', {
    venueId,
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
    guests,
  });

  try {
    await createBooking({
      venueId,
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
    });

    const redirectPath = user?.venueManager
      ? '/manager-profile'
      : '/user-profile';

    setModal({
      isOpen: true,
      title: 'Booking successful',
      message: 'Your booking was created successfully!',
      onClose: () => navigate(redirectPath),
    });

    setShowBookingForm(false);
    setSelectedRange([null, null]);
  } catch (error) {
    console.error('Booking error (submit):', error);
    setModal({
      isOpen: true,
      title: 'Booking failed',
      message: error.message || 'An error occurred while booking.',
    });
  }
}
