import React from 'react';
import { 
  X, 
  Radio, 
  Battery, 
  Wifi, 
  Sliders, 
  Activity, 
  Compass, 
  Maximize2, 
  CheckCircle2,
  HardHat
} from 'lucide-react';

export default function NodeInspectorModal({ node, onClose }) {
  if (!node) return null;

  const tiltMag = Math.sqrt(node.tiltX ** 2 + node.tiltY ** 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-mono font-extrabold text-cyan-400 text-base">
              {node.id}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-lg text-slate-100">{node.name}</h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                  node.status === 'HIGH_RISK' ? 'bg-red-950 text-red-300 border-red-800' :
                  node.status === 'ANOMALOUS' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                  node.status === 'WATCH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {node.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Hardware ID: {node.mac} | Assigned Zone: {node.panel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Parameter Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">IMU Tilt Vector</div>
            <div className="font-mono-num font-bold text-cyan-400 text-lg">{tiltMag.toFixed(2)}°</div>
            <div className="text-[10px] text-slate-500 font-mono">X: {node.tiltX}° | Y: {node.tiltY}°</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Displacement</div>
            <div className="font-mono-num font-bold text-amber-400 text-lg">{node.displacement} mm</div>
            <div className="text-[10px] text-slate-500 font-mono">Vel: {node.dispVelocity} mm/d</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Crack Gauge Width</div>
            <div className="font-mono-num font-bold text-red-400 text-lg">{node.crackWidth} mm</div>
            <div className="text-[10px] text-slate-500 font-mono">LVDT Sensor</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Seismic Vibration</div>
            <div className="font-mono-num font-bold text-purple-400 text-lg">{node.vibrationG} g</div>
            <div className="text-[10px] text-slate-500 font-mono">Piezo Peak</div>
          </div>
        </div>

        {/* Hardware Health & Connectivity */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>ESP32 Hardware Diagnostics</span>
            <span className="text-emerald-400 font-mono">LoRa RSSI: {node.rssiDbm} dBm</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Battery Level:</span>
              <span className="font-mono text-emerald-400 font-bold">{node.batteryV ? node.batteryV.toFixed(2) : '3.94'} V (94%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Latitude / Longitude:</span>
              <span className="font-mono">{node.lat.toFixed(4)}, {node.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">MCU Chipset:</span>
              <span className="font-mono">ESP32-S3 Dual-Core</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LoRa Transceiver:</span>
              <span className="font-mono">SX1262 (868/915 MHz)</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-xs transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
