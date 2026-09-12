import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Clock,
  Terminal,
  Filter
} from 'lucide-react';

export default function EventLogTicker({ riskAnalysis, nodes }) {
  if (!riskAnalysis) return null;

  const anomalousNodes = nodes.filter(n => !n.isOffline && (n.status === 'HIGH_RISK' || n.status === 'ANOMALOUS' || n.status === 'WATCH'));

  const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  // Generate real-time log events
  const logs = [];

  if (anomalousNodes.length === 0) {
    logs.push({
      time: nowTime,
      type: 'INFO',
      nodeId: 'ALL',
      message: 'All 16 ESP32 LoRa sensor nodes operating within nominal geotechnical safety thresholds.'
    });
  } else {
    anomalousNodes.forEach(node => {
      logs.push({
        time: nowTime,
        type: node.status === 'HIGH_RISK' ? 'CRITICAL' : 'WARNING',
        nodeId: node.id,
        message: `Node ${node.id} (${node.name}): Tilt ${Math.sqrt(node.tiltX**2 + node.tiltY**2).toFixed(1)}°, Displacement ${node.displacement}mm, Crack Gauge ${node.crackWidth}mm.`
      });
    });

    if (riskAnalysis.spatialCorrelationScore > 15) {
      logs.push({
        time: nowTime,
        type: 'SPATIAL',
        nodeId: 'HOTSPOT',
        message: `MULTI-NODE SPATIAL CORRELATION DETECTED: Coherence ${riskAnalysis.spatialCorrelationScore}%, Propagation Vector ${riskAnalysis.propagationVector.directionLabel} (${riskAnalysis.propagationVector.speedMmDay} mm/day).`
      });
    }
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-lg">
      <div className="flex items-center space-x-2 shrink-0">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Real-Time Edge Telemetry Event Stream:
        </span>
      </div>

      <div className="flex-1 overflow-hidden w-full">
        <div className="flex items-center space-x-3 text-slate-300 font-mono text-[11px] truncate">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 shrink-0 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <span className="text-slate-500">[{log.time}]</span>
              <span className={`px-1 rounded text-[9px] font-bold uppercase ${
                log.type === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800' :
                log.type === 'WARNING' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                log.type === 'SPATIAL' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {log.type}
              </span>
              <span className="text-slate-200 font-medium">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
