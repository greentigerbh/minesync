import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Radio, Cpu, Clock, FileText, 
  AlertTriangle, CheckCircle, Wifi, Activity,
  TrendingUp, Zap, Database
} from 'lucide-react';

export default function Header({ 
  riskAnalysis, 
  activeScenario, 
  edgeStats, 
  onOpenReportModal,
  nodesCount 
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' }));
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const score = riskAnalysis?.compositeRiskScore ?? 0;
  const riskLevel = riskAnalysis?.riskLevel ?? 'NORMAL';
  const confidence = riskAnalysis?.confidenceScore ?? 0;

  const riskCfg = {
    HIGH_RISK_EMERGENCY: { label: 'EMERGENCY', textColor: 'text-red-300', bg: 'bg-red-950/80', border: 'border-red-700', glow: 'animate-glow-emergency', icon: <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" /> },
    ANOMALOUS_WARNING:   { label: 'WARNING',   textColor: 'text-orange-300', bg: 'bg-orange-950/80', border: 'border-orange-700', glow: '', icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
    WATCH:               { label: 'WATCH',     textColor: 'text-amber-300', bg: 'bg-amber-950/70', border: 'border-amber-700', glow: '', icon: <Activity className="w-4 h-4 text-amber-400" /> },
    NORMAL:              { label: 'NOMINAL',   textColor: 'text-emerald-300', bg: 'bg-emerald-950/70', border: 'border-emerald-800', glow: '', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
  };
  const cfg = riskCfg[riskLevel] || riskCfg.NORMAL;

  return (
    <header className="sticky top-0 z-30">
      {/* ── Positioning banner ── */}
      <div className="bg-gradient-to-r from-[#06080f] via-[#0a1628] to-[#06080f] border-b border-cyan-900/40 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse inline-block shrink-0" />
          <span>
            <strong className="text-cyan-400">Mine Sync Positioning:</strong>{' '}
            Continuous low-cost distributed sensing &amp; edge AI early-warning layer — supplementing GNSS, InSAR &amp; periodic mine surveying.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 shrink-0">
          <span className="flex items-center space-x-1.5 text-emerald-400 font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            16 ESP32 Nodes Live
          </span>
          <span className="flex items-center space-x-1.5 text-cyan-400">
            <Cpu className="w-3 h-3" />
            RPi4 Edge — Offline Resilient
          </span>
        </div>
      </div>

      {/* ── Main header bar ── */}
      <div
        className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 hud-scanline relative"
        style={{ background: 'linear-gradient(to bottom, #0a1220, #07101a)' }}
      >
        {/* Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-px shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#060c18] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060c18] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-cyan-100">
                MINE SYNC
              </h1>
              <span className="pill bg-slate-900 text-slate-400 border border-slate-700">v2.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Real-Time Mine Subsidence · Multi-Node Spatial-Temporal AI · Early Warning System
            </p>
          </div>
        </div>

        {/* Status strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk score card */}
          <div className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border} ${cfg.glow}`}>
            {cfg.icon}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Site Risk</div>
              <div className="flex items-baseline space-x-1.5">
                <span className={`font-mono-num text-xl font-black ${cfg.textColor}`}>{score}</span>
                <span className="text-[10px] text-slate-400">/ 100 · {cfg.label}</span>
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl border bg-[#0d1526]/80 border-slate-800">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-500">AI Confidence</div>
              <div className="font-mono-num font-bold text-purple-300">{confidence}%</div>
            </div>
          </div>

          {/* LoRa / MQTT status */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl border bg-[#0d1526]/80 border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-500">MQTT/LoRa Edge</div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-400 text-[11px]">Mosquitto · Connected</span>
              </div>
            </div>
          </div>

          {/* Clock */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl border bg-[#0d1526]/80 border-slate-800">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-500">{dateStr}</div>
              <div className="font-mono-num font-bold text-slate-200 tracking-widest text-sm">{timeStr}</div>
            </div>
          </div>

          {/* Report button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/40 border border-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Geotechnical Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
