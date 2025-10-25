import React, { createContext, useContext, useState, ReactNode, MutableRefObject } from 'react';
import { Map as LeafletMap } from 'leaflet';

interface MapContextType {
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
  mapRef: MutableRefObject<LeafletMap | null> | null;
  setMapRef: (ref: MutableRefObject<LeafletMap | null> | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [mapRef, setMapRef] = useState<MutableRefObject<LeafletMap | null> | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap, mapRef, setMapRef }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

export default MapContext;