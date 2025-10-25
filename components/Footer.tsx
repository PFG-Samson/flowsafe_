
import React, { useState, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, ArrowLeft, ArrowRight, Eye, ListFilter } from './icons';

const Footer: React.FC = () => {
  const [showAreaFilter, setShowAreaFilter] = useState(false);
  const [showLayerCount, setShowLayerCount] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedArea, setSelectedArea] = useState('All area');
  const [layerCount, setLayerCount] = useState(48);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false }) + ' GMT';
  };

  const areas = [
    'All area',
    'Niger Delta - Main',
    'Pipeline Segment A',
    'Pipeline Segment B',
    'Facility Zone 1',
    'Offshore Platform',
  ];

  return (
    <footer className="bg-[#111827] border-t border-gray-700 flex items-center justify-between px-4 py-1 text-xs text-gray-400 z-10 relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div 
            className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => setShowAreaFilter(!showAreaFilter)}
          >
            <ListFilter className="w-4 h-4" />
            <span>{selectedArea}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          {showAreaFilter && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50">
              {areas.map((area) => (
                <button
                  key={area}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${
                    selectedArea === area ? 'text-blue-400' : 'text-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedArea(area);
                    setShowAreaFilter(false);
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        <div className="relative">
          <div 
            className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => setShowLayerCount(!showLayerCount)}
          >
            <ListFilter className="w-4 h-4" />
            <span>{layerCount}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          {showLayerCount && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 z-50">
              <p className="text-white font-semibold mb-2">Active Layers</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="form-checkbox" />
                  <span className="text-gray-300">Facilities (12)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="form-checkbox" />
                  <span className="text-gray-300">Pipelines (15)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="form-checkbox" />
                  <span className="text-gray-300">Sensors (21)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          title="Previous timestamp"
          onClick={() => setCurrentTime(new Date(currentTime.getTime() - 3600000))}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-white"
            onClick={() => setShowTimeOptions(!showTimeOptions)}
          >
            <span>{formatDate(currentTime)}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
          {showTimeOptions && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 z-50">
              <p className="text-white font-semibold mb-3">Time Controls</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300">
                  Real-time (Live)
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  Last Hour
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  Last 24 Hours
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  Last 7 Days
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  Custom Range
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button 
          className={`p-1 rounded-md transition-colors ${
            isPlaying ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
          }`}
          title="Toggle visibility"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <Eye className="w-4 h-4" />
        </button>
        
        <button 
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        <button 
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          title="Next timestamp"
          onClick={() => setCurrentTime(new Date(currentTime.getTime() + 3600000))}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-gray-500 text-xs">
        FlowSafe by Proforce Galaxies © Mapbox © OpenStreetMap © Esri
      </div>
    </footer>
  );
};

export default Footer;
