import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Radio } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import StationGrid from '../components/StationGrid';
import { Station } from '../types';
import { searchStations } from '../services/radioApi';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  // Get search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchStations = async () => {
      if (!query) {
        setStations([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const results = await searchStations({ name: query, limit: 30 });
        setStations(results);
        
      } catch (err) {
        console.error('Error searching stations:', err);
        setError('Failed to search for stations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Radio Stations</h1>
      
      <SearchBar initialQuery={query} onSearch={handleSearch} />
      
      {query && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isLoading ? 'Searching...' : stations.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-md ${
                layout === 'grid'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-md ${
                layout === 'list'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Radio className="text-purple-500 dark:text-purple-400 animate-pulse" size={24} />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-red-500 mb-4">
            <Radio className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => handleSearch(query)}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : query ? (
        <StationGrid 
          stations={stations} 
          layout={layout} 
          emptyMessage="No stations found matching your search. Try different keywords or explore popular stations." 
        />
      ) : (
        <div className="text-center py-8">
          <SearchIcon size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Start typing to search for radio stations by name, country, or genre.</p>
        </div>
      )}
    </div>
  );
};

export default Search;