import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">Holidaze</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 font-medium">
          <li className="hover:underline hover:decoration-accent cursor-pointer">
            Venues
          </li>
          <li className="hover:underline hover:decoration-accent cursor-pointer">
            About
          </li>
          <li className="hover:underline hover:decoration-accent cursor-pointer">
            Contact
          </li>
        </ul>

        {/* Login Button */}
        <div>
          <button className="bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}
