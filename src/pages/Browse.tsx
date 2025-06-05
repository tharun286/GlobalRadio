import React, { useState, useEffect } from 'react';
import { Globe, Music, Search } from 'lucide-react';
import StationGrid from '../components/StationGrid';
import { Station, Country, Genre } from '../types';
import { getCountries, getGenres, getStationsByCountry, getStationsByTag } from '../services/radioApi';

const Browse = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'country' | 'genre'>('country');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch countries and genres on component mount
  useEffect(() => {
    const fetchBrowseData = async () => {
      try {
        setIsLoading(true);
        
        const [countriesData, genresData] = await Promise.all([
          getCountries(),
          getGenres(50)
        ]);
        
        // Sort countries by name
        const sortedCountries = countriesData
          .filter(country => country.stationCount > 0)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        // Sort genres by station count (descending)
        const sortedGenres = genresData
          .filter(genre => genre.stationCount > 0)
          .sort((a, b) => b.stationCount - a.stationCount);
        
        setCountries(sortedCountries);
        setGenres(sortedGenres);
        
        // Pre-select first country if available
        if (sortedCountries.length > 0) {
          setSelectedCountry(sortedCountries[0].name);
        }
        
      } catch (err) {
        console.error('Error fetching browse data:', err);
        setError('Failed to load browse data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrowseData();
  }, []);

  // Fetch stations when selected country/genre changes
  useEffect(() => {
    const fetchStations = async () => {
      if (selectedCategory === 'country' && selectedCountry) {
        try {
          setIsLoading(true);
          const data = await getStationsByCountry(selectedCountry, 50);
          setStations(data);
        } catch (err) {
          console.error(`Error fetching stations for country ${selectedCountry}:`, err);
          setError(`Failed to load stations for ${selectedCountry}.`);
        } finally {
          setIsLoading(false);
        }
      } else if (selectedCategory === 'genre' && selectedGenre) {
        try {
          setIsLoading(true);
          const data = await getStationsByTag(selectedGenre, 50);
          setStations(data);
        } catch (err) {
          console.error(`Error fetching stations for genre ${selectedGenre}:`, err);
          setError(`Failed to load stations for ${selectedGenre}.`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchStations();
  }, [selectedCategory, selectedCountry, selectedGenre]);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSelectedCategory('country');
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setSelectedCategory('genre');
  };

  // Filter countries and genres based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGenres = genres.filter(genre => 
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="md:col-span-1 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Browse</h2>
          
          {/* Category Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              className={`py-2 px-4 font-medium ${
                selectedCategory === 'country'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedCategory('country')}
            >
              Countries
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                selectedCategory === 'genre'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedCategory('genre')}
            >
              Genres
            </button>
          </div>
          
          {/* Search Filter */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-purple-500 focus:border-purple-500"
              placeholder={`Search ${selectedCategory === 'country' ? 'countries' : 'genres'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* List of Countries/Genres */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-1">
            {selectedCategory === 'country' ? (
              filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => handleCountrySelect(country.name)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                      selectedCountry === country.name
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Globe size={16} className="mr-2" />
                      <span className="font-medium">{country.name}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {country.stationCount}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No countries found</p>
              )
            ) : (
              filteredGenres.length > 0 ? (
                filteredGenres.map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => handleGenreSelect(genre.name)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${
                      selectedGenre === genre.name
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Music size={16} className="mr-2" />
                      <span className="font-medium">{genre.name}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {genre.stationCount}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No genres found</p>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:col-span-3">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedCategory === 'country' && selectedCountry
              ? `Stations in ${selectedCountry}`
              : selectedCategory === 'genre' && selectedGenre
              ? `${selectedGenre} Stations`
              : 'Stations'}
          </h2>
          {(selectedCategory === 'country' && selectedCountry) || (selectedCategory === 'genre' && selectedGenre) ? (
            <span className="ml-2 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
              {stations.length} stations
            </span>
          ) : null}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-60"></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : stations.length > 0 ? (
          <StationGrid stations={stations} />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {selectedCategory === 'country' && selectedCountry
                ? `No stations found for ${selectedCountry}`
                : selectedCategory === 'genre' && selectedGenre
                ? `No ${selectedGenre} stations found`
                : 'No stations found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;