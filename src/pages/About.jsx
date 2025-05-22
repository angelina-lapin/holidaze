import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-12 text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-accent">About Holidaze</h1>
        <p className="text-lg mb-6">
          Holidaze is your go-to destination for finding unique and
          unforgettable places to stay. Whether you're traveling for adventure
          or relaxation, we connect guests with local venue managers to create
          meaningful experiences.
        </p>
        <p className="text-gray-600">
          This project was created as part of a learning journey in web
          development. It showcases modern frontend and backend techniques, and
          is powered by the Noroff Holidaze API.
        </p>
      </main>
      <Footer />
    </div>
  );
}
