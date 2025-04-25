import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getVenueById } from '../api/holidaze';
import ReactDatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { FaWifi, FaParking, FaUtensils, FaPaw } from 'react-icons/fa';

export default function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

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

  const bookedDates = venue.bookings?.map((b) => parseISO(b.dateFrom)) || [];
  const images =
    venue.media?.filter((img) => img.url?.startsWith('http')) || [];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
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
          ${venue.price} / night
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
            {venue.meta?.wifi && (
              <li className="flex items-center gap-2">
                <FaWifi className="text-accent" /> WiFi
              </li>
            )}
            {venue.meta?.parking && (
              <li className="flex items-center gap-2">
                <FaParking className="text-accent" /> Parking
              </li>
            )}
            {venue.meta?.breakfast && (
              <li className="flex items-center gap-2">
                <FaUtensils className="text-accent" /> Breakfast
              </li>
            )}
            {venue.meta?.pets && (
              <li className="flex items-center gap-2">
                <FaPaw className="text-accent" /> Pets allowed
              </li>
            )}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Select your dates</h2>
          <ReactDatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            minDate={new Date()}
            excludeDates={bookedDates}
            inline
            dayClassName={(date) =>
              bookedDates.some((d) => d.toDateString() === date.toDateString())
                ? 'bg-red-200 text-gray-400'
                : undefined
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
