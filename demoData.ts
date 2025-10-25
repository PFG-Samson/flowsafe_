import { LeakAlert, ThermalAnomaly, PipelineSegment, SecurityIncident, AnalysisItem } from './types';

// Leak Detection Alerts
export const leakAlerts: LeakAlert[] = [
  {
    id: 'leak-001',
    location: [4.8256, 6.9798],
    type: 'methane',
    severity: 'critical',
    concentration: '2,450 ppm',
    timestamp: new Date('2025-10-23T08:30:00'),
    status: 'active'
  },
  {
    id: 'leak-002',
    location: [4.8056, 6.9598],
    type: 'gas',
    severity: 'high',
    concentration: '890 ppm',
    timestamp: new Date('2025-10-23T09:15:00'),
    status: 'investigating'
  },
  {
    id: 'leak-003',
    location: [4.8356, 6.9898],
    type: 'oil',
    severity: 'medium',
    concentration: '125 barrels',
    timestamp: new Date('2025-10-23T07:45:00'),
    status: 'contained'
  }
];

// Thermal Anomalies
export const thermalAnomalies: ThermalAnomaly[] = [
  {
    id: 'thermal-001',
    location: [4.8156, 6.9698],
    temperature: 185.5,
    type: 'flare',
    severity: 'medium',
    timestamp: new Date('2025-10-23T10:20:00')
  },
  {
    id: 'thermal-002',
    location: [4.8456, 6.9998],
    temperature: 210.2,
    type: 'equipment',
    severity: 'high',
    timestamp: new Date('2025-10-23T09:45:00')
  },
  {
    id: 'thermal-003',
    location: [4.7956, 6.9498],
    temperature: 156.8,
    type: 'pipeline',
    severity: 'low',
    timestamp: new Date('2025-10-23T08:10:00')
  }
];

// Pipeline Segments
export const pipelineSegments: PipelineSegment[] = [
  {
    id: 'pipe-001',
    name: 'Trans Niger Pipeline - Segment A',
    pressure: 1250,
    flowRate: 45000,
    status: 'normal',
    lastInspection: new Date('2025-10-15'),
    corrosionLevel: 12
  },
  {
    id: 'pipe-002',
    name: 'Trans Niger Pipeline - Segment B',
    pressure: 980,
    flowRate: 38000,
    status: 'warning',
    lastInspection: new Date('2025-10-10'),
    corrosionLevel: 28
  },
  {
    id: 'pipe-003',
    name: 'Eastern Pipeline - Main',
    pressure: 750,
    flowRate: 25000,
    status: 'critical',
    lastInspection: new Date('2025-09-28'),
    corrosionLevel: 45
  },
  {
    id: 'pipe-004',
    name: 'Coastal Distribution Line',
    pressure: 1100,
    flowRate: 32000,
    status: 'normal',
    lastInspection: new Date('2025-10-18'),
    corrosionLevel: 8
  }
];

// Security Incidents
export const securityIncidents: SecurityIncident[] = [
  {
    id: 'sec-001',
    location: [4.8106, 6.9648],
    type: 'intrusion',
    severity: 'critical',
    timestamp: new Date('2025-10-23T06:30:00'),
    status: 'active'
  },
  {
    id: 'sec-002',
    location: [4.8206, 6.9748],
    type: 'unauthorized_access',
    severity: 'high',
    timestamp: new Date('2025-10-23T05:15:00'),
    status: 'investigating'
  },
  {
    id: 'sec-003',
    location: [4.7906, 6.9448],
    type: 'vandalism',
    severity: 'medium',
    timestamp: new Date('2025-10-22T22:45:00'),
    status: 'resolved'
  }
];

// Analysis Data for Right Sidebar
export const oilGasAnalysisData = {
  LeakDetection: [
    { name: 'Methane Detected', color: 'bg-red-500', change: '+3 alerts', percentage: '2,450 ppm', severity: 'critical' as const, status: 'active' as const },
    { name: 'Gas Leaks', color: 'bg-orange-500', change: '+1 alert', percentage: '890 ppm', severity: 'high' as const, status: 'monitoring' as const },
    { name: 'Oil Spills', color: 'bg-yellow-600', change: '0 new', percentage: '125 bbls', severity: 'medium' as const, status: 'resolved' as const },
  ] as AnalysisItem[],
  
  Thermal: [
    { name: 'Flare Activity', color: 'bg-orange-400', change: '+15°C', percentage: '185.5°C', severity: 'medium' as const },
    { name: 'Equipment Heat', color: 'bg-red-400', change: '+28°C', percentage: '210.2°C', severity: 'high' as const },
    { name: 'Pipeline Temp', color: 'bg-yellow-500', change: '+5°C', percentage: '156.8°C', severity: 'low' as const },
  ] as AnalysisItem[],
  
  PipelineIntegrity: [
    { name: 'Pressure Normal', color: 'bg-green-500', change: '+50 psi', percentage: '1,250 psi', status: 'monitoring' as const },
    { name: 'Pressure Warning', color: 'bg-yellow-500', change: '-70 psi', percentage: '980 psi', severity: 'medium' as const },
    { name: 'Critical Pressure', color: 'bg-red-500', change: '-150 psi', percentage: '750 psi', severity: 'critical' as const },
    { name: 'Corrosion Level', color: 'bg-orange-600', change: '+8%', percentage: '28% avg', severity: 'high' as const },
  ] as AnalysisItem[],
  
  SAR: [
    { name: 'Land Subsidence', color: 'bg-purple-500', change: '-2.3 cm', percentage: '15.7 cm', severity: 'high' as const },
    { name: 'Ground Movement', color: 'bg-indigo-500', change: '+1.1 mm', percentage: '8.4 mm', severity: 'medium' as const },
    { name: 'All-Weather Coverage', color: 'bg-blue-500', change: '100%', percentage: 'Active', status: 'monitoring' as const },
  ] as AnalysisItem[],
  
  Security: [
    { name: 'Perimeter Breach', color: 'bg-red-600', change: '+1 incident', percentage: '1 active', severity: 'critical' as const, status: 'active' as const },
    { name: 'Unauthorized Access', color: 'bg-orange-600', change: '+1 incident', percentage: '2 today', severity: 'high' as const },
    { name: 'Resolved Incidents', color: 'bg-green-600', change: '+1 resolved', percentage: '3 total', status: 'resolved' as const },
  ] as AnalysisItem[],
  
  Environmental: [
    { name: 'Vegetation Health', color: 'bg-green-400', change: '+0.12', percentage: '0.68 NDVI', status: 'monitoring' as const },
    { name: 'Oil Spill Impact', color: 'bg-red-500', change: '-0.08', percentage: '-0.15', severity: 'medium' as const },
    { name: 'Water Quality', color: 'bg-blue-400', change: '-5%', percentage: '78% clean', severity: 'medium' as const },
    { name: 'Compliance Status', color: 'bg-cyan-500', change: '+2%', percentage: '94%', status: 'monitoring' as const },
  ] as AnalysisItem[]
};

// Statistics Summary
export const operationalStats = {
  activeFacilities: 47,
  pipelineLength: 2847, // km
  dailyProduction: 125000, // barrels
  activeAlerts: 6,
  criticalAlerts: 2,
  facilitiesMonitored: 47,
  coverageArea: 12500 // sq km
};
