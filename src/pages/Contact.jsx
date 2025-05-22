import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto px-4 py-12 text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-4 text-accent">Contact Us</h1>
        <p className="text-lg mb-6">
          We'd love to hear from you! Whether you have a question, feedback, or
          just want to say hello — reach out to us anytime.
        </p>
        <p className="mb-2">📧 Email: support@holidaze.dev</p>
        <p className="mb-2">📍 Location: Oslo, Norway</p>
      </main>
      <Footer />
    </div>
  );
}
