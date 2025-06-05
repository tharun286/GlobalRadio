export interface Station {
  id: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  language: string;
  tags: string[];
  votes: number;
  codec: string;
  bitrate: number;
}

export interface Country {
  name: string;
  code: string;
  stationCount: number;
}

export interface Genre {
  name: string;
  stationCount: number;
}

export interface SearchParams {
  name?: string;
  country?: string;
  language?: string;
  tag?: string;
  limit?: number;
}