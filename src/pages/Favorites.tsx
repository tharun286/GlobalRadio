import React, { useState } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import StationGrid from '../components/StationGrid';
import { useRadio } from '../contexts/RadioContext';
import { Station } from '../types';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useRadio();
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter(
    station => 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const clearAllFavorites = () => {
    favorites.forEach(station => {
      removeFromFavorites(station.id);
    });
    setShowConfirmDelete(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Heart className="mr-2 text-red-500" size={24} />
          Your Favorite Stations
        </h1>
        
        {favorites.length > 0 && (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>
      
      {favorites.length > 0 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg block w-full pl-10 p-2.5 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Filter your favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-full mb-4">
            <Heart className="w-16 h-16 text-red-300 dark:text-red-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Favorite Stations Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Start exploring and click the heart icon on stations you love to add them to your favorites.
          </p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No favorites match your search for "{searchTerm}".
          </p>
        </div>
      ) : (
        <StationGrid stations={filteredFavorites} />
      )}
      
      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Clear All Favorites?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove all your favorite stations? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={clearAllFavorites}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;