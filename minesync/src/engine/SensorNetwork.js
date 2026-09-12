/**
 * Mine Sync Sensor Network Topology & Baseline Specs
 * Coal Mine Site: Jharia-Raniganj Coalfield Region (Simulated Center: Lat 23.6330, Lng 86.4250)
 */

export const MINE_CENTER = { lat: 23.6330, lng: 86.4250 };

// Underground Coal Extraction Panels
export const UNDERGROUND_PANELS = [
  {
    id: 'PANEL-A1',
    name: 'Panel A1 (Longwall 101)',
    seam: 'Seam V - Deep Horizon (280m depth)',
    method: 'Continuous Longwall Mining',
    status: 'ACTIVE_EXTRACTION',
    coordinates: [
      [23.6355, 86.4220],
      [23.6355, 86.4270],
      [23.6325, 86.4270],
      [23.6325, 86.4220]
    ],
    color: '#ef4444' // red/active
  },
  {
    id: 'PANEL-A2',
    name: 'Panel A2 (Longwall 102)',
    seam: 'Seam V - Deep Horizon (280m depth)',
    method: 'Planned Longwall Extraction',
    status: 'PLANNED',
    coordinates: [
      [23.6320, 86.4220],
      [23.6320, 86.4270],
      [23.6290, 86.4270],
      [23.6290, 86.4220]
    ],
    color: '#3b82f6' // blue/planned
  },
  {
    id: 'PANEL-B1',
    name: 'Panel B1 (Legacy Workings)',
    seam: 'Seam IV - Upper Horizon (190m depth)',
    method: 'Room & Pillar (Goaf Stowing)',
    status: 'STABILIZED',
    coordinates: [
      [23.6355, 86.4275],
      [23.6355, 86.4315],
      [23.6300, 86.4315],
      [23.6300, 86.4275]
    ],
    color: '#10b981' // green/stabilized
  }
];

// Surface Infrastructure & Assets
export const CRITICAL_INFRASTRUCTURE = [
  {
    id: 'INFRA-RAIL',
    name: 'Main Coal Transportation Railway Line',
    type: 'RAILWAY',
    criticality: 'CRITICAL',
    speedLimitMax: 60, // km/h
    coordinates: [
      [23.6370, 86.4210],
      [23.6340, 86.4245],
      [23.6310, 86.4280],
      [23.6275, 86.4320]
    ],
    color: '#eab308' // amber
  },
  {
    id: 'INFRA-PIPE',
    name: 'High-Pressure Mine Drainage & Gas Pipeline',
    type: 'PIPELINE',
    criticality: 'HIGH',
    pressureRating: '16 Bar',
    coordinates: [
      [23.6365, 86.4215],
      [23.6335, 86.4250],
      [23.6295, 86.4290]
    ],
    color: '#06b6d4' // cyan
  },
  {
    id: 'INFRA-ROAD',
    name: 'Surface Haulage & Pit Access Road',
    type: 'ROAD',
    criticality: 'MEDIUM',
    coordinates: [
      [23.6305, 86.4205],
      [23.6315, 86.4240],
      [23.6345, 86.4265],
      [23.6375, 86.4295]
    ],
    color: '#a855f7' // purple
  },
  {
    id: 'INFRA-POWER-T4',
    name: '33kV Grid Transmission Tower T-04',
    type: 'POWER_TOWER',
    criticality: 'HIGH',
    coordinates: [23.6348, 86.4260],
    color: '#f97316' // orange
  },
  {
    id: 'INFRA-ADMIN',
    name: 'Pithead Admin & Worker Quarters',
    type: 'BUILDING',
    criticality: 'HIGH',
    coordinates: [23.6360, 86.4298],
    color: '#64748b' // slate
  }
];

// Initial 16 Sensor Network (4x4 Topology across surface monitoring area)
export const INITIAL_NODES = [
  // Row 1 - North
  { id: 'S-01', name: 'Node 01 (NW Boundary)', lat: 23.6358, lng: 86.4222, panel: 'PANEL-A1', mac: 'ESP32-S3-01' },
  { id: 'S-02', name: 'Node 02 (North Panel A1)', lat: 23.6356, lng: 86.4238, panel: 'PANEL-A1', mac: 'ESP32-S3-02' },
  { id: 'S-03', name: 'Node 03 (North Rail Cross)', lat: 23.6354, lng: 86.4255, panel: 'PANEL-A1', mac: 'ESP32-S3-03' },
  { id: 'S-04', name: 'Node 04 (NE Goaf Border)', lat: 23.6352, lng: 86.4272, panel: 'PANEL-B1', mac: 'ESP32-S3-04' },
  
  // Row 2 - North Central
  { id: 'S-05', name: 'Node 05 (West Panel A1)', lat: 23.6342, lng: 86.4225, panel: 'PANEL-A1', mac: 'ESP32-S3-05' },
  { id: 'S-06', name: 'Node 06 (Center Longwall 101)', lat: 23.6340, lng: 86.4241, panel: 'PANEL-A1', mac: 'ESP32-S3-06' },
  { id: 'S-07', name: 'Node 07 (Pipeline-Rail Node)', lat: 23.6338, lng: 86.4258, panel: 'PANEL-A1', mac: 'ESP32-S3-07' },
  { id: 'S-08', name: 'Node 08 (Pillar Barrier East)', lat: 23.6336, lng: 86.4275, panel: 'PANEL-B1', mac: 'ESP32-S3-08' },
  
  // Row 3 - South Central
  { id: 'S-09', name: 'Node 09 (Haul Road NW)', lat: 23.6326, lng: 86.4228, panel: 'PANEL-A2', mac: 'ESP32-S3-09' },
  { id: 'S-10', name: 'Node 10 (Panel A1-A2 Pillar)', lat: 23.6324, lng: 86.4244, panel: 'PANEL-A1', mac: 'ESP32-S3-10' },
  { id: 'S-11', name: 'Node 11 (Rail Crossing South)', lat: 23.6322, lng: 86.4261, panel: 'PANEL-A2', mac: 'ESP32-S3-11' },
  { id: 'S-12', name: 'Node 12 (East Goaf Monitor)', lat: 23.6320, lng: 86.4278, panel: 'PANEL-B1', mac: 'ESP32-S3-12' },
  
  // Row 4 - South
  { id: 'S-13', name: 'Node 13 (SW Boundary)', lat: 23.6310, lng: 86.4231, panel: 'PANEL-A2', mac: 'ESP32-S3-13' },
  { id: 'S-14', name: 'Node 14 (South Panel A2)', lat: 23.6308, lng: 86.4247, panel: 'PANEL-A2', mac: 'ESP32-S3-14' },
  { id: 'S-15', name: 'Node 15 (Pipeline South)', lat: 23.6306, lng: 86.4264, panel: 'PANEL-A2', mac: 'ESP32-S3-15' },
  { id: 'S-16', name: 'Node 16 (SE Reserve Zone)', lat: 23.6304, lng: 86.4281, panel: 'PANEL-B1', mac: 'ESP32-S3-16' },
];

export const SENSOR_TYPES = {
  IMU_TILT: { name: 'Dual-Axis IMU Tilt (MPU6050/BNO055)', unit: '° (Degrees)', normalMax: 1.5, watchMax: 3.5 },
  DISPLACEMENT: { name: 'Relative Wire/Optical Displacement', unit: 'mm', normalMax: 10, watchMax: 30 },
  CRACK_WIDTH: { name: 'LVDT Crack Gauge', unit: 'mm', normalMax: 1.0, watchMax: 2.5 },
  VIBRATION: { name: 'Piezo Vibration / Accel Peak', unit: 'g (m/s²)', normalMax: 0.25, watchMax: 0.6 },
  ENVIRONMENTAL: { tempUnit: '°C', humidityUnit: '%', pressUnit: 'hPa' }
};
