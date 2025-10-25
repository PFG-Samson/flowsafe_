import React, { useCallback, useRef, useState } from 'react';
import { useGeoJSON } from '../contexts/GeoJSONContext';
import { GeoJSONLayer } from '../types';
import { useMapContext } from '../contexts/MapContext';

export const GeoJSONUploader: React.FC = () => {
  const { addLayer, layers, removeLayer, toggleLayerVisibility, zoomToLayer } = useGeoJSON();
  const { map } = useMapContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          setError('Failed to read file');
          return;
        }
        
        const geojson = JSON.parse(result as string);
        
        // Basic validation
        if (!geojson.type || !(geojson.type === 'Feature' || geojson.type === 'FeatureCollection' || geojson.type === 'Geometry')) {
          setError('Invalid GeoJSON format');
          return;
        }
        
        // Generate a color for the layer
        const getRandomColor = () => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color + '80'; // Add transparency
        };
        
        const layer: Omit<GeoJSONLayer, 'id' | 'uploadedAt'> = {
          name: file.name.replace(/\.geojson$|\.json$/i, '') || 'GeoJSON Layer',
          data: geojson,
          visible: true,
          color: getRandomColor()
        };
        
        addLayer(layer, map);
        setError(null);
      } catch (err) {
        console.error('Error parsing GeoJSON:', err);
        setError('Invalid GeoJSON file');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  }, [addLayer]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/geo+json' || file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        handleFile(file);
      } else {
        setError('Please upload a valid GeoJSON file');
      }
    }
  };

  return (
    <div className="p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">GeoJSON Layers</h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".geojson,.json,application/geo+json"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-300">
          Drag & drop a GeoJSON file here or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports .geojson and .json files
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4 p-2 bg-red-900/30 rounded">
          {error}
        </div>
      )}

      {layers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Uploaded Layers</h4>
          <div className="space-y-2">
            {layers.map((layer) => (
              <div 
                key={layer.id} 
                className="flex items-center justify-between p-2 bg-gray-800/50 rounded hover:bg-gray-700/50"
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: layer.visible ? (layer.color || '#3b82f6') : '#4b5563' }}
                  />
                  <span className="text-sm truncate max-w-[180px]">
                    {layer.name}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomToLayer(layer.id, null);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                    title="Zoom to layer"
                  >
                    🔍
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                    title="Remove layer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoJSONUploader;