
import React, { useState, useRef } from 'react';
import { LeakIcon, ThermalIcon, PipelineIcon, RadarIcon, AlertTriangle, NdviIcon, Compass, Cloud, Layers, Edit, Ruler, Plus, Minus, Maximize, Map } from './icons';
import SingleMapView from './SingleMapView';
import { BaseLayerType } from '../types';
import { useGeoJSON } from '../contexts/GeoJSONContext';
import * as L from 'leaflet';

const MainContent: React.FC = () => {
  const [baseLayer, setBaseLayer] = useState<BaseLayerType>('satellite');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showCloudCover, setShowCloudCover] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>('leak'); // leak, thermal, pipeline, sar, ndvi
  const mapRef = useRef<any>(null);
  const { layers } = useGeoJSON();

  const handleMapMove = (center: [number, number], zoom: number) => {
    console.log('Map moved to:', center, 'Zoom:', zoom);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleResetView = () => {
    if (!mapRef.current) return;
    
    // Find the pipeline layer and fit to its bounds
    const pipelineLayer = layers.find(layer => layer.id === 'pipeline-default');
    if (pipelineLayer && pipelineLayer.data) {
      try {
        const geoJsonLayer = L.geoJSON(pipelineLayer.data);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 14,
            animate: true
          });
        }
      } catch (error) {
        console.error('Error resetting to pipeline view:', error);
        // Fallback to fixed coordinates
        mapRef.current.setView([4.55, 8.2], 12);
      }
    } else {
      // Fallback if pipeline layer not found
      mapRef.current.setView([4.55, 8.2], 12);
    }
  };

  const handleMaximizeZoom = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(18);
    }
  };

  return (
    <main className="flex-1 relative overflow-hidden" style={{ background: '#1F2937' }}>
      {/* Map Layer - Lowest z-index */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <SingleMapView 
          baseLayer={baseLayer} 
          onMoveEnd={handleMapMove}
          mapRef={mapRef}
        />
      </div>

      {/* Bottom-left analysis controls */}
      <div 
        className="absolute bottom-4 left-4 flex flex-col items-start gap-2"
        style={{ zIndex: 1000, pointerEvents: 'auto' }}
      >
        <div className="flex items-center gap-2">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">300 m</div>
          <div className="w-20 h-0.5 bg-white"></div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`p-2 rounded-full text-white shadow-lg transition-all ${
              activeAnalysis === 'leak' ? 'bg-red-600 ring-2 ring-red-400 scale-110' : 'bg-red-500 hover:bg-red-600'
            }`}
            title="Leak Detection (Critical)"
            onClick={() => setActiveAnalysis(activeAnalysis === 'leak' ? null : 'leak')}
          >
            <LeakIcon className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-full text-white shadow-lg transition-all ${
              activeAnalysis === 'thermal' ? 'bg-orange-600 ring-2 ring-orange-400 scale-110' : 'bg-orange-500 hover:bg-orange-600'
            }`}
            title="Thermal Monitoring"
            onClick={() => setActiveAnalysis(activeAnalysis === 'thermal' ? null : 'thermal')}
          >
            <ThermalIcon className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-full text-white shadow-lg transition-all ${
              activeAnalysis === 'pipeline' ? 'bg-blue-600 ring-2 ring-blue-400 scale-110' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title="Pipeline Integrity"
            onClick={() => setActiveAnalysis(activeAnalysis === 'pipeline' ? null : 'pipeline')}
          >
            <PipelineIcon className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-full text-white shadow-lg transition-all ${
              activeAnalysis === 'sar' ? 'bg-purple-600 ring-2 ring-purple-400 scale-110' : 'bg-purple-500 hover:bg-purple-600'
            }`}
            title="SAR Monitoring"
            onClick={() => setActiveAnalysis(activeAnalysis === 'sar' ? null : 'sar')}
          >
            <RadarIcon className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-full text-white shadow-lg transition-all ${
              activeAnalysis === 'ndvi' ? 'bg-green-600 ring-2 ring-green-400 scale-110' : 'bg-green-500 hover:bg-green-600'
            }`}
            title="Environmental (NDVI)"
            onClick={() => setActiveAnalysis(activeAnalysis === 'ndvi' ? null : 'ndvi')}
          >
            <NdviIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right-side map controls */}
      <div 
        className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-1 bg-gray-800/90 p-1.5 rounded-lg shadow-xl backdrop-blur-sm"
        style={{ zIndex: 1000, pointerEvents: 'auto' }}
      >
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors" 
          onClick={handleResetView}
          title="Reset to Niger Delta"
        >
          <Compass className="w-5 h-5" />
        </button>
        
        <button 
          className={`p-2 rounded transition-colors ${showCloudCover ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          onClick={() => setShowCloudCover(!showCloudCover)}
          title="Toggle Cloud Coverage"
        >
          <Cloud className="w-5 h-5" />
        </button>
        
        <div className="h-px bg-gray-600 my-1"></div>
        
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
          onClick={handleMaximizeZoom}
          title="Maximize Zoom"
        >
          <Maximize className="w-5 h-5" />
        </button>
        
        <button 
          className={`p-2 rounded transition-colors ${editMode ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          onClick={() => setEditMode(!editMode)}
          title="Toggle Edit Mode"
        >
          <Edit className="w-5 h-5" />
        </button>
        
        <button 
          className={`p-2 rounded transition-colors ${measureMode ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          onClick={() => setMeasureMode(!measureMode)}
          title="Toggle Measurement Tool"
        >
          <Ruler className="w-5 h-5" />
        </button>
        
        <div className="h-px bg-gray-600 my-1"></div>
        
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors relative"
          onClick={() => setShowLayerSelector(!showLayerSelector)}
          title="Change Base Layer"
        >
          <Map className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
          onClick={() => console.log('Toggle Layers')}
          title="Layer Management"
        >
          <Layers className="w-5 h-5" />
        </button>
        
        <div className="h-px bg-gray-600 my-1"></div>
        
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Base Layer Selector Modal */}
      {showLayerSelector && (
        <div 
          className="absolute top-1/2 right-24 -translate-y-1/2 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg shadow-2xl w-72 border border-gray-700"
          style={{ zIndex: 1001, pointerEvents: 'auto' }}
        >
          <h3 className="text-white font-semibold text-base mb-4">Select Base Layer</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                setBaseLayer('osm');
                setShowLayerSelector(false);
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-all ${
                baseLayer === 'osm' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold text-sm">OpenStreetMap</div>
              <div className="text-xs opacity-75 mt-1">Detailed street map with labels</div>
            </button>
            
            <button
              onClick={() => {
                setBaseLayer('satellite');
                setShowLayerSelector(false);
              }}
              className={`w-full px-4 py-3 text-left rounded-lg transition-all ${
                baseLayer === 'satellite' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold text-sm">Satellite Imagery</div>
              <div className="text-xs opacity-75 mt-1">High-resolution aerial view</div>
            </button>
          </div>

          <button
            onClick={() => setShowLayerSelector(false)}
            className="mt-4 w-full px-3 py-2 text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Active Mode Indicators */}
      {(editMode || measureMode || showCloudCover || activeAnalysis) && (
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl border border-gray-700"
          style={{ zIndex: 1000, pointerEvents: 'auto' }}
        >
          <div className="flex items-center gap-4 text-sm">
            {activeAnalysis === 'leak' && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">Leak Detection Active</span>
                <span className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs">2 CRITICAL</span>
              </div>
            )}
            {activeAnalysis === 'thermal' && (
              <div className="flex items-center gap-2 text-orange-400">
                <ThermalIcon className="w-4 h-4" />
                <span className="font-semibold">Thermal Monitoring Active</span>
                <span className="px-2 py-0.5 bg-orange-600/30 text-orange-400 rounded text-xs">210.2°C MAX</span>
              </div>
            )}
            {activeAnalysis === 'pipeline' && (
              <div className="flex items-center gap-2 text-blue-400">
                <PipelineIcon className="w-4 h-4" />
                <span className="font-semibold">Pipeline Integrity Active</span>
                <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 rounded text-xs">1 WARNING</span>
              </div>
            )}
            {activeAnalysis === 'sar' && (
              <div className="flex items-center gap-2 text-purple-400">
                <RadarIcon className="w-4 h-4" />
                <span className="font-semibold">SAR Monitoring Active</span>
                <span className="px-2 py-0.5 bg-purple-600/30 text-purple-400 rounded text-xs">ALL-WEATHER</span>
              </div>
            )}
            {activeAnalysis === 'ndvi' && (
              <div className="flex items-center gap-2 text-green-400">
                <NdviIcon className="w-4 h-4" />
                <span className="font-semibold">Environmental Monitoring Active</span>
                <span className="px-2 py-0.5 bg-green-600/30 text-green-400 rounded text-xs">NDVI: 0.68</span>
              </div>
            )}
            {editMode && (
              <div className="flex items-center gap-2 text-blue-400 border-l border-gray-600 pl-4">
                <Edit className="w-4 h-4" />
                <span>Edit Mode</span>
              </div>
            )}
            {measureMode && (
              <div className="flex items-center gap-2 text-green-400 border-l border-gray-600 pl-4">
                <Ruler className="w-4 h-4" />
                <span>Measurement Tool</span>
              </div>
            )}
            {showCloudCover && (
              <div className="flex items-center gap-2 text-cyan-400 border-l border-gray-600 pl-4">
                <Cloud className="w-4 h-4" />
                <span>Cloud Coverage: {Math.floor(Math.random() * 30)}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;
