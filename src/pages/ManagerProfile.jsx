import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ManagerProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Venue Manager!</h1>
        <p className="mb-4 text-muted">
          Here you can manage your venues, create new listings, and view your
          bookings.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Your Venues</h2>
            <p className="text-sm text-muted">
              List of your venues will appear here.
            </p>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Create New Venue</h2>
            <p className="text-sm text-muted">
              Click below to create a new listing.
            </p>
            <button className="mt-2 bg-accent text-white py-2 px-4 rounded hover:opacity-90">
              Add Venue
            </button>
          </div>

          <div className="bg-white rounded shadow p-4 sm:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Bookings</h2>
            <p className="text-sm text-muted">
              Overview of bookings will go here.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
