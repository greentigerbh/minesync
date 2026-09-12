import React from 'react';

export default function MiniSparkline({ data = [], color = '#06b6d4', height = 24, width = 64 }) {
  if (!data || data.length < 2) {
    return (
      <div style={{ width, height }} className="flex items-center justify-center text-[8px] text-slate-600 font-mono">
        --
      </div>
    );
  }

  const values = data.map(d => (typeof d === 'number' ? d : d.displacement || d.tiltMag || 0));
  const min = Math.min(...values);
  const max = Math.max(...values, min + 0.1);

  // Map values to points string
  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
