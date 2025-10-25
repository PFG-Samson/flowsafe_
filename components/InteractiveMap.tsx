import React, { useEffect, useRef, useCallback } from 'react';
import { useMapContext } from '../contexts/MapContext';
import { MapContainer, TileLayer, useMap, useMapEvents, GeoJSON } from 'react-leaflet';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { BaseLayerType, BaseLayer } from '../types';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import * as L from 'leaflet';
import { useGeoJSON } from '../contexts/GeoJSONContext';

const baseLayers: Record<BaseLayerType, BaseLayer> = {
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    id: 'satellite',
    name: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  }
};

interface InteractiveMapProps {
  baseLayer: BaseLayerType;
  className?: string;
  style?: React.CSSProperties;
  mapRef?: React.MutableRefObject<LeafletMap | null>;
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  syncCenter?: [number, number];
  syncZoom?: number;
}

// Component to initialize map reference in MapContext
const MapInitializer: React.FC = () => {
  const map = useMap();
  const { setMap } = useMapContext();

  useEffect(() => {
    if (map) {
      setMap(map);
    }
    return () => {
      setMap(null);
    };
  }, [map, setMap]);

  return null;
};

const MapSyncHandler: React.FC<{
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  syncCenter?: [number, number];
  syncZoom?: number;
}> = ({ onMoveEnd, syncCenter, syncZoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (syncCenter && syncZoom !== undefined) {
      map.setView(syncCenter, syncZoom, { animate: false });
    }
  }, [syncCenter, syncZoom, map]);

  useMapEvents({
    moveend: () => {
      if (onMoveEnd) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMoveEnd([center.lat, center.lng], zoom);
      }
    },
  });

  return null;
};

// Style function for GeoJSON features
const getStyle = (feature: any, color: string) => {
  return {
    color: color,
    weight: 2,
    opacity: 0.8,
    fillColor: color,
    fillOpacity: 0.3
  };
};

// Point to layer function for GeoJSON points
const pointToLayer = (feature: any, latlng: L.LatLng, color: string) => {
  return L.circleMarker(latlng, {
    radius: 6,
    fillColor: color,
    color: color,
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.5
  });
};

// OnEachFeature function for GeoJSON features (adds popups)
const onEachFeature = (feature: any, layer: L.Layer) => {
  if (feature.properties) {
    const popupContent = Object.entries(feature.properties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join('<br/>');
    layer.bindPopup(popupContent);
  }
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  baseLayer, 
  className, 
  style, 
  mapRef,
  onMoveEnd,
  syncCenter,
  syncZoom 
}) => {
  const layer = baseLayers[baseLayer];
  const defaultCenter: [number, number] = [4.8156, 6.9698]; // Niger Delta, Nigeria
  const { map, setMap, mapRef: contextMapRef, setMapRef: setContextMapRef } = useMapContext();
  const { layers } = useGeoJSON();
  const localMapRef = useRef<LeafletMap | null>(null);

  return (
    <MapContainer
      center={syncCenter || defaultCenter}
      zoom={syncZoom || 4}
      className={className}
      style={style}
      zoomControl={false}
      attributionControl={false}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      boxZoom={true}
      keyboard={true}
      ref={useCallback((mapInstance: LeafletMap | null) => {
        localMapRef.current = mapInstance;
        if (mapRef) {
          mapRef.current = mapInstance;
        }
      }, [mapRef])}
    >
      <TileLayer
        url={baseLayers[baseLayer].url}
        attribution={baseLayers[baseLayer].attribution}
      />
      
      <MapInitializer />
      
      <MapSyncHandler 
        onMoveEnd={onMoveEnd}
        syncCenter={syncCenter}
        syncZoom={syncZoom}
      />
      
      {/* Render GeoJSON Layers */}
      {layers
        .filter(layer => layer.visible && layer.data)
        .map(layer => {
          try {
            // Ensure data is properly formatted
            const geoJsonData = layer.data;
            
            return (
              <GeoJSON
                key={layer.id}
                data={geoJsonData}
                style={(feature) => getStyle(feature, layer.color || '#3b82f6')}
                pointToLayer={(feature, latlng) => 
                  pointToLayer(feature, latlng, layer.color || '#3b82f6')
                }
                onEachFeature={onEachFeature}
              />
            );
          } catch (error) {
            console.error('Error rendering GeoJSON layer:', error);
            return null;
          }
        })}
      
      {/* Debug: Show number of active layers */}
      {process.env.NODE_ENV === 'development' && (
        <div className="leaflet-bottom leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white p-2 text-xs">
            Active Layers: {layers.filter(l => l.visible).length}
          </div>
        </div>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;
