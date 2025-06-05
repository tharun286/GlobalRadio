import { Station, SearchParams, Country, Genre } from '../types';

// Get a random API server to improve reliability
const getApiBaseUrl = async (): Promise<string> => {
  try {
    const response = await fetch('https://all.api.radio-browser.info/json/servers');
    if (!response.ok) throw new Error('Failed to fetch server list');
    const servers = await response.json();
    if (!servers.length) throw new Error('No servers available');
    // Get a random server from the list
    const randomServer = servers[Math.floor(Math.random() * servers.length)];
    return `https://${randomServer.name}/json`;
  } catch (error) {
    // Fallback to a known server if we can't get the server list
    console.warn('Failed to get random server, using fallback:', error);
    return 'https://de1.api.radio-browser.info/json';
  }
};

let API_BASE_URL: string | null = null;

const initializeApi = async () => {
  if (!API_BASE_URL) {
    API_BASE_URL = await getApiBaseUrl();
  }
  return API_BASE_URL;
};

// Get a list of stations based on search parameters
export const searchStations = async (params: SearchParams): Promise<Station[]> => {
  const baseUrl = await initializeApi();
  const queryParams = new URLSearchParams();
  
  if (params.name) queryParams.append('name', params.name);
  if (params.country) queryParams.append('country', params.country);
  if (params.language) queryParams.append('language', params.language);
  if (params.tag) queryParams.append('tag', params.tag);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  
  try {
    const response = await fetch(`${baseUrl}/stations/search?${queryParams.toString()}`, {
      headers: {
        'User-Agent': 'RadioApp/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((station: any) => ({
      id: station.stationuuid,
      name: station.name,
      url: station.url_resolved,
      favicon: station.favicon || '/placeholder-station.png',
      country: station.country,
      language: station.language,
      tags: station.tags?.split(',') || [],
      votes: station.votes,
      codec: station.codec,
      bitrate: station.bitrate
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw new Error('Failed to fetch stations. Please check your connection and try again.');
  }
};

// Get popular stations
export const getPopularStations = async (limit = 20): Promise<Station[]> => {
  return searchStations({ limit });
};

// Get stations by country
export const getStationsByCountry = async (country: string, limit = 20): Promise<Station[]> => {
  return searchStations({ country, limit });
};

// Get stations by tag/genre
export const getStationsByTag = async (tag: string, limit = 20): Promise<Station[]> => {
  return searchStations({ tag, limit });
};

// Get list of countries with station counts
export const getCountries = async (): Promise<Country[]> => {
  const baseUrl = await initializeApi();
  
  try {
    const response = await fetch(`${baseUrl}/countries`, {
      headers: {
        'User-Agent': 'RadioApp/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((country: any) => ({
      name: country.name,
      code: country.iso_3166_1,
      stationCount: country.stationcount
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to fetch countries. Please check your connection and try again.');
  }
};

// Get list of tags/genres with station counts
export const getGenres = async (limit = 30): Promise<Genre[]> => {
  const baseUrl = await initializeApi();
  
  try {
    const response = await fetch(`${baseUrl}/tags?limit=${limit}`, {
      headers: {
        'User-Agent': 'RadioApp/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((genre: any) => ({
      name: genre.name,
      stationCount: genre.stationcount
    }));
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres. Please check your connection and try again.');
  }
};