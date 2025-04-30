import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import VenueCard from '../components/VenueCard';
import Footer from '../components/Footer';
import SortBar from '../components/SortBar';
import { getVenues } from '../api/holidaze';

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOrder, setSortOrder] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const locationFilter = searchParams.get('location') || '';

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getVenues();
      setVenues(data);
      setIsLoading(false);
    }

    loadData();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    locationFilter
      ? venue.location?.city
          ?.toLowerCase()
          .includes(locationFilter.toLowerCase())
      : true
  );

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

  const visibleVenues = sortedVenues.slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <Hero />

      <main className="flex-grow px-4 py-8 max-w-7xl mx-auto w-full">
        <SortBar sortOrder={sortOrder} setSortOrder={setSortOrder} />

        <h2 className="text-2xl font-bold mb-4 text-muted">
          {locationFilter ? `Venues in ${locationFilter}` : 'Popular Venues'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white h-64 rounded-lg shadow animate-pulse"
                ></div>
              ))
            : visibleVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  id={venue.id}
                  name={venue.name}
                  location={venue.location?.city || 'Unknown'}
                  image={venue.media?.[0]?.url || '/hero.jpg'}
                  imageAlt={venue.media?.[0]?.alt || venue.name}
                  price={venue.price}
                  rating={venue.rating}
                />
              ))}
        </div>

        {!isLoading && visibleCount < sortedVenues.length && (
          <div className="flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-6 py-3 bg-accent text-white rounded-md hover:opacity-90 transition"
            >
              Load more
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
