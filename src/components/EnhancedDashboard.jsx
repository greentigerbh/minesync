import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Sector, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, RadialBarChart, RadialBar
} from 'recharts';
import {
  Activity, TrendingUp, AlertTriangle, CheckCircle, AlertCircle,
  Layers, Target, ShieldAlert, Zap, Gauge, Thermometer,
  TriangleAlert, Radio, Battery, Wifi, Sliders, Filter, Maximize2
} from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';

const RISK_COLORS = {
  HIGH_RISK_EMERGENCY: '#ef4444',
  ANOMALOUS_WARNING: '#f97316',
  WATCH: '#f59e0b',
  NORMAL: '#10b981'
};

const STATUS_COLORS = {
  HIGH_RISK: '#ef4444',
  ANOMALOUS: '#f97316',
  WATCH: '#f59e0b',
  NORMAL: '#10b981',
  OFFLINE: '#64748b'
};

export default function EnhancedDashboard({ nodes, riskAnalysis, selectedNodeId, onSelectNode }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusCounts = useMemo(() => {
    const counts = { HIGH_RISK: 0, ANOMALOUS: 0, WATCH: 0, NORMAL: 0, OFFLINE: 0 };
    nodes.forEach(n => {
      if (n.isOffline) counts.OFFLINE++;
      else counts[n.status]++;
    });
    return counts;
  }, [nodes]);

  const riskLevelCounts = useMemo(() => {
    if (!riskAnalysis?.nodeRiskBreakdown) return {};
    const counts = {};
    Object.entries(riskAnalysis.nodeRiskBreakdown).forEach(([nodeId, data]) => {
      counts[data.level] = (counts[data.level] || 0) + 1;
    });
    return counts;
  }, [riskAnalysis]);

  const criticalNodes = useMemo(() => 
    nodes.filter(n => n.status === 'HIGH_RISK' || n.status === 'ANOMALOUS').length, [nodes]);

  const totalDisplacement = useMemo(() => 
    nodes.reduce((sum, n) => sum + (n.displacement || 0), 0).toFixed(1), [nodes]);

  const avgBattery = useMemo(() => 
    (nodes.reduce((sum, n) => sum + (n.batteryV || 3.9), 0) / nodes.length).toFixed(2), [nodes]);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const riskPieData = Object.entries(riskLevelCounts).map(([name, value]) => ({ name, value }));

  const COLORS_PIE = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#64748b'];
  const RISK_PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-4">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <GlassPanel className="p-4 border-cyan-500/30 bg-cyan-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active Nodes</p>
              <p className="text-2xl font-black font-mono text-cyan-400">{nodes.length - statusCounts.OFFLINE} / {nodes.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-medium">{nodes.length - statusCounts.OFFLINE} Online</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 mx-1"></span>
            <span className="text-slate-500">{statusCounts.OFFLINE} Offline</span>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 border-red-500/30 bg-red-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Critical Alerts</p>
              <p className="text-2xl font-black font-mono text-red-400">{criticalNodes}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-400 font-medium">{statusCounts.HIGH_RISK} Emergency</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 mx-1"></span>
            <span className="text-orange-400 font-medium">{statusCounts.ANOMALOUS} Warning</span>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Max Displacement</p>
              <p className="text-2xl font-black font-mono text-amber-400">{totalDisplacement} mm</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Cumulative across all nodes</div>
        </GlassPanel>

        <GlassPanel className="p-4 border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Battery</p>
              <p className="text-2xl font-black font-mono text-emerald-400">{avgBattery} V</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Battery className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">ESP32-S3 Li-ion health</div>
        </GlassPanel>

        <GlassPanel className="p-4 border-purple-500/30 bg-purple-950/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Composite Risk</p>
              <p className="text-2xl font-black font-mono text-purple-400">{riskAnalysis?.compositeRiskScore || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">AI Confidence: {riskAnalysis?.confidenceScore || 0}%</div>
        </GlassPanel>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Node Status Distribution - Pie Chart */}
        <GlassPanel className="lg:col-span-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Node Status Distribution</span>
            </h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name.replace('_', ' ')} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value, name) => [`${value} nodes`, name.replace('_', ' ')]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={name => name.replace('_', ' ')}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Risk Level Breakdown - Radial Bars */}
        <GlassPanel className="lg:col-span-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span>Risk Level Breakdown</span>
            </h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart>
                <RadialBar
                  data={[
                    { name: 'Emergency', value: riskLevelCounts.HIGH_RISK_EMERGENCY || 0 },
                    { name: 'Warning', value: riskLevelCounts.ANOMALOUS_WARNING || 0 },
                    { name: 'Watch', value: riskLevelCounts.WATCH || 0 },
                    { name: 'Normal', value: riskLevelCounts.NORMAL || 0 }
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  minAngle={-90}
                  maxAngle={90}
                >
                  {[
                    { name: 'Emergency', color: '#ef4444', radius: '70%' },
                    { name: 'Warning', color: '#f97316', radius: '55%' },
                    { name: 'Watch', color: '#f59e0b', radius: '40%' },
                    { name: 'Normal', color: '#10b981', radius: '25%' }
                  ].filter((_, i) => Object.values(riskLevelCounts).filter(v => v > 0)[i]).map((item, index) => (
                    <RadialBar
                      key={item.name}
                      dataKey={item.name}
                      radius={item.radius}
                      background={{ fill: '#1e293b' }}
                      clockwise={false}
                      startAngle={-90}
                      endAngle={90}
                    />
                  ))}
                </RadialBar>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              { key: 'HIGH_RISK_EMERGENCY', label: 'Emergency', color: '#ef4444' },
              { key: 'ANOMALOUS_WARNING', label: 'Warning', color: '#f97316' },
              { key: 'WATCH', label: 'Watch', color: '#f59e0b' },
              { key: 'NORMAL', label: 'Normal', color: '#10b981' }
            ].map(item => (
              <div key={item.key} className="p-2 rounded-lg bg-slate-900/50">
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                <div className="text-[10px] text-slate-400 uppercase">{item.label}</div>
                <div className="font-mono font-bold text-cyan-400">{riskLevelCounts[item.key] || 0}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Telemetry Ratios - Horizontal Bar Chart */}
        <GlassPanel className="lg:col-span-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Telemetry Ratios</span>
            </h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Tilt (°)', value: Math.max(...nodes.map(n => Math.sqrt(n.tiltX**2 + n.tiltY**2))), max: 15 },
                  { name: 'Displacement (mm)', value: Math.max(...nodes.map(n => n.displacement || 0)), max: 50 },
                  { name: 'Crack Width (mm)', value: Math.max(...nodes.map(n => n.crackWidth || 0)), max: 10 },
                  { name: 'Vibration (g)', value: Math.max(...nodes.map(n => n.vibrationG || 0)) * 100, max: 100 },
                  { name: 'Velocity (mm/d)', value: Math.max(...nodes.map(n => n.velocityMmDay || 0)), max: 20 }
                ]}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#64748b" axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#64748b" axisLine={false} width={100} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value, name) => [`${name === 'Vibration (g)' ? (value/100).toFixed(3) : value.toFixed(1)}`, name]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {[
                    { name: 'Tilt (°)', color: '#06b6d4' },
                    { name: 'Displacement (mm)', color: '#f59e0b' },
                    { name: 'Crack Width (mm)', color: '#ef4444' },
                    { name: 'Vibration (g)', color: '#ec4899' },
                    { name: 'Velocity (mm/d)', color: '#a855f7' }
                  ].map(item => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      {/* Node Health Matrix */}
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Node Health Matrix</span>
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1.5 text-[11px] font-semibold bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1"
          >
            <Maximize2 className={`w-3.5 h-3.5 ${showDetails ? 'rotate-180' : ''} text-cyan-400`} />
            <span>{showDetails ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>

        <div className={`grid grid-cols-4 lg:grid-cols-8 gap-2 transition-all duration-300 ${showDetails ? '' : 'max-h-24 overflow-hidden'}`}>
          {nodes.map(node => {
            const tiltMag = Math.sqrt(node.tiltX ** 2 + node.tiltY ** 2);
            const isSelected = node.id === selectedNodeId;
            const status = node.isOffline ? 'OFFLINE' : node.status;

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-500 ring-2 ring-cyan-500/50 shadow-lg scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:scale-[1.01]'
                }`}
                style={{ borderLeft: `4px solid ${STATUS_COLORS[status]}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-slate-100">{node.id}</span>
                  <span className={`px-1.5 py-0.3 text-[9px] font-extrabold rounded border ${
                    status === 'HIGH_RISK' ? 'bg-red-950 text-red-300 border-red-800 animate-pulse' :
                    status === 'ANOMALOUS' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                    status === 'WATCH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    status === 'NORMAL' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-[10px] font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tilt:</span>
                    <span className="font-bold text-cyan-400">{tiltMag.toFixed(1)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disp:</span>
                    <span className="font-bold text-amber-400">{node.displacement?.toFixed(1) || 0}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crack:</span>
                    <span className="font-bold text-red-400">{node.crackWidth?.toFixed(2) || 0}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vib:</span>
                    <span className="font-bold text-pink-400">{(node.vibrationG || 0).toFixed(3)}g</span>
                  </div>
                </div>

                <div className="pt-2 mt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-slate-800/50">
                  <span className="flex items-center space-x-1">
                    <Battery className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{node.batteryV?.toFixed(2) || 3.90}V</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Wifi className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{node.rssiDbm || -75}dB</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Activity className="w-2.5 h-2.5 text-purple-400" />
                    <span>{(node.pdrPercent || 99).toFixed(1)}%</span>
                  </span>
                </div>

                {/* Mini trend indicator */}
                <div className="absolute bottom-2 right-2 w-16 h-6 opacity-60">
                  <svg viewBox="0 0 64 24" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke={STATUS_COLORS[status]}
                      strokeWidth="1.5"
                      points={node.history?.slice(-8).map((pt, i) => 
                        `${(i / 7) * 64},${24 - (pt.tiltMag || 0) * 3}`
                      ).join(' ') || '0,24 64,24'}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}