
export type SegmentationCategory = 'NDVI' | 'Segmentation' | 'Rooftops';
export type AnalysisCategory = 'LeakDetection' | 'Thermal' | 'PipelineIntegrity' | 'SAR' | 'Security' | 'Environmental';

export interface AnalysisItem {
  name: string;
  color: string;
  change: string;
  percentage: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'active' | 'monitoring' | 'resolved';
}

export interface LeakAlert {
  id: string;
  location: [number, number];
  type: 'methane' | 'oil' | 'gas';
  severity: 'critical' | 'high' | 'medium' | 'low';
  concentration: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'contained';
}

export interface ThermalAnomaly {
  id: string;
  location: [number, number];
  temperature: number;
  type: 'flare' | 'equipment' | 'pipeline' | 'unknown';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface PipelineSegment {
  id: string;
  name: string;
  pressure: number;
  flowRate: number;
  status: 'normal' | 'warning' | 'critical';
  lastInspection: Date;
  corrosionLevel: number;
}

export interface SecurityIncident {
  id: string;
  location: [number, number];
  type: 'intrusion' | 'unauthorized_access' | 'vandalism' | 'theft';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
}

export type BaseLayerType = 'osm' | 'satellite';

export interface BaseLayer {
  id: BaseLayerType;
  name: string;
  url: string;
  attribution: string;
}

export interface GeoJSONLayer {
  id: string;
  name: string;
  data: any; // GeoJSON FeatureCollection or Feature
  visible: boolean;
  color?: string;
  uploadedAt: Date;
}

export interface GeoTIFFLayer {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  imageUrl: string; // Data URL of the rendered image
  visible: boolean;
  opacity: number;
  uploadedAt: Date;
  metadata?: {
    width: number;
    height: number;
    bands: number;
    projection?: string;
  };
}
