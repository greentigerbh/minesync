import React, { useMemo } from 'react';
import { AlertTriangle, Battery, CheckCircle2, Gauge, Leaf, Radio, Users, Zap } from 'lucide-react';
import { GlassPanel } from './ui/GlassPanel';

const statusMeta = {
  NORMAL: { label: 'Normal', color: '#10b981', className: 'text-emerald-400' },
  WATCH: { label: 'Watch', color: '#facc15', className: 'text-yellow-400' },
  ANOMALOUS: { label: 'Warning', color: '#f97316', className: 'text-orange-400' },
  HIGH_RISK: { label: 'High Risk', color: '#ef4444', className: 'text-red-400' },
  OFFLINE: { label: 'Offline', color: '#93c5fd', className: 'text-blue-300' }
};

function KpiCard({ icon: Icon, label, value, detail, tone = 'cyan' }) {
  return (
    <GlassPanel className={`kpi-card kpi-${tone}`}>
      <div className="kpi-icon"><Icon className="w-5 h-5" /></div>
      <div className="min-w-0">
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{value}</p>
        <p className="kpi-detail">{detail}</p>
      </div>
    </GlassPanel>
  );
}

export default function CommandCenterOverview({ nodes, riskAnalysis, onSelectNode }) {
  const counts = useMemo(() => nodes.reduce((result, node) => {
    const status = node.isOffline ? 'OFFLINE' : node.status;
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {}), [nodes]);

  const atRisk = (counts.HIGH_RISK || 0) + (counts.ANOMALOUS || 0);
  const maxDisplacement = Math.max(...nodes.map(node => node.displacement || 0), 0);
  const avgBattery = nodes.reduce((sum, node) => sum + (node.batteryV || 0), 0) / Math.max(nodes.length, 1);
  const onlinePercent = Math.round(((nodes.length - (counts.OFFLINE || 0)) / Math.max(nodes.length, 1)) * 100);
  const statusSegments = ['NORMAL', 'WATCH', 'ANOMALOUS', 'HIGH_RISK', 'OFFLINE'].reduce((result, status) => {
    const start = result.end;
    result.end = start + ((counts[status] || 0) / Math.max(nodes.length, 1)) * 100;
    result.parts.push(`${statusMeta[status].color} ${start}% ${result.end}%`);
    return result;
  }, { end: 0, parts: [] });
  const alertNodes = nodes.filter(node => ['HIGH_RISK', 'ANOMALOUS', 'WATCH'].includes(node.status)).slice(0, 3);
  const recentNodes = [...alertNodes, ...nodes.filter(node => node.status === 'NORMAL')].slice(0, 4);

  return (
    <section className="space-y-3" aria-label="Command center overview">
      <div className="welcome-strip">
        <div>
          <p className="eyebrow">Mine Sync / Operations Console</p>
          <h2>Welcome to Mine Sync</h2>
          <p>Real-time monitoring <span>•</span> Predictive safety <span>•</span> Sustainable mining</p>
        </div>
        <div className="welcome-status"><span className="live-dot" /> All systems online <small>ESP32 | IoT | Edge AI</small></div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiCard icon={Users} label="Total Nodes" value={`${nodes.length} / ${nodes.length}`} detail={`${onlinePercent}% online`} tone="cyan" />
        <KpiCard icon={AlertTriangle} label="At Risk Nodes" value={atRisk} detail={`${counts.HIGH_RISK || 0} high risk`} tone="red" />
        <KpiCard icon={Gauge} label="Max Displacement" value={`${maxDisplacement.toFixed(1)} mm`} detail="Peak site reading" tone="yellow" />
        <KpiCard icon={Zap} label="Avg. Voltage" value={`${avgBattery.toFixed(2)} V`} detail="Within safe range" tone="green" />
        <KpiCard icon={Leaf} label="Air Quality (AQI)" value="44" detail="Good conditions" tone="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        <GlassPanel className="xl:col-span-8 command-panel overflow-hidden">
          <div className="command-panel-head"><div><h3><Radio className="w-4 h-4 text-cyan-400" /> Node Status Distribution</h3><p>Operational status across all sensor nodes</p></div><span className="panel-action">{nodes.length} nodes</span></div>
          <div className="status-summary">
            <div className="status-donut" style={{ background: `conic-gradient(${statusSegments.parts.join(', ')})` }}><strong>{nodes.length}</strong><span>Nodes</span></div>
            <div className="status-legend">{Object.keys(statusMeta).map(status => <button key={status} onClick={() => { const node = nodes.find(item => (item.isOffline ? 'OFFLINE' : item.status) === status); if (node) onSelectNode(node.id); }}><i style={{ background: statusMeta[status].color }} /><span>{statusMeta[status].label}</span><b>{counts[status] || 0}</b></button>)}</div>
          </div>
        </GlassPanel>

        <GlassPanel id="active-alerts" className="xl:col-span-4 command-panel alert-panel">
          <div className="command-panel-head"><div><h3><AlertTriangle className="w-4 h-4 text-red-400" /> Active Alerts</h3><p>Requires operator attention</p></div><span className="alert-count">{atRisk}</span></div>
          <div className="alert-list">{alertNodes.length ? alertNodes.map(node => <button key={node.id} onClick={() => onSelectNode(node.id)} className="alert-row"><span className={`alert-symbol ${node.status === 'HIGH_RISK' ? 'critical' : ''}`}><AlertTriangle className="w-3.5 h-3.5" /></span><span><b>{node.id} · {statusMeta[node.status]?.label}</b><small>{node.displacement?.toFixed(1)} mm displacement · {node.crackWidth?.toFixed(2)} mm crack</small></span></button>) : <div className="empty-alert"><CheckCircle2 className="w-4 h-4" /> No active alerts</div>}</div>
        </GlassPanel>
      </div>

      <GlassPanel className="command-panel recent-events">
        <div className="command-panel-head"><div><h3><Battery className="w-4 h-4 text-cyan-400" /> Recent Events</h3><p>Latest edge telemetry updates</p></div><span className="panel-action">Live feed</span></div>
        <div className="event-table"><div className="event-head"><span>Node</span><span>Event</span><span>Value</span><span>Status</span></div>{recentNodes.map(node => { const status = node.isOffline ? 'OFFLINE' : node.status; return <button key={node.id} onClick={() => onSelectNode(node.id)} className="event-row"><span><i style={{ background: statusMeta[status].color }} />{node.id}</span><span>{status === 'NORMAL' ? 'All parameters nominal' : `${statusMeta[status].label} detected`}</span><span>{node.displacement?.toFixed(1) || '—'} mm</span><span className={statusMeta[status].className}>{statusMeta[status].label}</span></button>; })}</div>
      </GlassPanel>
    </section>
  );
}
