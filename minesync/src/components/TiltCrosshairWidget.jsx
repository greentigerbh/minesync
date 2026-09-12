import React from 'react';

export default function TiltCrosshairWidget({ tiltX = 0, tiltY = 0, maxTiltDeg = 5.0 }) {
  // Map tiltX and tiltY (-maxTiltDeg to +maxTiltDeg) to percentage (-40% to +40%)
  const posX = Math.max(-40, Math.min(40, (tiltX / maxTiltDeg) * 40));
  const posY = Math.max(-40, Math.min(40, (tiltY / maxTiltDeg) * 40));

  const tiltMag = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
  const color = tiltMag > 3.0 ? '#ef4444' : tiltMag > 1.8 ? '#f97316' : tiltMag > 0.8 ? '#eab308' : '#06b6d4';

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-950/80 rounded-xl border border-slate-800">
      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between w-full px-1">
        <span>Dual-Axis IMU Crosshair</span>
        <span className="font-mono text-cyan-400 font-bold">{tiltMag.toFixed(2)}°</span>
      </div>

      <div className="relative w-24 h-24 rounded-full border border-slate-700 bg-slate-900/90 flex items-center justify-center overflow-hidden">
        {/* Concentric Circle Guides */}
        <div className="absolute w-16 h-16 rounded-full border border-slate-800/80 pointer-events-none"></div>
        <div className="absolute w-8 h-8 rounded-full border border-slate-800/80 pointer-events-none"></div>

        {/* Axis Crosshair Lines */}
        <div className="absolute w-full h-px bg-slate-700/60"></div>
        <div className="absolute h-full w-px bg-slate-700/60"></div>

        {/* Center Target Point */}
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 z-10"></div>

        {/* Dynamic Deflection Dot & Vector Line */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg transition-all duration-300 z-20"
          style={{
            backgroundColor: color,
            transform: `translate(${posX}px, ${-posY}px)`,
            boxShadow: `0 0 12px ${color}`
          }}
        ></div>
      </div>

      <div className="flex justify-between w-full mt-1.5 px-1 font-mono text-[9px] text-slate-400">
        <span>X: <strong className="text-slate-200">{tiltX > 0 ? `+${tiltX}` : tiltX}°</strong></span>
        <span>Y: <strong className="text-slate-200">{tiltY > 0 ? `+${tiltY}` : tiltY}°</strong></span>
      </div>
    </div>
  );
}
