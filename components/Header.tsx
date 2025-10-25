
import React, { useState } from 'react';
import { Menu, ChevronDown, HelpCircle, Bell } from './icons';
import { operationalStats } from '../demoData';

const Header: React.FC = () => {
  const [showOperations, setShowOperations] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShare, setShowShare] = useState(false);

  return (
    <header className="bg-[#111827] border-b border-gray-700 flex items-center justify-between px-4 py-2 text-sm z-30 relative">
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg">FLOWSAFE</span>
          <span className="text-gray-400 text-xs">by Proforce Galaxies</span>
          <span className="text-gray-500">&gt;</span>
        </div>
        <div className="relative">
          <button 
            className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setShowOperations(!showOperations)}
          >
            <span className="text-white">Niger Delta Operations</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showOperations && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                🔴 Niger Delta Operations
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-400">
                Offshore Platform - Alpha
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-400">
                Coastal Refinery Zone
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-400">
                Eastern Distribution Network
              </button>
              <div className="border-t border-gray-700 my-2"></div>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-cyan-400">
                + Add New Operation
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setShowDownload(!showDownload)}
          >
            <span>Download</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDownload && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                📄 Analysis Report (PDF)
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                📊 Leak Detection Data (CSV)
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                🌡️ Thermal Data (Excel)
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                🗺️ Pipeline Map (KML)
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-white">
                📦 Complete Dataset (ZIP)
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className="bg-blue-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => setShowShare(!showShare)}
          >
            Share
          </button>
          {showShare && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50">
              <h3 className="text-white font-semibold mb-3">Share View</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                  🔗 Copy Link
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                  📧 Email Report
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white">
                  📱 Send to Mobile
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          {showHelp && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50">
              <h3 className="text-white font-semibold mb-3">Help & Support</h3>
              <div className="space-y-2 text-sm">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  📚 Documentation
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  🎬 Video Tutorials
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  ⌨️ Keyboard Shortcuts
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300">
                  📞 Contact Support
                </button>
                <div className="border-t border-gray-700 my-2"></div>
                <p className="text-xs text-gray-400 px-3">Version 2.1.0</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-white transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-xs flex items-center justify-center text-white">
              {operationalStats.criticalAlerts}
            </span>
          </button>
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-xs text-gray-400">{operationalStats.activeAlerts} active alerts</p>
              </div>
              <div className="divide-y divide-gray-700">
                <div className="p-3 hover:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-lg">🚨</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">Critical: Methane Leak Detected</p>
                      <p className="text-gray-400 text-xs">2,450 ppm at Pipeline Segment A</p>
                      <p className="text-gray-500 text-xs mt-1">8:30 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 text-lg">🔥</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">High: Equipment Overheating</p>
                      <p className="text-gray-400 text-xs">Temperature: 210.2°C</p>
                      <p className="text-gray-500 text-xs mt-1">9:45 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-lg">🛡️</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">Critical: Perimeter Breach</p>
                      <p className="text-gray-400 text-xs">Unauthorized intrusion detected</p>
                      <p className="text-gray-500 text-xs mt-1">6:30 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-500 text-lg">⚠️</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">Warning: Pressure Drop</p>
                      <p className="text-gray-400 text-xs">Pipeline B: 980 psi (-70 psi)</p>
                      <p className="text-gray-500 text-xs mt-1">10:15 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-lg">ℹ️</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">Info: Inspection Scheduled</p>
                      <p className="text-gray-400 text-xs">Eastern Pipeline - Main</p>
                      <p className="text-gray-500 text-xs mt-1">Tomorrow, 8:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-700">
                <button className="w-full text-center text-blue-400 text-sm hover:text-blue-300">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white cursor-pointer hover:bg-blue-700 transition-colors">
          PG
        </div>
      </div>
    </header>
  );
};

export default Header;
