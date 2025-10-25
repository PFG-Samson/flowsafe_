import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { GeoJSONLayer, GeoTIFFLayer } from '../types';
import type { Map as LeafletMap } from 'leaflet';
import { useMapContext } from './MapContext';
import PipelineData from '../Pipeline.json';
import * as GeoTIFF from 'geotiff';

interface GeoJSONContextType {
  layers: GeoJSONLayer[];
  addLayer: (layer: Omit<GeoJSONLayer, 'id' | 'uploadedAt'>, map?: any) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  zoomToLayer: (id: string, map: any) => void;
  // GeoTIFF methods
  imageryLayers: GeoTIFFLayer[];
  addImageryLayer: (layer: Omit<GeoTIFFLayer, 'id' | 'uploadedAt'>) => void;
  removeImageryLayer: (id: string) => void;
  toggleImageryVisibility: (id: string) => void;
  setImageryOpacity: (id: string, opacity: number) => void;
}

const GeoJSONContext = createContext<GeoJSONContextType | undefined>(undefined);

export const GeoJSONProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [layers, setLayers] = useState<GeoJSONLayer[]>([]);
  const [imageryLayers, setImageryLayers] = useState<GeoTIFFLayer[]>([]);
  const { map } = useMapContext();

  // Load Pipeline.json on mount
  useEffect(() => {
    const pipelineLayer: GeoJSONLayer = {
      id: 'pipeline-default',
      name: 'Pipeline Network',
      data: PipelineData,
      visible: true,
      color: '#FF6B35', // Orange color for pipelines
      uploadedAt: new Date()
    };
    setLayers([pipelineLayer]);
  }, []);

  const addLayer = useCallback((layer: Omit<GeoJSONLayer, 'id' | 'uploadedAt'>) => {
    const newLayer: GeoJSONLayer = {
      ...layer,
      id: `geojson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date(),
    };
    
    setLayers(prev => {
      const updatedLayers = [...prev, newLayer];
      
      // Auto-zoom to the newly added layer if map is provided
      if (map && newLayer.data) {
        try {
          const L = require('leaflet');
          const geoJsonLayer = L.geoJSON(newLayer.data);
          const bounds = geoJsonLayer.getBounds();
          if (bounds.isValid()) {
            // Use setTimeout to ensure the layer is rendered before zooming
            setTimeout(() => {
              map.fitBounds(bounds, { 
                padding: [50, 50], 
                maxZoom: 16,
                animate: true
              });
            }, 100);
          }
        } catch (error) {
          console.error('Error auto-zooming to new layer:', error);
        }
      }
      
      return updatedLayers;
    });
  }, [map]);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);

  const zoomToLayer = useCallback((id: string, map: LeafletMap | null) => {
    if (!map) return;
    
    const layer = layers.find(l => l.id === id);
    if (!layer || !layer.data) return;

    try {
      // Import leaflet dynamically to access geoJSON method
      import('leaflet').then(L => {
        const geoJsonLayer = L.geoJSON(layer.data);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      });
    } catch (error) {
      console.error('Error zooming to layer:', error);
    }
  }, [layers]);

  // GeoTIFF layer management
  const addImageryLayer = useCallback((layer: Omit<GeoTIFFLayer, 'id' | 'uploadedAt'>) => {
    const newLayer: GeoTIFFLayer = {
      ...layer,
      id: `geotiff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date(),
    };
    setImageryLayers(prev => [...prev, newLayer]);
  }, []);

  const removeImageryLayer = useCallback((id: string) => {
    setImageryLayers(prev => prev.filter(layer => layer.id !== id));
  }, []);

  const toggleImageryVisibility = useCallback((id: string) => {
    setImageryLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  }, []);

  const setImageryOpacity = useCallback((id: string, opacity: number) => {
    setImageryLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, opacity } : layer
    ));
  }, []);

  return (
    <GeoJSONContext.Provider value={{ 
      layers, 
      addLayer, 
      removeLayer, 
      toggleLayerVisibility, 
      zoomToLayer,
      imageryLayers,
      addImageryLayer,
      removeImageryLayer,
      toggleImageryVisibility,
      setImageryOpacity
    }}>
      {children}
    </GeoJSONContext.Provider>
  );
};

export const useGeoJSON = () => {
  const context = useContext(GeoJSONContext);
  if (!context) {
    throw new Error('useGeoJSON must be used within a GeoJSONProvider');
  }
  return context;
};
