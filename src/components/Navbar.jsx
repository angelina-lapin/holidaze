import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/storage';
import { handleLogout } from '../utils/handleLogout';
import { handleProfileClick } from '../utils/handleProfileClick';
import { useUser } from '../hooks/useUser';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          Holidaze
        </div>

        <ul className="hidden md:flex space-x-6 font-medium">
          <li
            className="hover:underline hover:decoration-accent cursor-pointer"
            onClick={() => navigate('/')}
          >
            Venues
          </li>
          <li
            className="hover:underline hover:decoration-accent cursor-pointer"
            onClick={() => navigate('/about')}
          >
            About
          </li>
          <li
            className="hover:underline hover:decoration-accent cursor-pointer"
            onClick={() => navigate('/contact')}
          >
            Contact
          </li>
        </ul>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate('/register')}
                className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-primary transition"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => handleProfileClick(user, navigate)}
              >
                <img
                  src={user.avatar?.url || 'https://via.placeholder.com/32'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={() => handleLogout(setUser, navigate)}
                className="text-white border border-white px-3 py-1 rounded-md hover:bg-white hover:text-primary transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
