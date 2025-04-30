import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueManager, setVenueManager] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });

  const navigate = useNavigate();

  function validateEmail(email) {
    return email.endsWith('@stud.noroff.no');
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setModal({
        isOpen: true,
        title: 'Invalid Email',
        message: 'Email must end with @stud.noroff.no',
      });
      return;
    }

    if (!validatePassword(password)) {
      setModal({
        isOpen: true,
        title: 'Weak Password',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    try {
      await register(name, email, password, venueManager);
      setModal({
        isOpen: true,
        title: 'Registration successful',
        message: 'You can now log in to your account.',
      });
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'Registration failed',
        message: error.message,
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="yourname@stud.noroff.no"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted mt-1">
              Email must end with @stud.noroff.no
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted mt-1">Minimum 8 characters</p>
          </div>

          <div className="flex items-center">
            <input
              id="venueManager"
              type="checkbox"
              checked={venueManager}
              onChange={() => setVenueManager((prev) => !prev)}
              className="mr-2"
            />
            <label htmlFor="venueManager" className="text-sm">
              Register as a Venue Manager
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded hover:opacity-90 transition"
          >
            Register
          </button>
        </form>
      </main>
      <Footer />

      <Modal
        isOpen={modal.isOpen}
        onClose={() => {
          setModal({ ...modal, isOpen: false });
          if (modal.title === 'Registration successful') {
            navigate('/login');
          }
        }}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
