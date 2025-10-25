import React, { useState, useRef } from 'react';
import { Info, Target, Satellite, BoundingBox, Plus } from './icons';
import { operationalStats } from '../demoData';
import { useGeoJSON } from '../contexts/GeoJSONContext';
import * as L from 'leaflet';
import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';
import shp from 'shpjs';
import * as GeoTIFF from 'geotiff';

interface LeftSidebarProps {
  mapRef?: React.MutableRefObject<any>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ mapRef }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addLayer, addImageryLayer } = useGeoJSON();

  const handleButtonClick = (action: string) => {
    setActivePanel(activePanel === action ? null : action);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileName = file.name;
        let fileType = '';
        let geoJsonData: any;

        if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
          fileType = 'GeoJSON';
          const text = e.target?.result as string;
          geoJsonData = JSON.parse(text);

          // Validate basic GeoJSON structure
          if (!geoJsonData.type || (geoJsonData.type !== 'FeatureCollection' && geoJsonData.type !== 'Feature')) {
            alert('Invalid GeoJSON file. Must be a Feature or FeatureCollection.');
            return;
          }
        } else if (fileName.endsWith('.zip') || fileName.endsWith('.shp')) {
          fileType = 'Shapefile';
          geoJsonData = shapefileToGeoJSON(file);
        } else if (fileName.endsWith('.tif') || fileName.endsWith('.tiff') || fileName.endsWith('.geotiff')) {
          fileType = 'GeoTIFF';
          // Handle GeoTIFF separately
          const tiffData = processGeoTIFF(file);
          const layerName = file.name.replace(/\.(tif|tiff|geotiff)$/i, '');

          addImageryLayer({
            name: `${layerName} (${fileType})`,
            bounds: tiffData.bounds,
            imageUrl: tiffData.imageUrl,
            visible: true,
            opacity: 0.8,
            metadata: tiffData.metadata
          });

          alert(`Successfully loaded ${fileType} file: ${layerName}`);
          event.target.value = '';
          return;
        } else {
          alert('Unsupported file format. Please upload GeoJSON, KML, KMZ, Shapefile, or GeoTIFF.');
          event.target.value = '';
          return;
        }

        // Generate a random color for the layer
        const getRandomColor = () => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        };

        const layerName = file.name.replace(/\.geojson$/i, '');
        addLayer({
          name: layerName,
          data: geoJsonData,
          visible: true,
          color: getRandomColor()
        });
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        alert('Error parsing GeoJSON file. Please ensure it\'s valid JSON.');
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    event.target.value = '';
  };

  // Convert Shapefile to GeoJSON
  const shapefileToGeoJSON = async (file: File): Promise<any> => {
    const arrayBuffer = await file.arrayBuffer();
    const geoJson = await shp(arrayBuffer);
    return geoJson;
  };

  // Process GeoTIFF file
  const processGeoTIFF = async (file: File): Promise<any> => {
    const arrayBuffer = await file.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();

    // Get image dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    const bands = image.getSamplesPerPixel();

    // Get bounding box from GeoTIFF metadata
    const bbox = image.getBoundingBox();
    const bounds: [[number, number], [number, number]] = [
      [bbox[1], bbox[0]], // [south, west]
      [bbox[3], bbox[2]]  // [north, east]
    ];

    // Read raster data
    const rasters = await image.readRasters();

    // Create canvas to render the image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Convert raster data to RGBA
    if (bands === 1) {
      // Grayscale
      const raster = rasters[0] as any;
      for (let i = 0; i < width * height; i++) {
        const value = raster[i];
        data[i * 4] = value;     // R
        data[i * 4 + 1] = value; // G
        data[i * 4 + 2] = value; // B
        data[i * 4 + 3] = 255;   // A
      }
    } else if (bands >= 3) {
      // RGB or RGBA
      const r = rasters[0] as any;
      const g = rasters[1] as any;
      const b = rasters[2] as any;
      const a = bands >= 4 ? rasters[3] as any : null;

      for (let i = 0; i < width * height; i++) {
        data[i * 4] = r[i];     // R
        data[i * 4 + 1] = g[i]; // G
        data[i * 4 + 2] = b[i]; // B
        data[i * 4 + 3] = a ? a[i] : 255; // A
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const imageUrl = canvas.toDataURL('image/png');

    return {
      bounds,
      imageUrl,
      metadata: {
        width,
        height,
        bands,
        projection: image.geoKeys?.ProjectedCSTypeGeoKey || 'Unknown'
      }
    };
  };

  const icons = [
    { icon: Info, tooltip: 'Information Panel', action: 'info' },
    { icon: Target, tooltip: 'Target Location', action: 'target' },
    { icon: Satellite, tooltip: 'Satellite Imagery', action: 'satellite' },
    { icon: BoundingBox, tooltip: 'Define Area', action: 'area' },
    { icon: Plus, tooltip: 'Add Monitoring Point', action: 'add' },
  ];

  return (
    <>
      <aside className="bg-[#111827] w-14 flex flex-col items-center py-4 gap-6 border-r border-gray-700 z-20">
        {icons.map((item, index) => (
          <button 
            key={index} 
            className={`text-gray-400 hover:text-white transition-colors ${
              activePanel === item.action ? 'text-blue-500 bg-gray-800 rounded-lg p-1' : ''
            }`}
            title={item.tooltip}
            onClick={() => handleButtonClick(item.action)}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
        
        {/* GeoJSON Upload Button */}
        <div className="mt-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json,.kml,.kmz,.zip,.shp,.tif,.tiff,.geotiff"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white transition-colors"
            title="Upload GeoJSON"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </button>
        </div>
      </aside>
      
      {/* Info Panel */}
      {activePanel === 'info' && (
        <div className="absolute left-14 top-16 bg-gray-800/95 backdrop-blur-sm p-4 rounded-r-lg shadow-xl w-96 z-30 border-l-4 border-blue-500">
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            System Information
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Location</p>
                <p className="font-semibold text-white">Niger Delta, Nigeria</p>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Coordinates</p>
                <p className="font-semibold text-white">4.8156°N, 6.9698°E</p>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Active Facilities</p>
                <p className="font-semibold text-green-400">{operationalStats.activeFacilities}</p>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Pipeline Network</p>
                <p className="font-semibold text-blue-400">{operationalStats.pipelineLength} km</p>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Coverage Area</p>
                <p className="font-semibold text-white">{operationalStats.coverageArea.toLocaleString()} km²</p>
              </div>
              <div className="bg-gray-900/50 p-2 rounded">
                <p className="text-xs text-gray-400">Critical Alerts</p>
                <p className="font-semibold text-red-500">{operationalStats.criticalAlerts}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400">Last Updated: {new Date().toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Real-time monitoring of oil & gas infrastructure including leak detection, thermal analysis, pipeline integrity, and environmental compliance.</p>
            </div>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="mt-4 w-full px-3 py-2 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Target Location Panel */}
      {activePanel === 'target' && (
        <div className="absolute left-14 top-16 bg-gray-800/95 backdrop-blur-sm p-4 rounded-r-lg shadow-xl w-80 z-30 border-l-4 border-orange-500">
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Target Location
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-gray-400 text-xs">Facility Name</label>
              <select className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700">
                <option>Trans Niger Pipeline - Segment A</option>
                <option>Trans Niger Pipeline - Segment B</option>
                <option>Eastern Pipeline - Main</option>
                <option>Coastal Distribution Line</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs">Coordinates</label>
              <input 
                type="text" 
                placeholder="4.8156, 6.9698" 
                className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
              />
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded transition-colors">
              Set Target
            </button>
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400">Focus monitoring on specific location for detailed analysis</p>
            </div>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="mt-4 w-full px-3 py-2 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Satellite Imagery Panel */}
      {activePanel === 'satellite' && (
        <div className="absolute left-14 top-16 bg-gray-800/95 backdrop-blur-sm p-4 rounded-r-lg shadow-xl w-80 z-30 border-l-4 border-purple-500">
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <Satellite className="w-5 h-5 text-purple-400" />
            Satellite Sources
          </h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded hover:bg-gray-900 cursor-pointer">
              <input type="radio" name="satellite" defaultChecked className="form-radio text-purple-500" />
              <div>
                <p className="text-white font-semibold">Sentinel-2</p>
                <p className="text-xs text-gray-400">10m resolution, updated daily</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded hover:bg-gray-900 cursor-pointer">
              <input type="radio" name="satellite" className="form-radio text-purple-500" />
              <div>
                <p className="text-white font-semibold">Landsat 8</p>
                <p className="text-xs text-gray-400">30m resolution, 16-day cycle</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded hover:bg-gray-900 cursor-pointer">
              <input type="radio" name="satellite" className="form-radio text-purple-500" />
              <div>
                <p className="text-white font-semibold">SAR (Sentinel-1)</p>
                <p className="text-xs text-gray-400">All-weather, 12-day cycle</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-gray-900/50 rounded hover:bg-gray-900 cursor-pointer">
              <input type="radio" name="satellite" className="form-radio text-purple-500" />
              <div>
                <p className="text-white font-semibold">Planet Labs</p>
                <p className="text-xs text-gray-400">3m resolution, daily</p>
              </div>
            </label>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="mt-4 w-full px-3 py-2 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Define Area Panel */}
      {activePanel === 'area' && (
        <div className="absolute left-14 top-16 bg-gray-800/95 backdrop-blur-sm p-4 rounded-r-lg shadow-xl w-80 z-30 border-l-4 border-green-500">
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <BoundingBox className="w-5 h-5 text-green-400" />
            Define Monitoring Area
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-gray-400 text-xs">Area Name</label>
              <input 
                type="text" 
                placeholder="e.g., Pipeline Segment A" 
                className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Area Type</label>
              <select className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700">
                <option>Pipeline Corridor</option>
                <option>Facility Zone</option>
                <option>Security Perimeter</option>
                <option>Environmental Study Area</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors">
                Draw Polygon
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors">
                Draw Rectangle
              </button>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400">Click on map to define custom monitoring areas</p>
            </div>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="mt-4 w-full px-3 py-2 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Add Monitoring Point Panel */}
      {activePanel === 'add' && (
        <div className="absolute left-14 top-16 bg-gray-800/95 backdrop-blur-sm p-4 rounded-r-lg shadow-xl w-80 z-30 border-l-4 border-cyan-500">
          <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" />
            Add Monitoring Point
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="text-gray-400 text-xs">Point Type</label>
              <select className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700">
                <option>🔴 Leak Detection Sensor</option>
                <option>🔥 Thermal Camera</option>
                <option>⚙️ Pressure Monitor</option>
                <option>🛡️ Security Camera</option>
                <option>🌿 Environmental Sensor</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs">Sensor ID</label>
              <input 
                type="text" 
                placeholder="e.g., LEAK-001" 
                className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Notes</label>
              <textarea 
                placeholder="Additional information..." 
                className="w-full mt-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 h-20"
              />
            </div>
            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded transition-colors">
              Add to Map
            </button>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="mt-4 w-full px-3 py-2 text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
