# FlowSafe Features Documentation
## by Proforce Galaxies

### Overview
FlowSafe is a comprehensive geospatial monitoring platform designed specifically for oil and gas operations in the Niger Delta region of Nigeria. The application provides critical real-time surveillance including leak detection, thermal monitoring, pipeline integrity assessment, SAR monitoring, security systems, and environmental compliance capabilities.

---

## Core Features

### 1. Interactive Multi-View Mapping
- **Triple Map View**: Simultaneous display of three synchronized map views
  - Left Panel: Base map view
  - Center Panel: Analysis overlay with color filters for environmental monitoring
  - Right Panel: Comparison view (typically satellite imagery)
- **Base Layer Options**:
  - OpenStreetMap (OSM) for street-level detail
  - Esri World Imagery for satellite views
- **Niger Delta Focus**: Default centered at coordinates 4.8156°N, 6.9698°E

### 2. Map Controls (Right Sidebar)

#### Navigation Controls
- **Compass Button**: Reset view to Niger Delta default location
- **Zoom In/Out (+/-)**: Precise zoom level control (1-18)
- **Maximize**: Jump to maximum zoom level (18)

#### Map Synchronization
- **Cloud Button** (blue when active): Toggle synchronized pan/zoom across all three map views
  - When enabled: All maps move and zoom together
  - When disabled: Each map can be controlled independently

#### Tools
- **Edit Mode** (blue when active): Toggle drawing and annotation capabilities
- **Ruler Tool** (blue when active): Enable distance measurement mode
- **Map Layers**: Open base layer selector panel

### 3. Analysis Controls (Bottom-Left)

#### Critical Operations Monitoring
- **Leak Detection** (Red) - Real-time methane, gas, and oil leak monitoring with critical alerts
  - Displays concentration levels in ppm or barrels
  - Shows active leak locations with severity indicators
  - Critical: 2,450 ppm methane detection
  
- **Thermal Monitoring** (Orange) - Heat signature detection
  - Monitors flare activity, equipment temperature, pipeline heat
  - Displays temperature readings (°C)
  - Alert threshold: >210°C for equipment

- **Pipeline Integrity** (Blue) - Pressure and flow monitoring
  - Tracks pressure levels (psi) and flow rates (bpd)
  - Monitors corrosion levels across pipeline network
  - Status indicators: Normal, Warning, Critical

- **SAR Monitoring** (Purple) - All-weather radar surveillance
  - Land subsidence detection
  - Ground movement tracking
  - 100% coverage even in adverse weather

- **Environmental (NDVI)** (Green) - Compliance monitoring
  - Vegetation health assessment
  - Oil spill impact analysis
  - Water quality monitoring
  - Regulatory compliance tracking

### 4. Left Sidebar Tools

#### Information Panel (Info Icon)
- Opens detailed panel showing:
  - Current location (Niger Delta, Nigeria)
  - Coverage area (Oil & Gas Infrastructure)
  - Active alerts and critical incidents
  - Last update timestamp
  - System description

#### Additional Tools
- **Target**: Set target location for focused monitoring
- **Satellite**: Quick satellite imagery controls
- **Area**: Define custom monitoring areas/polygons
- **Add**: Add new monitoring points or markers

### 5. Analysis Panel (Right Sidebar)

#### Operations Summary
Real-time dashboard showing:
- Active Alerts: 6 total
- Critical Alerts: 2 requiring immediate action
- Facilities Monitored: 47 active sites
- Pipeline Network: 2,847 km under surveillance

#### Leak Detection (CRITICAL Priority)
- **Methane Detected**: 2,450 ppm (Critical - Active)
- **Gas Leaks**: 890 ppm (High - Monitoring)
- **Oil Spills**: 125 barrels (Medium - Resolved)

#### Thermal Monitoring
- **Flare Activity**: 185.5°C (+15°C - Medium severity)
- **Equipment Heat**: 210.2°C (+28°C - High severity)
- **Pipeline Temp**: 156.8°C (+5°C - Low severity)

#### Pipeline Integrity
- **Pressure Normal**: 1,250 psi (+50 psi - Monitoring)
- **Pressure Warning**: 980 psi (-70 psi - Warning)
- **Critical Pressure**: 750 psi (-150 psi - Critical)
- **Corrosion Level**: 28% average (+8% - High severity)

#### SAR Monitoring
- **Land Subsidence**: 15.7 cm (-2.3 cm - High)
- **Ground Movement**: 8.4 mm (+1.1 mm - Medium)
- **All-Weather Coverage**: 100% Active

#### Security
- **Perimeter Breach**: 1 active incident (Critical)
- **Unauthorized Access**: 2 incidents today (High)
- **Resolved Incidents**: 3 total

#### Environmental Compliance
- **Vegetation Health**: 0.68 NDVI (+0.12 - Monitoring)
- **Oil Spill Impact**: -0.15 (-0.08 - Medium severity)
- **Water Quality**: 78% clean (-5% - Medium severity)
- **Compliance Status**: 94% (+2% - Monitoring)

#### Alerts Tab
Dedicated alert dashboard showing:
- **Active Alerts** with timestamp and severity
  - METHANE LEAK: 2,450 ppm at 08:30
  - THERMAL ANOMALY: 210.2°C at 09:45
  - SECURITY BREACH: Perimeter intrusion at 06:30
- **Warnings**
  - PRESSURE DROP: Pipeline B at 10:15

#### Layers Tab
Toggle active monitoring layers:
- Leak Detection (Active)
- Thermal Overlay (Active)
- Pipeline Network (Active)
- SAR Coverage (Active)
- Security Zones
- Environmental (NDVI)

### 6. Header Features
- **FlowSafe Branding**: Clear company identification
- **Niger Delta Operations**: Project context selector
- **Download**: Export data and reports
- **Share**: Share current view or reports
- **Help**: Access documentation
- **Notifications**: System alerts (Bell icon)
- **User Profile**: Proforce Galaxies account (PG)

### 7. Footer Controls
- **Area Filter**: Filter by specific monitoring areas
- **Timeline Navigation**: Navigate through historical data
- **Visibility Controls**: Toggle layer visibility
- **Attribution**: Proper credit to data providers

---

## Technical Capabilities

### Real-Time Synchronization
- All three map views can be synchronized for consistent navigation
- Independent control available when needed for comparison analysis

### Oil & Gas Critical Operations
- **Leak Detection**: Real-time methane, gas, and oil leak monitoring with severity classification
- **Thermal Monitoring**: Equipment overheating, flare tracking, and pipeline temperature analysis
- **Pipeline Integrity**: Pressure monitoring, flow rate tracking, corrosion assessment, and inspection scheduling
- **SAR Monitoring**: All-weather land subsidence and ground movement detection
- **Security Systems**: Perimeter breach detection, intrusion alerts, and incident tracking
- **Environmental Compliance**: NDVI vegetation monitoring, water quality assessment, and spill impact analysis
- **Facility Management**: Real-time status of oil facilities, storage tanks, and production equipment
- **Settlement Monitoring**: Proximity analysis for safety and security

### Interactive Controls
- Pan and zoom across all map views
- Switch between multiple base layers
- Toggle various monitoring overlays
- Measure distances
- Add custom annotations
- Define monitoring areas

---

## Use Cases

### 1. Critical Incident Response
- **Immediate leak detection** with automatic alerts for methane, gas, and oil spills
- **Thermal anomaly detection** to prevent equipment failures and fires
- **Real-time security breach notification** for rapid response to intrusions
- **Pipeline integrity alerts** for pressure drops and corrosion concerns

### 2. Pipeline Monitoring & Integrity
- Track pipeline routes and pressure levels across the Niger Delta
- Monitor flow rates and detect anomalies in real-time
- Assess corrosion levels and schedule preventive maintenance
- Detect unauthorized encroachment and third-party interference

### 3. Facility Management & Security
- Track all 47 oil and gas facilities across 12,500 sq km
- Monitor storage tank status and equipment temperature
- Detect perimeter breaches and unauthorized access
- Assess facility security zones and access points

### 4. Environmental Compliance
- NDVI-based vegetation health monitoring for regulatory reporting
- Oil spill detection, containment tracking, and impact assessment
- Water quality monitoring for contamination detection
- Land use change detection and environmental impact studies

### 5. All-Weather Operations
- SAR monitoring provides 100% coverage regardless of weather conditions
- Land subsidence tracking near extraction and production sites
- Ground movement detection for infrastructure stability
- Continuous surveillance during rainy season and cloud cover

---

## Data Sources
- OpenStreetMap contributors
- Esri World Imagery
- Mapbox services
- Real-time NDVI satellite data
- Proforce Galaxies proprietary analysis

---

## Getting Started

### Prerequisites
- Node.js installed
- GEMINI_API_KEY configured in .env.local

### Running the Application
```bash
npm install
npm run dev
```

Application runs on http://localhost:3000/

---

*FlowSafe © 2025 Proforce Galaxies. All rights reserved.*
