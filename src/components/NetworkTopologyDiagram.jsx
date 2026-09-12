import React from 'react';

/**
 * NetworkTopologyDiagram — ESP32 → LoRa → RPi4 → Cloud data-flow diagram
 * Pure SVG, animated dashes show live data packets flowing
 */
export default function NetworkTopologyDiagram({ nodes, edgeStats }) {
  const onlineCount = nodes?.filter(n => !n.isOffline).length ?? 16;
  const offlineCount = (nodes?.length ?? 16) - onlineCount;
  const pdr = edgeStats?.packetDeliveryRatio ?? 99.4;
  const cloudSync = edgeStats?.cloudSyncStatus ?? 'ONLINE_SYNCED';

  const syncColor = cloudSync === 'ONLINE_SYNCED' ? '#10b981' : cloudSync === 'SYNCING' ? '#f59e0b' : '#ef4444';
  const syncLabel = cloudSync === 'ONLINE_SYNCED' ? 'Synced' : cloudSync === 'SYNCING' ? 'Syncing…' : 'Offline';

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 text-cyan-400">
            {/* simple network icon */}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10" cy="3" r="2"/><circle cx="3" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
              <line x1="10" y1="5" x2="3" y2="15"/><line x1="10" y1="5" x2="17" y2="15"/>
            </svg>
          </div>
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Mine Sync System Topology &amp; Data Flow
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Edge-First · Offline Resilient Architecture</span>
      </div>

      <svg
        viewBox="0 0 900 260"
        className="w-full h-auto"
        style={{ background: '#060911', borderRadius: '10px', border: '1px solid #1e2d3d' }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0f1a28" strokeWidth="0.5"/>
          </pattern>
          {/* Animated dash for data flow */}
          <marker id="arrow-cyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#06b6d4" opacity="0.8"/>
          </marker>
          <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#a855f7" opacity="0.8"/>
          </marker>
          <marker id="arrow-emerald" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#10b981" opacity="0.8"/>
          </marker>
        </defs>
        <rect width="900" height="260" fill="url(#grid)"/>

        {/* ── Layer Labels ── */}
        <text x="80" y="22" fill="#1e3a5f" fontSize="9" fontFamily="monospace" textAnchor="middle">FIELD LAYER</text>
        <text x="300" y="22" fill="#1e3a5f" fontSize="9" fontFamily="monospace" textAnchor="middle">WIRELESS NETWORK</text>
        <text x="520" y="22" fill="#1e3a5f" fontSize="9" fontFamily="monospace" textAnchor="middle">EDGE COMPUTING</text>
        <text x="730" y="22" fill="#1e3a5f" fontSize="9" fontFamily="monospace" textAnchor="middle">CLOUD / REMOTE</text>

        {/* ── Layer dividers ── */}
        <line x1="175" y1="30" x2="175" y2="250" stroke="#1e2d3d" strokeWidth="1" strokeDasharray="4,4"/>
        <line x1="400" y1="30" x2="400" y2="250" stroke="#1e2d3d" strokeWidth="1" strokeDasharray="4,4"/>
        <line x1="620" y1="30" x2="620" y2="250" stroke="#1e2d3d" strokeWidth="1" strokeDasharray="4,4"/>

        {/* ── ESP32 Sensor Nodes (sampled 8 of 16) ── */}
        {[45, 80, 115].map((y, idx) => {
          const nodeNum = idx + 1;
          const color = idx === 1 ? '#f97316' : '#06b6d4';
          return (
            <g key={idx}>
              <rect x="18" y={y - 12} width="120" height="24" rx="5" fill="#0a1525" stroke={color} strokeWidth="1.2"/>
              <text x="78" y={y + 4} fill={color} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ESP32-S3-0{nodeNum} LoRa
              </text>
              {idx === 1 && <text x="78" y={y + 4} fill="#f97316" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ESP32-S3-07 ⚠</text>}
            </g>
          );
        })}
        <text x="78" y="155" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">+13 more nodes…</text>
        <text x="78" y="168" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{onlineCount} Online / {offlineCount} Offline</text>

        {/* Sensors: IMU, crack, vib badge */}
        {[45, 80, 115].map((y, i) => (
          <g key={`s${i}`}>
            <rect x="148" y={y - 8} width="50" height="16" rx="3" fill="#0a1830" stroke="#1e3a5f" strokeWidth="0.8"/>
            <text x="173" y={y + 4} fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">IMU·Crack·Vib</text>
          </g>
        ))}

        {/* ── LoRa Gateway Antenna symbol ── */}
        <ellipse cx="250" cy="90" rx="30" ry="10" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3"/>
        <ellipse cx="250" cy="90" rx="20" ry="7" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="5,3" opacity="0.6"/>
        <ellipse cx="250" cy="90" rx="10" ry="4" fill="none" stroke="#a855f7" strokeWidth="0.8" opacity="0.4"/>
        <line x1="250" y1="100" x2="250" y2="170" stroke="#a855f7" strokeWidth="1.5"/>
        <rect x="215" y="170" width="70" height="30" rx="5" fill="#12082a" stroke="#a855f7" strokeWidth="1.2"/>
        <text x="250" y="189" fill="#a855f7" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LoRa Gateway</text>
        <text x="250" y="218" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">865-867 MHz IN865</text>
        <text x="250" y="228" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">SX1262 · PDR: {pdr}%</text>

        {/* ── RPi4 Edge Unit ── */}
        <rect x="430" y="55" width="130" height="150" rx="10" fill="#0a1a2e" stroke="#06b6d4" strokeWidth="1.5"/>
        {/* Icon circuit pattern */}
        <circle cx="495" cy="90" r="22" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.4"/>
        <circle cx="495" cy="90" r="14" fill="#06b6d4" opacity="0.15"/>
        <text x="495" y="95" fill="#06b6d4" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">RPi4</text>
        <text x="495" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">Raspberry Pi 4</text>
        <text x="495" y="142" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">4GB RAM · Ubuntu</text>

        {/* Components inside RPi4 */}
        {[['Mosquitto MQTT', '#10b981', 155], ['SQLite Buffer', '#f59e0b', 167], ['AI Engine', '#a855f7', 179]].map(([label, col, y]) => (
          <g key={label}>
            <rect x="438" y={y - 9} width="114" height="13" rx="3" fill="#06111e" stroke={col} strokeWidth="0.7" opacity="0.7"/>
            <text x="495" y={y + 1} fill={col} fontSize="7.5" fontFamily="monospace" textAnchor="middle">{label}</text>
          </g>
        ))}

        {/* ── Cloud / Remote Server ── */}
        {/* Cloud shape SVG */}
        <g transform="translate(660, 65)">
          <path d="M90 40 Q90 10 60 10 Q50 -10 20 10 Q-10 0 0 30 Q-15 55 20 55 L80 55 Q105 55 90 40Z"
            fill="#071422" stroke={syncColor} strokeWidth="1.5"/>
          <text x="45" y="35" fill={syncColor} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Remote Server</text>
          <text x="45" y="48" fill={syncColor} fontSize="8" fontFamily="monospace" textAnchor="middle">{syncLabel}</text>
        </g>
        <text x="750" y="150" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Cloud Dashboard</text>
        <text x="750" y="162" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Historical DB</text>
        <text x="750" y="174" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Alert API</text>

        {/* ── Data-Flow Arrows ── */}
        {/* ESP32 → LoRa */}
        {[45, 80, 115].map((y, i) => (
          <line key={`l${i}`} x1="148" y1={y} x2="218" y2="120" stroke="#a855f7" strokeWidth="1.5"
            strokeDasharray="6 4" opacity="0.7" markerEnd="url(#arrow-purple)">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite"/>
          </line>
        ))}

        {/* LoRa → RPi4 MQTT */}
        <line x1="285" y1="175" x2="428" y2="130" stroke="#06b6d4" strokeWidth="2"
          strokeDasharray="7 4" markerEnd="url(#arrow-cyan)">
          <animate attributeName="stroke-dashoffset" values="0;-22" dur="1.2s" repeatCount="indefinite"/>
        </line>
        <text x="356" y="140" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">MQTT pub/sub</text>

        {/* RPi4 → Cloud */}
        <line x1="560" y1="100" x2="658" y2="98" stroke={syncColor} strokeWidth="1.8"
          strokeDasharray="7 4" markerEnd="url(#arrow-emerald)">
          <animate attributeName="stroke-dashoffset" values="0;-22" dur="2s" repeatCount="indefinite"/>
        </line>
        <text x="608" y="90" fill={syncColor} fontSize="8" fontFamily="monospace" textAnchor="middle">HTTPS Sync</text>
        {cloudSync !== 'ONLINE_SYNCED' && (
          <text x="608" y="80" fill="#ef4444" fontSize="8" fontFamily="monospace" textAnchor="middle">⚠ Offline Buffer Active</text>
        )}

        {/* Offline buffer annotation */}
        <rect x="430" y="215" width="130" height="22" rx="4" fill="#0a1525" stroke="#f59e0b" strokeWidth="0.8"/>
        <text x="495" y="229" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">
          SQLite: {(edgeStats?.localSqliteBufferCount ?? 14280).toLocaleString()} records buffered
        </text>
      </svg>
    </div>
  );
}
