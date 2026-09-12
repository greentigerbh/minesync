import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, X, AlertTriangle, ShieldAlert, Info, 
  CheckCircle2, Clock, Filter, Download, Trash2
} from 'lucide-react';

const MAX_HISTORY = 80;

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

function buildLogEntries(riskAnalysis, nodes, step) {
  const entries = [];
  if (!riskAnalysis) return entries;

  const t = formatTime();

  // Spatial correlation event
  if (riskAnalysis.spatialCorrelationScore > 15) {
    entries.push({
      id: `sc-${step}`, time: t, severity: 'SPATIAL',
      title: 'Multi-Node Spatial Coherence Detected',
      detail: `Coherence: ${riskAnalysis.spatialCorrelationScore}% · ${riskAnalysis.spatialLinks?.length ?? 0} correlation links active · Vector: ${riskAnalysis.propagationVector.directionLabel} @ ${riskAnalysis.propagationVector.speedMmDay} mm/day`
    });
  }

  // Per-node alerts
  nodes?.forEach(node => {
    if (!node.isOffline && node.status !== 'NORMAL') {
      const tilt = Math.sqrt(node.tiltX**2 + node.tiltY**2).toFixed(1);
      entries.push({
        id: `${node.id}-${step}`, time: t,
        severity: node.status === 'HIGH_RISK' ? 'CRITICAL' : node.status === 'ANOMALOUS' ? 'WARNING' : 'WATCH',
        title: `${node.id} — ${node.name}`,
        detail: `Tilt: ${tilt}° · Disp: ${node.displacement}mm · Crack: ${node.crackWidth}mm · Vib: ${node.vibrationG}g · Vel: ${node.dispVelocity}mm/d`
      });
    }
  });

  if (entries.length === 0) {
    entries.push({ id: `ok-${step}`, time: t, severity: 'OK', title: 'All 16 Nodes Nominal', detail: 'No active geotechnical anomalies detected across the monitoring area.' });
  }

  return entries;
}

const SEV = {
  CRITICAL: { label:'CRITICAL', bg:'bg-red-950', text:'text-red-300', border:'border-red-800', dot:'bg-red-500', icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" /> },
  WARNING:  { label:'WARNING',  bg:'bg-orange-950', text:'text-orange-300', border:'border-orange-800', dot:'bg-orange-500', icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" /> },
  WATCH:    { label:'WATCH',    bg:'bg-amber-950', text:'text-amber-300', border:'border-amber-800', dot:'bg-amber-400', icon: <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" /> },
  SPATIAL:  { label:'SPATIAL',  bg:'bg-purple-950', text:'text-purple-300', border:'border-purple-800', dot:'bg-purple-400', icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" /> },
  OK:       { label:'NOMINAL',  bg:'bg-emerald-950', text:'text-emerald-300', border:'border-emerald-900', dot:'bg-emerald-500', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> },
};

export default function AlertHistoryDrawer({ riskAnalysis, nodes, currentStep, open, onClose }) {
  const [history, setHistory] = useState([]);
  const [filterSev, setFilterSev] = useState('ALL');
  const bottomRef = useRef(null);

  useEffect(() => {
    const newEntries = buildLogEntries(riskAnalysis, nodes, currentStep);
    if (newEntries.length === 0) return;
    setHistory(prev => {
      const combined = [...newEntries.filter(e => !prev.some(p => p.id === e.id)), ...prev];
      return combined.slice(0, MAX_HISTORY);
    });
  }, [currentStep]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const filtered = filterSev === 'ALL' ? history : history.filter(e => e.severity === filterSev);

  const handleExportCSV = () => {
    const header = 'Time,Severity,Title,Detail\n';
    const rows = history.map(e => `"${e.time}","${e.severity}","${e.title}","${e.detail}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mine_sentinel_alerts.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col animate-slide-right shadow-2xl" style={{ background: '#080d18', borderLeft: '1px solid #1e2d3d' }}>
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800" style={{ background: '#0a1220' }}>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-slate-100 tracking-wide text-sm uppercase">Alert &amp; Event History</span>
          <span className="pill bg-slate-800 text-slate-300 border border-slate-700">{history.length} events</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleExportCSV} title="Export CSV" className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => setHistory([])} title="Clear Log" className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Severity filter tabs */}
      <div className="flex items-center space-x-1 px-3 py-2 border-b border-slate-800/80 bg-slate-950/50 overflow-x-auto">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
        {['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'SPATIAL', 'OK'].map(s => (
          <button
            key={s}
            onClick={() => setFilterSev(s)}
            className={`pill shrink-0 transition-all ${filterSev === s ? 'bg-cyan-700 text-white border-cyan-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-slate-500 text-xs py-12">No events match this filter.</div>
        )}
        {filtered.map((entry) => {
          const s = SEV[entry.severity] || SEV.OK;
          return (
            <div key={entry.id} className={`rounded-xl border p-3 ${s.bg} ${s.border} animate-slide-up`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {s.icon}
                  <span className={`font-bold text-xs ${s.text}`}>{entry.title}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  <span className={`pill ${s.bg} ${s.text} ${s.border}`}>{s.label}</span>
                  <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                </div>
              </div>
              <p className="mt-1.5 text-[10px] font-mono text-slate-300 leading-relaxed">{entry.detail}</p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
