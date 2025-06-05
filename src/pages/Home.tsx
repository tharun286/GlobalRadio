import React, { useState, useEffect } from 'react';
import { Radio, TrendingUp, Music, Globe } from 'lucide-react';
import StationGrid from '../components/StationGrid';
import SearchBar from '../components/SearchBar';
import { Station, Genre } from '../types';
import { getPopularStations, getGenres, getStationsByTag } from '../services/radioApi';
import { useRadio } from '../contexts/RadioContext';

const Home = () => {
  const [popularStations, setPopularStations] = useState<Station[]>([]);
  const [recentlyPlayedStations, setRecentlyPlayedStations] = useState<Station[]>([]);
  const [genreStations, setGenreStations] = useState<{ genre: string; stations: Station[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { recentlyPlayed } = useRadio();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch popular stations
        const popular = await getPopularStations(8);
        setPopularStations(popular);
        
        // Fetch featured genres
        const genres = await getGenres(5);
        
        // Fetch stations for each genre
        const genreStationsPromises = genres.slice(0, 3).map(async (genre) => {
          const stations = await getStationsByTag(genre.name, 4);
          return {
            genre: genre.name,
            stations
          };
        });
        
        const genreResults = await Promise.all(genreStationsPromises);
        setGenreStations(genreResults.filter(result => result.stations.length > 0));
        
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load radio stations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  useEffect(() => {
    setRecentlyPlayedStations(recentlyPlayed);
  }, [recentlyPlayed]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-900/30 flex items-center justify-center mb-4">
            <Radio className="text-purple-500 dark:text-purple-400 animate-pulse\" size={24} />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <Radio className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 md:p-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Radio Stations From Around The World</h1>
          <p className="text-purple-100 mb-6">Listen to thousands of radio stations broadcasting music, news, and talk shows from every corner of the globe.</p>
          <SearchBar className="max-w-xl" />
        </div>
      </section>

      {/* Popular Stations */}
      <section>
        <div className="flex items-center mb-4">
          <TrendingUp size={20} className="text-purple-600 dark:text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Stations</h2>
        </div>
        <StationGrid stations={popularStations} />
      </section>

      {/* Recently Played */}
      {recentlyPlayedStations.length > 0 && (
        <section>
          <div className="flex items-center mb-4">
            <Radio size={20} className="text-purple-600 dark:text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Played</h2>
          </div>
          <StationGrid stations={recentlyPlayedStations.slice(0, 4)} />
        </section>
      )}

      {/* Genres */}
      {genreStations.map((genreData) => (
        <section key={genreData.genre}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Music size={20} className="text-purple-600 dark:text-purple-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{genreData.genre}</h2>
            </div>
          </div>
          <StationGrid stations={genreData.stations} />
        </section>
      ))}
    </div>
  );
};

export default Home;