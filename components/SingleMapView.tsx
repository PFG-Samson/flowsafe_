
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, GeoJSON, ImageOverlay } from 'react-leaflet';
import { BaseLayerType } from '../types';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useGeoJSON } from '../contexts/GeoJSONContext';
import { useMapContext } from '../contexts/MapContext';

interface SingleMapViewProps {
  baseLayer: BaseLayerType;
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  mapRef?: React.MutableRefObject<any>;
}

const baseLayers = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  }
};

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

const MapEventHandler: React.FC<{ 
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  mapRef?: React.MutableRefObject<any>;
}> = ({ onMoveEnd, mapRef }) => {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);

  useMapEvents({
    moveend: (e) => {
      if (onMoveEnd) {
        const center = e.target.getCenter();
        const zoom = e.target.getZoom();
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

const SingleMapView: React.FC<SingleMapViewProps> = ({ baseLayer, onMoveEnd, mapRef }) => {
  const defaultCenter: [number, number] = [4.55, 8.2]; // Pipeline region
  const defaultZoom = 12;
  const layer = baseLayers[baseLayer];
  const { layers, imageryLayers } = useGeoJSON();

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      boxZoom={true}
      keyboard={true}
    >
      <TileLayer
        url={layer.url}
        attribution={layer.attribution}
        key={baseLayer}
      />
      <MapInitializer />
      <MapEventHandler onMoveEnd={onMoveEnd} mapRef={mapRef} />
      
      {/* Render GeoTIFF Imagery Layers */}
      {imageryLayers
        .filter(layer => layer.visible && layer.imageUrl)
        .map(layer => {
          try {
            return (
              <ImageOverlay
                key={layer.id}
                url={layer.imageUrl}
                bounds={layer.bounds}
                opacity={layer.opacity}
                zIndex={500}
              />
            );
          } catch (error) {
            console.error('Error rendering GeoTIFF layer:', error);
            return null;
          }
        })}
      
      {/* Render GeoJSON Layers */}
      {layers
        .filter(layer => layer.visible && layer.data)
        .map(layer => {
          try {
            return (
              <GeoJSON
                key={layer.id}
                data={layer.data}
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
    </MapContainer>
  );
};

export default SingleMapView;
