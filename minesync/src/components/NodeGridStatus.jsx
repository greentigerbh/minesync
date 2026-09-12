import React, { useState } from 'react';
import { 
  Radio, 
  Battery, 
  Wifi, 
  Activity, 
  Sliders, 
  Filter
} from 'lucide-react';
import MiniSparkline from './MiniSparkline';

export default function NodeGridStatus({
  nodes,
  selectedNodeId,
  onSelectNode
}) {
  const [filter, setFilter] = useState('ALL');

  const filteredNodes = nodes.filter(node => {
    if (filter === 'ALL') return true;
    if (filter === 'OFFLINE') return node.isOffline;
    return node.status === filter;
  });

  const getStatusBadge = (node) => {
    if (node.isOffline) return { label: 'OFFLINE', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
    switch (node.status) {
      case 'HIGH_RISK': return { label: 'HIGH RISK', bg: 'bg-red-950 text-red-300 border-red-800 animate-pulse' };
      case 'ANOMALOUS': return { label: 'ANOMALOUS', bg: 'bg-orange-950 text-orange-300 border-orange-800' };
      case 'WATCH': return { label: 'WATCH', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'NORMAL': default: return { label: 'NORMAL', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            16-Node ESP32 Sensor Grid Matrix (Real-Time Sparkline Telemetry)
          </h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
          {['ALL', 'HIGH_RISK', 'ANOMALOUS', 'WATCH', 'NORMAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                filter === f
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 16 Node Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {filteredNodes.map((node) => {
          const badge = getStatusBadge(node);
          const isSelected = node.id === selectedNodeId;
          const tiltMag = Math.sqrt(node.tiltX ** 2 + node.tiltY ** 2);
          const historyData = node.history || [];

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 glass-panel-hover relative overflow-hidden ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg scale-[1.03]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-xs text-slate-100">{node.id}</span>
                <span className={`px-1 py-0.2 text-[8px] font-extrabold rounded border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              <div className="space-y-0.5 text-[10px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tilt:</span>
                  <span className="font-bold text-cyan-400">{tiltMag.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Disp:</span>
                  <span className="font-bold text-amber-400">{node.displacement}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crack:</span>
                  <span className="font-bold text-red-400">{node.crackWidth}mm</span>
                </div>
              </div>

              {/* Inline Telemetry Sparkline Graph */}
              <div className="my-1.5 flex justify-center border-t border-b border-slate-800/60 py-1 bg-slate-900/40 rounded">
                <MiniSparkline
                  data={historyData}
                  color={node.status === 'HIGH_RISK' ? '#ef4444' : node.status === 'ANOMALOUS' ? '#f97316' : '#06b6d4'}
                  height={20}
                  width={68}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span className="flex items-center space-x-0.5">
                  <Battery className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{node.batteryV ? node.batteryV.toFixed(2) : '3.9'}V</span>
                </span>
                <span className="flex items-center space-x-0.5">
                  <Wifi className="w-2.5 h-2.5 text-cyan-400" />
                  <span>{node.rssiDbm}dB</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
