import React from 'react';
import { 
  ShieldAlert, 
  Target, 
  Maximize2, 
  Navigation, 
  Compass, 
  TrendingUp, 
  CheckCircle2, 
  AlertOctagon, 
  Flame,
  Layers
} from 'lucide-react';
import TiltCrosshairWidget from './TiltCrosshairWidget';

export default function RiskOverviewPanel({ riskAnalysis, selectedNode }) {
  if (!riskAnalysis) return null;

  const {
    compositeRiskScore,
    confidenceScore,
    spatialCorrelationScore,
    riskLevel,
    riskColor,
    hotspotRadius,
    affectedAreaSqM,
    propagationVector,
    maxTilt,
    maxDisp,
    maxCrack,
    maxVib,
    avgVel
  } = riskAnalysis;

  // Percentage offset for semi-circle / circular SVG progress indicator
  const strokeDashoffset = 283 - (283 * compositeRiskScore) / 100;

  const activeTiltX = selectedNode ? selectedNode.tiltX : 0;
  const activeTiltY = selectedNode ? selectedNode.tiltY : 0;

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Site Risk & Hotspot Overview
          </h2>
        </div>
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
          riskLevel === 'HIGH_RISK_EMERGENCY' ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' :
          riskLevel === 'ANOMALOUS_WARNING' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
          riskLevel === 'WATCH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
          'bg-emerald-950 text-emerald-300 border border-emerald-800'
        }`}>
          {riskLevel.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Main Grid: Radial Gauge + Spatial Stats + IMU Crosshair */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Radial Composite Risk Score Gauge */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-800 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={riskColor}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono-num text-slate-100 tracking-tight">
                {compositeRiskScore}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">
                Risk Score
              </span>
            </div>
          </div>
          <div className="mt-1 text-center text-[11px]">
            <div className="text-slate-400 font-medium">Composite Risk Score</div>
            <div className="text-[10px] text-cyan-400 font-mono">0 (Nominal) &rarr; 100 (Emergency)</div>
          </div>
        </div>

        {/* AI Confidence & Spatial Correlation Stats */}
        <div className="space-y-2.5">
          {/* AI Confidence Rating */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Confidence Rating</span>
              </span>
              <span className="font-mono-num font-bold text-cyan-400">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-500"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Spatial Coherence Score */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Multi-Node Spatial Coherence</span>
              </span>
              <span className="font-mono-num font-bold text-purple-400">{spatialCorrelationScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${spatialCorrelationScore}%` }}
              ></div>
            </div>
          </div>

          {/* Hotspot Expansion Velocity */}
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Hotspot Vector:</span>
            </span>
            <span className="font-mono-num font-bold text-amber-400 text-[11px]">
              {propagationVector.directionLabel} ({propagationVector.bearing}°) @ {propagationVector.speedMmDay} mm/d
            </span>
          </div>
        </div>

        {/* Real-Time 2D IMU Tilt Target Crosshair Widget */}
        <TiltCrosshairWidget tiltX={activeTiltX} tiltY={activeTiltY} />
      </div>

      {/* Maximum Telemetry Parameter Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Tilt Gradient</div>
          <div className="font-mono-num font-bold text-cyan-400 text-sm mt-0.5">{maxTilt.toFixed(1)}°</div>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Displacement</div>
          <div className="font-mono-num font-bold text-amber-400 text-sm mt-0.5">{maxDisp.toFixed(1)} mm</div>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Crack Gauge</div>
          <div className="font-mono-num font-bold text-red-400 text-sm mt-0.5">{maxCrack.toFixed(2)} mm</div>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Subsidence Velocity</div>
          <div className="font-mono-num font-bold text-purple-400 text-sm mt-0.5">{avgVel.toFixed(1)} mm/day</div>
        </div>
      </div>

      {/* Hotspot footprint summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-slate-800/80 pt-3">
        <div className="sm:col-span-1 bg-orange-950/25 p-2.5 rounded-lg border border-orange-900/60">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] text-orange-200/70 uppercase font-semibold">Hotspot Status</div>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className={`font-bold text-sm ${hotspotRadius > 0 ? 'text-orange-300' : 'text-emerald-300'}`}>
            {hotspotRadius > 0 ? 'Active footprint' : 'No active hotspot'}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Hotspot Radius</div>
          <div className="font-mono-num font-bold text-orange-300 text-sm mt-0.5">
            {hotspotRadius > 0 ? `${hotspotRadius} m` : '—'}
          </div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Affected Area</div>
          <div className="font-mono-num font-bold text-cyan-300 text-sm mt-0.5">
            {affectedAreaSqM > 0 ? `${affectedAreaSqM.toLocaleString()} m²` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
