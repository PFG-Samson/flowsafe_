
import React from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import { GeoJSONProvider } from './contexts/GeoJSONContext';
import { MapProvider } from './contexts/MapContext';

const App: React.FC = () => {
  return (
    <MapProvider>
      <GeoJSONProvider>
        <div className="h-screen w-screen bg-[#1F2937] text-gray-300 font-sans flex flex-col overflow-hidden">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <LeftSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <MainContent />
              <Footer />
            </div>
            <RightSidebar />
          </div>
        </div>
      </GeoJSONProvider>
    </MapProvider>
  );
};

export default App;
