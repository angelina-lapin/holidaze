import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { handleRegisterSubmit } from '../utils/handleRegisterSubmit';
import { useModal } from '../hooks/useModal';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueManager, setVenueManager] = useState(false);

  const navigate = useNavigate();
  const { modal, openModal, closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegisterSubmit({
      name,
      email,
      password,
      venueManager,
      setModal: openModal,
      navigate,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-accent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-accent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-accent"
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
            className="w-full bg-accent text-white py-2 rounded hover:opacity-90"
          >
            Register
          </button>
        </form>
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => {
          closeModal();
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
