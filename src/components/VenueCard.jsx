import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function VenueCard({
  id,
  name,
  location,
  image,
  imageAlt,
  price,
  rating,
}) {
  return (
    <Link to={`/venue/${id}`} className="block">
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:scale-[1.02] transition"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={image}
          alt={imageAlt}
          className="w-full h-48 object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <div className="p-4 flex flex-col justify-between flex-grow">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-muted truncate">
              {name}
            </h2>
            <p className="text-sm text-gray-500">{location}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-accent font-bold text-lg">kr {price}</span>
            <span className="text-yellow-500 text-sm">
              {rating ? '★'.repeat(Math.round(rating)) : 'No rating'}
            </span>
          </div>

          <button className="mt-auto bg-accent text-white py-2 px-4 rounded-md hover:opacity-90 transition">
            Book now
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
