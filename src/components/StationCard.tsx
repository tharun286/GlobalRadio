import React from 'react';
import { Heart, Play, Pause, Music } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import { Station } from '../types';

interface StationCardProps {
  station: Station;
  layout?: 'grid' | 'list';
}

const StationCard = ({ station, layout = 'grid' }: StationCardProps) => {
  const { 
    currentStation, 
    isPlaying, 
    playStation, 
    pauseStation, 
    isFavorite, 
    addToFavorites, 
    removeFromFavorites 
  } = useRadio();

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pauseStation();
    } else {
      playStation(station);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(station.id)) {
      removeFromFavorites(station.id);
    } else {
      addToFavorites(station);
    }
  };

  if (layout === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex items-center p-3 border border-gray-200 dark:border-gray-700">
        {/* Station Logo */}
        {station.favicon ? (
          <img 
            src={station.favicon} 
            alt={station.name} 
            className="w-12 h-12 rounded-md object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-station.png';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Music size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
        )}

        {/* Station Info */}
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{station.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span>{station.country}</span>
            {station.language && (
              <>
                <span className="mx-1">•</span>
                <span>{station.language}</span>
              </>
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavoriteToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isFavorite(station.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={`${
                isFavorite(station.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              } transition-colors`}
            />
          </button>
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full transition-colors ${
              isCurrentlyPlaying
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentlyPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Station Logo */}
      <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-900">
        {station.favicon ? (
          <img 
            src={station.favicon} 
            alt={station.name} 
            className="absolute inset-0 w-full h-full object-cover p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-station.png';
            }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <Music size={48} className="text-purple-600 dark:text-purple-400" />
          </div>
        )}
        
        {/* Play/Pause Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 dark:hover:bg-opacity-40 transition-all duration-200"
          aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
        >
          <div className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ${
            isCurrentlyPlaying ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          } group-hover:scale-100 group-hover:opacity-100`}>
            {isCurrentlyPlaying ? 
              <Pause size={24} className="text-purple-700 dark:text-purple-400" /> : 
              <Play size={24} className="text-purple-700 dark:text-purple-400 ml-1" />
            }
          </div>
        </button>
      </div>

      {/* Station Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{station.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{station.country}</p>
        
        {/* Tags */}
        {station.tags && station.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {station.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {station.bitrate ? `${station.bitrate} kbps` : ''}
          </span>
          
          <button
            onClick={handleFavoriteToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isFavorite(station.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={`${
                isFavorite(station.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              } transition-colors`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationCard;