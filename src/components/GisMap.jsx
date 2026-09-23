import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  Marker, 
  Popup, 
  Circle, 
  Tooltip 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  MINE_CENTER, 
  UNDERGROUND_PANELS, 
  CRITICAL_INFRASTRUCTURE 
} from '../engine/SensorNetwork';
import { 
  ShieldAlert, 
  Radio, 
  Activity, 
  Layers as LayersIcon, 
  Crosshair,
  Compass,
  ArrowUpRight
} from 'lucide-react';

// Custom SVG HTML divIcon generator for sensor nodes with directional tilt vector
function createSensorDivIcon(node, isSelected) {
  let color = '#10b981'; // Emerald normal
  let pulseClass = '';

  if (node.isOffline) {
    color = '#64748b'; // Slate offline
  } else if (node.status === 'HIGH_RISK') {
    color = '#ef4444'; // Red high risk
    pulseClass = 'animate-ping';
  } else if (node.status === 'ANOMALOUS') {
    color = '#f97316'; // Orange warning
    pulseClass = 'animate-pulse';
  } else if (node.status === 'WATCH') {
    color = '#eab308'; // Amber watch
  }

  const selectedBorder = isSelected ? 'ring-4 ring-cyan-400 shadow-2xl scale-125 z-50' : 'border-2 border-slate-900';

  // Calculate tilt angle rotation in degrees
  const tiltAngleDeg = (Math.atan2(node.tiltY || 0, node.tiltX || 0) * 180 / Math.PI) || 0;
  const tiltMag = Math.sqrt((node.tiltX || 0)**2 + (node.tiltY || 0)**2);

  const html = `
    <div class="relative group flex items-center justify-center cursor-pointer">
      ${node.status === 'HIGH_RISK' ? `<span class="absolute w-9 h-9 rounded-full bg-red-500/40 ${pulseClass}"></span>` : ''}
      <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow-xl ${selectedBorder} transition-all duration-300" style="background-color: ${color}">
        ${node.id.replace('S-', '')}
      </div>
      
      <!-- Directional Tilt Vector Indicator Arrow -->
      ${tiltMag > 0.5 ? `
        <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-slate-950 rounded-full border border-slate-700 flex items-center justify-center pointer-events-none" style="transform: rotate(${tiltAngleDeg}deg)">
          <div class="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-cyan-400"></div>
        </div>
      ` : ''}

      <div class="absolute -bottom-5 text-[9px] font-mono font-bold bg-slate-950/95 text-slate-200 px-1 py-0.5 rounded border border-slate-800 pointer-events-none whitespace-nowrap shadow-md">
        ${node.id}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sensor-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

export default function GisMap({
  nodes,
  riskAnalysis,
  selectedNodeId,
  onSelectNode
}) {
  const [layers, setLayers] = useState({
    panels: true,
    infrastructure: true,
    nodes: true,
    spatialLinks: true,
    hotspot: true
  });

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const hotspotCenter = riskAnalysis ? riskAnalysis.hotspotCenter : null;
  const hotspotRadius = riskAnalysis ? riskAnalysis.hotspotRadius : 0;
  const spatialLinks = riskAnalysis ? riskAnalysis.spatialLinks : [];

  return (
    <div className="relative w-full h-[min(68vw,540px)] min-h-[360px] max-h-[540px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Header Controls overlay */}
      <div className="absolute top-3 left-3 z-400 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs shadow-lg">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <span>GIS Surface & Underground Command Map</span>
        </div>
        <div className="h-3 w-px bg-slate-800 mx-1"></div>
        <span className="text-slate-400 text-[11px] font-mono">
          Jharia Coalfield Sector 4 | Lat 23.6330, Lng 86.4250
        </span>
      </div>

      {/* Layer Toggle Menu Button */}
      <div className="absolute top-3 right-3 z-400">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium flex items-center space-x-1.5 backdrop-blur-md shadow-lg"
        >
          <LayersIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Map Overlays</span>
        </button>

        {showLayerMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl p-2.5 space-y-2 text-xs backdrop-blur-md">
            <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1 text-[11px] uppercase tracking-wider">
              Layer Visibility
            </div>
            {Object.keys(layers).map((key) => (
              <label
                key={key}
                className="flex items-center space-x-2 text-slate-300 hover:text-white cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => setLayers(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Map Legend Footer overlay */}
      <div className="absolute bottom-3 left-3 z-400 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] space-y-1 text-slate-300 shadow-lg">
        <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Sensor Node Status Legend</div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Watch</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>Anomalous</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>High Risk</span>
          </span>
        </div>
      </div>

      {/* Actual Leaflet Map */}
      <MapContainer
        center={[MINE_CENTER.lat, MINE_CENTER.lng]}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Dark Satellite/Terrain Basemap Tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap & &copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* 1. Underground Coal Extraction Panels */}
        {layers.panels && UNDERGROUND_PANELS.map((panel) => (
          <Polygon
            key={panel.id}
            positions={panel.coordinates}
            pathOptions={{
              color: panel.color,
              fillColor: panel.color,
              fillOpacity: panel.status === 'ACTIVE_EXTRACTION' ? 0.28 : 0.12,
              weight: 2,
              dashArray: panel.status === 'PLANNED' ? '6, 6' : null
            }}
          >
            <Tooltip sticky className="custom-map-tooltip">
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-100">{panel.name}</div>
                <div className="text-[10px] text-slate-400">{panel.seam}</div>
                <div className="text-[10px] font-mono text-cyan-400">Status: {panel.status}</div>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* 2. Surface Critical Infrastructure Lines */}
        {layers.infrastructure && CRITICAL_INFRASTRUCTURE.map((infra) => {
          if (infra.coordinates && Array.isArray(infra.coordinates[0])) {
            return (
              <Polyline
                key={infra.id}
                positions={infra.coordinates}
                pathOptions={{
                  color: infra.color,
                  weight: infra.type === 'RAILWAY' ? 4 : 3,
                  dashArray: infra.type === 'PIPELINE' ? '8, 8' : null
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <div className="font-bold">{infra.name}</div>
                    <div className="text-[10px] text-slate-300">Type: {infra.type}</div>
                  </div>
                </Tooltip>
              </Polyline>
            );
          } else if (infra.coordinates && typeof infra.coordinates[0] === 'number') {
            return (
              <Circle
                key={infra.id}
                center={infra.coordinates}
                radius={12}
                pathOptions={{
                  color: infra.color,
                  fillColor: infra.color,
                  fillOpacity: 0.6,
                  weight: 2
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <div className="font-bold">{infra.name}</div>
                    <div className="text-[10px] text-slate-300">Critical Infrastructure Asset</div>
                  </div>
                </Tooltip>
              </Circle>
            );
          }
          return null;
        })}

        {/* 3. Multi-Node Spatial Correlation Link Lines */}
        {layers.spatialLinks && spatialLinks.map((link, idx) => (
          <Polyline
            key={`link-${idx}`}
            positions={[link.fromPos, link.toPos]}
            pathOptions={{
              color: '#a855f7', // purple correlation link
              weight: Math.max(2, Math.round(link.strength * 4)),
              opacity: 0.85,
              dashArray: '4, 4'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs font-mono">
                Spatial Coherence Link: {link.from} &harr; {link.to} ({(link.coherence * 100).toFixed(0)}%)
              </div>
            </Tooltip>
          </Polyline>
        ))}

        {/* 4. Active Hotspot Epicenter & Expanding Subsidence Radius */}
        {layers.hotspot && hotspotCenter && hotspotRadius > 0 && (
          <Circle
            center={[hotspotCenter.lat, hotspotCenter.lng]}
            radius={hotspotRadius}
            pathOptions={{
              color: riskAnalysis.riskLevel === 'HIGH_RISK_EMERGENCY' ? '#ef4444' : '#f97316',
              fillColor: riskAnalysis.riskLevel === 'HIGH_RISK_EMERGENCY' ? '#ef4444' : '#f97316',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '6, 6'
            }}
          >
            <Tooltip sticky>
              <div className="text-xs space-y-1">
                <div className="font-bold text-red-400">ACTIVE SUBSIDENCE HOTSPOT</div>
                <div className="text-[11px]">Radius: <span className="font-mono font-bold text-white">{hotspotRadius}m</span></div>
                <div className="text-[11px]">Affected Area: <span className="font-mono font-bold text-white">{riskAnalysis.affectedAreaSqM} m²</span></div>
                <div className="text-[11px]">Vector: <span className="font-mono font-bold text-cyan-400">{riskAnalysis.propagationVector.directionLabel} ({riskAnalysis.propagationVector.speedMmDay} mm/day)</span></div>
              </div>
            </Tooltip>
          </Circle>
        )}

        {/* 5. 16 ESP32 Sensor Nodes */}
        {layers.nodes && nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={createSensorDivIcon(node, node.id === selectedNodeId)}
            eventHandlers={{
              click: () => onSelectNode(node.id)
            }}
          >
            <Popup>
              <div className="text-xs space-y-1.5 min-w-[190px]">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="font-bold text-slate-100">{node.id}: {node.name}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${
                    node.status === 'HIGH_RISK' ? 'bg-red-900 text-red-200' :
                    node.status === 'ANOMALOUS' ? 'bg-orange-900 text-orange-200' :
                    node.status === 'WATCH' ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                  <div>Tilt: <strong className="text-cyan-400">{Math.sqrt(node.tiltX**2 + node.tiltY**2).toFixed(1)}°</strong></div>
                  <div>Disp: <strong className="text-amber-400">{node.displacement}mm</strong></div>
                  <div>Crack: <strong className="text-red-400">{node.crackWidth}mm</strong></div>
                  <div>Vib: <strong className="text-purple-400">{node.vibrationG}g</strong></div>
                </div>

                <button
                  onClick={() => onSelectNode(node.id)}
                  className="w-full mt-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-semibold flex items-center justify-center space-x-1"
                >
                  <span>Inspect Full Node Telemetry</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
