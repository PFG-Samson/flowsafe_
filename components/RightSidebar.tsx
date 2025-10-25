
import React, { useState } from 'react';
import { Grid, HomeIcon, ChevronDown } from './icons';
import { AnalysisItem } from '../types';
import { oilGasAnalysisData, operationalStats } from '../demoData';
import { useGeoJSON } from '../contexts/GeoJSONContext';
import GeoJSONUploader from './GeoJSONUploader';


const getSeverityColor = (severity?: string) => {
    switch (severity) {
        case 'critical': return 'text-red-500 font-bold';
        case 'high': return 'text-orange-500';
        case 'medium': return 'text-yellow-500';
        case 'low': return 'text-blue-400';
        default: return 'text-gray-400';
    }
};

const getStatusBadge = (status?: string) => {
    switch (status) {
        case 'active': return <span className="px-1.5 py-0.5 text-xs bg-red-600/30 text-red-400 rounded">ACTIVE</span>;
        case 'monitoring': return <span className="px-1.5 py-0.5 text-xs bg-blue-600/30 text-blue-400 rounded">MONITORING</span>;
        case 'resolved': return <span className="px-1.5 py-0.5 text-xs bg-green-600/30 text-green-400 rounded">RESOLVED</span>;
        default: return null;
    }
};

interface CollapsibleSectionProps {
    title: string;
    icon?: React.ReactNode;
    items: AnalysisItem[];
    priority?: boolean;
    defaultOpen?: boolean;
    accentColor?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
    title, 
    icon, 
    items, 
    priority, 
    defaultOpen = false,
    accentColor = 'border-gray-700'
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    // Count critical/high severity items
    const criticalCount = items.filter(item => item.severity === 'critical').length;
    const highCount = items.filter(item => item.severity === 'high').length;
    const activeCount = items.filter(item => item.status === 'active').length;
    
    return (
        <div className={`mb-2 border rounded-lg overflow-hidden transition-all ${
            priority ? 'border-red-500/50 bg-red-900/10' : accentColor
        }`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors ${
                    isOpen ? 'bg-gray-800/30' : ''
                }`}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-white font-semibold text-sm">{title}</h3>
                    {priority && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-600/30 text-red-400 rounded font-semibold">
                            CRITICAL
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {criticalCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full font-semibold">
                            {criticalCount}
                        </span>
                    )}
                    {highCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-orange-600 text-white rounded-full font-semibold">
                            {highCount}
                        </span>
                    )}
                    {activeCount > 0 && !criticalCount && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-full font-semibold">
                            {activeCount}
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`} />
                </div>
            </button>
            
            {isOpen && (
                <div className="px-3 pb-3 pt-1">
                    <ul className="space-y-2 text-xs">
                        {items.map((item) => (
                            <li key={item.name} className="flex items-center gap-2 p-2 bg-gray-900/30 rounded hover:bg-gray-900/50 transition-colors">
                                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                                <span className="flex-1 text-gray-300 font-medium">{item.name}</span>
                                {item.severity && (
                                    <span className={`text-xs ${getSeverityColor(item.severity)} px-1`}>●</span>
                                )}
                                {item.status && getStatusBadge(item.status)}
                                <span className={`text-xs font-semibold ${
                                    item.change.startsWith('+') && !item.change.includes('alert') && !item.change.includes('incident') 
                                        ? 'text-green-400' 
                                        : item.change.startsWith('-') 
                                        ? 'text-red-400' 
                                        : 'text-gray-400'
                                }`}>
                                    {item.change}
                                </span>
                                <span className="w-16 text-right text-white font-semibold">{item.percentage}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


interface RightSidebarProps {
    mapRef?: React.MutableRefObject<any>;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ mapRef }) => {
    const [activeTab, setActiveTab] = useState('Analysis');
    const { layers, toggleLayerVisibility, removeLayer, zoomToLayer } = useGeoJSON();

    return (
        <aside className="bg-[#1F2937] w-72 border-l border-gray-700 flex flex-col z-20">
            <div className="flex border-b border-gray-700">
                {['Analysis', 'Alerts', 'Layers'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'
                            }`}
                    >
                        {tab}
                        {tab === 'Alerts' && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full">{operationalStats.criticalAlerts}</span>
                        )}
                    </button>
                ))}
            </div>
            <div className="h-full overflow-y-auto">
                <CollapsibleSection 
                  title="GeoJSON Layers" 
                  icon="🗺️"
                  items={[]}
                  defaultOpen={true}
                  accentColor="border-blue-700"
                >
                  <div className="p-2">
                    <GeoJSONUploader />
                  </div>
                </CollapsibleSection>
                {activeTab === 'Analysis' && (
                    <>
                        {/* Operational Summary - Always Visible */}
                        <div className="mb-3 p-3 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg border border-gray-700 shadow-lg">
                            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                <span className="text-blue-400">📊</span>
                                Operations Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <div className="text-gray-400 text-xs">Active Alerts</div>
                                    <div className="text-white font-bold text-lg">{operationalStats.activeAlerts}</div>
                                </div>
                                <div className="bg-red-900/30 p-2 rounded border border-red-700/30">
                                    <div className="text-gray-400 text-xs">Critical</div>
                                    <div className="text-red-400 font-bold text-lg">{operationalStats.criticalAlerts}</div>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <div className="text-gray-400 text-xs">Facilities</div>
                                    <div className="text-green-400 font-bold text-lg">{operationalStats.activeFacilities}</div>
                                </div>
                                <div className="bg-gray-900/50 p-2 rounded">
                                    <div className="text-gray-400 text-xs">Pipeline</div>
                                    <div className="text-blue-400 font-bold text-lg">{operationalStats.pipelineLength}<span className="text-xs text-gray-400 ml-1">km</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Analysis Sections */}
                        <div className="space-y-2">
                            <CollapsibleSection
                                title="Leak Detection"
                                items={oilGasAnalysisData.LeakDetection}
                                priority={true}
                                defaultOpen={true}
                                icon={<span className="text-red-500 text-lg">⚠️</span>}
                                accentColor="border-red-700/50"
                            />
                            
                            <CollapsibleSection
                                title="Thermal Monitoring"
                                items={oilGasAnalysisData.Thermal}
                                defaultOpen={false}
                                icon={<span className="text-orange-400 text-lg">🔥</span>}
                                accentColor="border-orange-700/50"
                            />
                            
                            <CollapsibleSection
                                title="Pipeline Integrity"
                                items={oilGasAnalysisData.PipelineIntegrity}
                                defaultOpen={false}
                                icon={<span className="text-blue-400 text-lg">⚙️</span>}
                                accentColor="border-blue-700/50"
                            />
                            
                            <CollapsibleSection
                                title="SAR Monitoring"
                                items={oilGasAnalysisData.SAR}
                                defaultOpen={false}
                                icon={<span className="text-purple-400 text-lg">📡</span>}
                                accentColor="border-purple-700/50"
                            />
                            
                            <CollapsibleSection
                                title="Security"
                                items={oilGasAnalysisData.Security}
                                defaultOpen={false}
                                icon={<span className="text-red-400 text-lg">🛡️</span>}
                                accentColor="border-red-700/50"
                            />
                            
                            {/* Environmental Compliance - Separated */}
                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <CollapsibleSection
                                    title="Environmental Compliance"
                                    items={oilGasAnalysisData.Environmental}
                                    defaultOpen={false}
                                    icon={<span className="text-green-400 text-lg">🌿</span>}
                                    accentColor="border-green-700/50"
                                />
                            </div>
                        </div>
                    </>
                )}
                {activeTab === 'Alerts' && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="text-red-500">🚨</span>
                                Active Alerts
                            </h3>
                            <div className="space-y-2">
                                <div className="p-2 bg-red-900/20 border border-red-700/50 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-red-400 font-semibold text-xs">METHANE LEAK</span>
                                        <span className="text-xs text-gray-400">08:30</span>
                                    </div>
                                    <div className="text-xs text-gray-300">2,450 ppm detected at Pipeline Segment A</div>
                                </div>
                                <div className="p-2 bg-orange-900/20 border border-orange-700/50 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-orange-400 font-semibold text-xs">THERMAL ANOMALY</span>
                                        <span className="text-xs text-gray-400">09:45</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Equipment temperature: 210.2°C</div>
                                </div>
                                <div className="p-2 bg-red-900/20 border border-red-700/50 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-red-400 font-semibold text-xs">SECURITY BREACH</span>
                                        <span className="text-xs text-gray-400">06:30</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Perimeter intrusion detected</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="text-yellow-500">⚠</span>
                                Warnings
                            </h3>
                            <div className="space-y-2">
                                <div className="p-2 bg-yellow-900/20 border border-yellow-700/50 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-yellow-400 font-semibold text-xs">PRESSURE DROP</span>
                                        <span className="text-xs text-gray-400">10:15</span>
                                    </div>
                                    <div className="text-xs text-gray-300">Pipeline B: 980 psi (-70 psi)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Layers' && (
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-3">Base Layers</h3>
                        <div className="space-y-2 text-xs mb-4">
                            {['Leak Detection', 'Thermal Overlay', 'Pipeline Network', 'SAR Coverage', 'Security Zones', 'Environmental (NDVI)'].map((layer, i) => (
                                <label key={layer} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded hover:bg-gray-700/50 cursor-pointer">
                                    <input type="checkbox" defaultChecked={i < 4} className="form-checkbox" />
                                    <span className="text-gray-300">{layer}</span>
                                </label>
                            ))}
                        </div>
                        
                        {/* GeoJSON Layers Section */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <h3 className="text-white font-semibold text-sm mb-3 flex items-center justify-between">
                                <span>GeoJSON Layers</span>
                                <span className="text-gray-400 text-xs">{layers.length}</span>
                            </h3>
                            {layers.length === 0 ? (
                                <div className="text-gray-400 text-xs text-center py-4">
                                    No GeoJSON layers uploaded.
                                    <br />
                                    Use the upload button in the left sidebar.
                                </div>
                            ) : (
                                <div className="space-y-2 text-xs">
                                    {layers.map((layer) => (
                                        <div 
                                            key={layer.id} 
                                            className="flex items-center gap-2 p-2 bg-gray-800/50 rounded hover:bg-gray-700/50 group"
                                            onDoubleClick={() => zoomToLayer(layer.id, mapRef?.current)}
                                            title="Double-click to zoom to extent"
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={layer.visible}
                                                onChange={() => toggleLayerVisibility(layer.id)}
                                                className="form-checkbox" 
                                            />
                                            <div 
                                                className="w-3 h-3 rounded-sm" 
                                                style={{ backgroundColor: layer.color || '#3b82f6' }}
                                            />
                                            <span className="flex-1 text-gray-300 cursor-pointer">{layer.name}</span>
                                            <button
                                                onClick={() => removeLayer(layer.id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                                title="Remove layer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default RightSidebar;
