import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { handleLoginSubmit } from '../utils/handleLoginSubmit';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleLoginSubmit(email, password, setModal, navigate);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form
          onSubmit={onSubmit}
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
