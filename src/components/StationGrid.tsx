import React from 'react';
import StationCard from './StationCard';
import { Station } from '../types';

interface StationGridProps {
  stations: Station[];
  layout?: 'grid' | 'list';
  emptyMessage?: string;
}

const StationGrid = ({ 
  stations, 
  layout = 'grid', 
  emptyMessage = 'No stations found.' 
}: StationGridProps) => {
  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {stations.map(station => (
          <StationCard key={station.id} station={station} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stations.map(station => (
        <StationCard key={station.id} station={station} layout="grid" />
      ))}
    </div>
  );
};

export default StationGrid;