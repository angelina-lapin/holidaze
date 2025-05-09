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
import { getUser } from '../utils/storage';

export default function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onClose: null,
  });
  const [guests, setGuests] = useState(1);

  const [startDate, endDate] = selectedRange;

  useEffect(() => {
    async function fetchVenue() {
      const data = await getVenueById(id);
      console.log('Fetched venue:', data);
      setVenue(data);
      setLoading(false);
    }
    fetchVenue();
  }, [id]);

  const onSubmit = (e) => {
    const user = getUser();
    handleBookingSubmit({
      e,
      user,
      venueId: venue.id,
      startDate,
      endDate,
      guests,
      bookedDates,
      setModal,
      setShowBookingForm,
      setSelectedRange,
      navigate,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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

        <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>

        {images.length > 0 ? (
          <>
            <img
              src={images[activeImageIndex].url}
              alt={images[activeImageIndex].alt || 'Venue image'}
              className="w-full h-64 object-cover rounded-md mb-4 transition duration-300 ease-in-out"
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
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
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
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
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
                  onClick={() => setShowBookingForm(true)}
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
          setModal((prev) => {
            if (prev.onClose) prev.onClose();
            return { ...prev, isOpen: false };
          });
        }}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
