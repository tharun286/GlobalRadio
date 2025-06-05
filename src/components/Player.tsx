import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Heart, Music } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';

const Player = () => {
  const { 
    currentStation, 
    isPlaying, 
    volume, 
    togglePlay, 
    setVolume, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useRadio();
  
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentStation) return null;

  const toggleFavorite = () => {
    if (isFavorite(currentStation.id)) {
      removeFromFavorites(currentStation.id);
    } else {
      addToFavorites(currentStation);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isExpanded ? 'py-4' : 'py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Station Info */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {currentStation.favicon ? (
              <img 
                src={currentStation.favicon} 
                alt={currentStation.name} 
                className={`rounded-md transition-all ${isExpanded ? 'h-16 w-16' : 'h-10 w-10'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-station.png';
                }}
              />
            ) : (
              <div className={`rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center transition-all ${isExpanded ? 'h-16 w-16' : 'h-10 w-10'}`}>
                <Music size={isExpanded ? 28 : 20} className="text-purple-600 dark:text-purple-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{currentStation.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentStation.country}</p>
              {isExpanded && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {currentStation.tags.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isFavorite(currentStation.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className={`${
                  isFavorite(currentStation.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 dark:text-gray-400'
                } transition-colors`}
              />
            </button>

            {/* Volume control */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                aria-label="Volume control"
              >
                {getVolumeIcon()}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-purple-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional information when expanded */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="font-medium">Language:</span> {currentStation.language || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Bitrate:</span> {currentStation.bitrate ? `${currentStation.bitrate} kbps` : 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Format:</span> {currentStation.codec || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Votes:</span> {currentStation.votes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;