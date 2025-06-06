import '../index.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getVenueById } from '../api/holidaze';
import { handleBookingSubmit } from '../utils/handleBooking';
import ReactDatePicker from 'react-datepicker';
import { addDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { useUser } from '../hooks/useUser';
import { useModal } from '../hooks/useModal';

export default function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { modal, openModal, closeModal } = useModal();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [startDate, endDate] = selectedRange;

  useEffect(() => {
    async function fetchVenue() {
      const data = await getVenueById(id);
      setVenue(data);
      setLoading(false);
    }
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary px-4 py-12 flex justify-center items-start">
        <div className="w-full max-w-5xl space-y-6">
          <div className="h-10 bg-white rounded animate-pulse w-1/2" />
          <div className="h-64 bg-white rounded animate-pulse" />
          <div className="h-24 bg-white rounded animate-pulse" />
          <div className="h-10 bg-white rounded animate-pulse w-1/3" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Venue not found.</p>
      </div>
    );
  }

  const images =
    venue.media?.filter((img) => img.url?.startsWith('http')) || [];

  const bookedDates =
    venue.bookings?.flatMap((booking) => {
      const start = parseISO(booking.dateFrom);
      const end = parseISO(booking.dateTo);
      const days = [];
      for (let d = start; d <= end; d = addDays(d, 1)) {
        days.push(d);
      }
      return days;
    }) || [];

  const numberOfNights =
    startDate && endDate ? differenceInCalendarDays(endDate, startDate) : 0;
  const totalPrice = numberOfNights * venue.price;

  const onSubmit = (e) => {
    handleBookingSubmit({
      e,
      user,
      venueId: venue.id,
      startDate,
      endDate,
      guests,
      bookedDates,
      setModal: openModal,
      setShowBookingForm,
      setSelectedRange,
      navigate,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-accent underline hover:opacity-75"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
        {venue.rating && (
          <p className="text-lg font-medium text-muted mb-4">
            Rating: {venue.rating.toFixed(1)} / 5
          </p>
        )}

        {images.length > 0 ? (
          <>
            <img
              src={images[activeImageIndex].url}
              alt={images[activeImageIndex].alt || 'Venue image'}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt || 'Thumbnail'}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-16 object-cover rounded cursor-pointer border ${
                    index === activeImageIndex
                      ? 'border-accent'
                      : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src="https://via.placeholder.com/800x400?text=No+Image"
            alt="Placeholder"
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}

        <p className="text-muted mb-4">{venue.description}</p>

        {venue.rating && (
          <div className="mb-4 text-sm text-accent font-medium">
            Rating: {venue.rating.toFixed(1)} ★
          </div>
        )}
        <div className="text-sm text-gray-600 mb-2">
          Location: {venue.location?.city}, {venue.location?.country}
        </div>
        <div className="text-lg font-semibold text-accent mb-6">
          kr {venue.price} / night
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
            {venue.meta?.wifi && (
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-wifi text-accent"></i> WiFi
              </li>
            )}
            {venue.meta?.parking && (
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-square-parking text-accent"></i>{' '}
                Parking
              </li>
            )}
            {venue.meta?.breakfast && (
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-mug-saucer text-accent"></i> Breakfast
              </li>
            )}
            {venue.meta?.pets && (
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-paw text-accent"></i> Pets allowed
              </li>
            )}
          </ul>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Select dates</h2>
              <ReactDatePicker
                selected={startDate}
                onChange={(range) => setSelectedRange(range)}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                minDate={new Date()}
                inline
                excludeDates={bookedDates}
                dayClassName={(date) => {
                  const isBooked = bookedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return isBooked
                    ? 'react-datepicker__day booked-date'
                    : undefined;
                }}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Booking summary</h2>
              {startDate && endDate ? (
                <div className="bg-white rounded shadow p-4 mb-4">
                  <p>
                    {numberOfNights} night{numberOfNights > 1 ? 's' : ''} x{' '}
                    {venue.price} kr
                  </p>
                  <p className="font-bold mt-2">Total: {totalPrice} kr</p>
                </div>
              ) : (
                <p className="text-sm text-muted mb-4">
                  Please select dates to see summary
                </p>
              )}

              {showBookingForm && (
                <form
                  onSubmit={onSubmit}
                  className="bg-white rounded shadow p-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-2 px-4 rounded hover:opacity-90"
                  >
                    Confirm booking
                  </button>
                </form>
              )}

              {!showBookingForm && startDate && endDate && (
                <button
                  onClick={() => {
                    if (!user) {
                      openModal({
                        title: 'Login required',
                        message: 'To book this venue, you must log in first.',
                        type: 'confirm',
                        confirmLabel: 'Go to Login',
                        cancelLabel: 'Close',
                        onConfirm: () => navigate('/login'),
                      });
                    } else {
                      setShowBookingForm(true);
                    }
                  }}
                  className="w-full mt-4 bg-accent text-white py-2 px-4 rounded hover:opacity-90"
                >
                  Book now
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={modal.isOpen}
        onClose={() => {
          if (modal.onClose) modal.onClose();
          closeModal();
        }}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
      />
    </div>
  );
}
