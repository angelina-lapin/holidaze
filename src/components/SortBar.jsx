import React from 'react';

export default function SortBar({ sortOrder, setSortOrder }) {
  return (
    <div className="flex justify-end mb-6">
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="bg-white border border-gray-300 text-muted text-sm rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
    </div>
  );
}
