import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleDeleteBooking } from '../utils/handleDeleteBooking';

export default function BookingList({ bookings, user, setModal, setBookings }) {
  const navigate = useNavigate();

  return (
    <ul className="space-y-4">
      {bookings.map((booking) => (
        <li key={booking.id} className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center">
            <div>
              {booking.venue?.name ? (
                <h3
                  className="text-xl font-semibold text-accent hover:underline cursor-pointer"
                  onClick={() => navigate(`/venue/${booking.venue.id}`)}
                >
                  {booking.venue.name}
                </h3>
              ) : (
                <h3 className="text-xl font-semibold text-gray-400">
                  Unknown Venue
                </h3>
              )}
              <p className="text-sm text-gray-600">
                From: {new Date(booking.dateFrom).toLocaleDateString()} – To:{' '}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  title: 'Cancel Booking',
                  message: 'Are you sure you want to cancel this booking?',
                  type: 'confirm',
                  onConfirm: () =>
                    handleDeleteBooking({
                      bookingId: booking.id,
                      profileName: user?.name,
                      setBookings,
                      setModal,
                    }),
                })
              }
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
