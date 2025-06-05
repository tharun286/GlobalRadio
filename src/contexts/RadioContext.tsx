import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Station } from '../types';

interface RadioContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  favorites: Station[];
  recentlyPlayed: Station[];
  playStation: (station: Station) => void;
  pauseStation: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  addToFavorites: (station: Station) => void;
  removeFromFavorites: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};

interface RadioProviderProps {
  children: ReactNode;
}

export const RadioProvider = ({ children }: RadioProviderProps) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Station[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('radioFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedRecent = localStorage.getItem('radioRecentlyPlayed');
    if (savedRecent) {
      setRecentlyPlayed(JSON.parse(savedRecent));
    }

    // Create audio element
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('radioFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recently played to localStorage when they change
  useEffect(() => {
    localStorage.setItem('radioRecentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Update audio element when station changes
  useEffect(() => {
    if (audioElement && currentStation) {
      audioElement.src = currentStation.url;
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentStation, audioElement]);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  const playStation = (station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    
    // Add to recently played if not already there
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== station.id);
      return [station, ...filtered].slice(0, 10); // Keep only 10 most recent
    });
  };

  const pauseStation = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseStation();
    } else if (currentStation) {
      if (audioElement) {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  };

  const addToFavorites = (station: Station) => {
    setFavorites(prev => {
      if (prev.some(s => s.id === station.id)) return prev;
      return [...prev, station];
    });
  };

  const removeFromFavorites = (stationId: string) => {
    setFavorites(prev => prev.filter(station => station.id !== stationId));
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(station => station.id === stationId);
  };

  return (
    <RadioContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        favorites,
        recentlyPlayed,
        playStation,
        pauseStation,
        togglePlay,
        setVolume,
        addToFavorites,
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};