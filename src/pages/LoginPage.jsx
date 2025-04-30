import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      user.venueManager =
        user.venueManager === true || user.venueManager === 'true';

      localStorage.setItem('user', JSON.stringify(user));

      if (user.venueManager) {
        navigate('/manager-profile');
      } else {
        navigate('/user-profile');
      }
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'Login failed',
        message: error.message,
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded shadow p-6"
        >
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 px-4 rounded hover:opacity-90"
          >
            Login
          </button>
        </form>
      </main>
      <Footer />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}
