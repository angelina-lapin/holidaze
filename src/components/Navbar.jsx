import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          Holidaze
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 font-medium">
          {[
            { label: 'Venues', path: '/' },
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' },
          ].map(({ label, path }) => (
            <li
              key={path}
              onClick={() => navigate(path)}
              className={`cursor-pointer hover:underline hover:decoration-accent ${
                location.pathname === path ? 'text-accent font-semibold' : ''
              }`}
            >
              {label}
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
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
                onClick={() =>
                  navigate(
                    user.venueManager ? '/manager-profile' : '/user-profile'
                  )
                }
              >
                <img
                  src={user.avatar?.url || 'https://via.placeholder.com/32'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
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
