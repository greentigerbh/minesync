import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Sliders, 
  TrendingUp, 
  Flame, 
  Layers 
} from 'lucide-react';

export default function TimeSeriesCharts({ nodes, selectedNodeId }) {
  const [chartType, setChartType] = useState('TILT'); // TILT, DISPLACEMENT, CRACK, VIBRATION
  const [compareNodeId, setCompareNodeId] = useState('S-10');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const compareNode = nodes.find(n => n.id === compareNodeId) || nodes[1];

  // Merge history array of both nodes for recharts
  const historyPrimary = selectedNode ? selectedNode.history || [] : [];
  const historyCompare = compareNode ? compareNode.history || [] : [];

  const chartData = historyPrimary.map((pt, idx) => {
    const ptComp = historyCompare[idx] || {};
    return {
      step: pt.step,
      label: `T+${pt.step}s`,
      // Primary
      tiltPrimary: pt.tiltMag,
      dispPrimary: pt.displacement,
      crackPrimary: pt.crackWidth,
      vibPrimary: pt.vibrationG,
      // Compare
      tiltCompare: ptComp.tiltMag || 0,
      dispCompare: ptComp.displacement || 0,
      crackCompare: ptComp.crackWidth || 0,
      vibCompare: ptComp.vibrationG || 0
    };
  });

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Real-Time Temporal Telemetry & Multi-Node Comparison
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Compare Node Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
            <span className="text-slate-400 text-[10px] uppercase">Compare vs:</span>
            <select
              value={compareNodeId}
              onChange={(e) => setCompareNodeId(e.target.value)}
              className="bg-transparent text-cyan-400 font-mono font-bold outline-none cursor-pointer"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id} className="bg-slate-900 text-slate-100">
                  {n.id}
                </option>
              ))}
            </select>
          </div>

          {/* Parameter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'TILT', label: 'IMU Tilt (°)' },
              { id: 'DISPLACEMENT', label: 'Displacement (mm)' },
              { id: 'CRACK', label: 'Crack Width (mm)' },
              { id: 'VIBRATION', label: 'Vibration Peak (g)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setChartType(tab.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  chartType === tab.id
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />

            {chartType === 'TILT' && (
              <>
                <Line
                  type="monotone"
                  dataKey="tiltPrimary"
                  name={`${selectedNode.id} Tilt (°)`}
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tiltCompare"
                  name={`${compareNode.id} Tilt (°)`}
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}

            {chartType === 'DISPLACEMENT' && (
              <>
                <Line
                  type="monotone"
                  dataKey="dispPrimary"
                  name={`${selectedNode.id} Disp (mm)`}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="dispCompare"
                  name={`${compareNode.id} Disp (mm)`}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}

            {chartType === 'CRACK' && (
              <>
                <Line
                  type="monotone"
                  dataKey="crackPrimary"
                  name={`${selectedNode.id} Crack (mm)`}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="crackCompare"
                  name={`${compareNode.id} Crack (mm)`}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}

            {chartType === 'VIBRATION' && (
              <>
                <Line
                  type="monotone"
                  dataKey="vibPrimary"
                  name={`${selectedNode.id} Vib (g)`}
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="vibCompare"
                  name={`${compareNode.id} Vib (g)`}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
