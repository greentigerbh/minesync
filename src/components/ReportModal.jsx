import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Building2, 
  BrainCircuit, 
  Compass,
  HardHat
} from 'lucide-react';

export default function ReportModal({ riskAnalysis, nodes, onClose }) {
  if (!riskAnalysis) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    compositeRiskScore,
    riskLevel,
    confidenceScore,
    spatialCorrelationScore,
    hotspotRadius,
    affectedAreaSqM,
    propagationVector,
    xaiContributions,
    xaiNarrative,
    infraRisks,
    safetyRecommendations
  } = riskAnalysis;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full shadow-2xl space-y-6 my-8 print:bg-white print:text-black print:p-0 print:shadow-none print:border-none">
        {/* Printable Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-base text-slate-100 uppercase tracking-wider">
              Geotechnical Subsidence Incident & Early Warning Report
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-cyan-900/30 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Report Document Body */}
        <div className="space-y-5 text-xs text-slate-200 leading-relaxed font-sans">
          {/* Letterhead Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <div className="text-xl font-bold tracking-tight text-cyan-400 font-mono">MINE SYNC</div>
              <div className="text-[11px] font-semibold text-slate-300">Distributed AI Mine Subsidence Monitoring System</div>
              <div className="text-[10px] text-slate-400">Jharia Coalfield Sector 4 | Underground Panel A1 Operations</div>
            </div>
            <div className="text-right font-mono text-[11px]">
              <div>Report Ref: <strong className="text-slate-100">GEO-SUB-2026-0907</strong></div>
              <div>Generated: <span className="text-slate-300">{dateStr}</span></div>
              <div>Edge Gateway: <span className="text-emerald-400 font-bold">RPi4-EDGE-GATEWAY-01</span></div>
            </div>
          </div>

          {/* Risk Executive Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            riskLevel === 'HIGH_RISK_EMERGENCY' ? 'bg-red-950/80 border-red-800 text-red-100' :
            riskLevel === 'ANOMALOUS_WARNING' ? 'bg-orange-950/80 border-orange-800 text-orange-100' :
            riskLevel === 'WATCH' ? 'bg-amber-950/80 border-amber-800 text-amber-100' :
            'bg-emerald-950/80 border-emerald-800 text-emerald-100'
          }`}>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Site Geotechnical Status</div>
              <div className="text-lg font-black tracking-wide uppercase font-mono mt-0.5">
                {riskLevel.replace(/_/g, ' ')} (Score: {compositeRiskScore} / 100)
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400">AI Confidence Index</div>
              <div className="text-base font-bold text-cyan-300">{confidenceScore}%</div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Hotspot Evaluation */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>1. Executive Geotechnical Summary</span>
            </h3>
            <p className="text-slate-300">
              The Mine Sync 16-node distributed sensor network has evaluated the spatial-temporal stress deformation across active Longwall Panel A1 and Panel A2. Multi-parameter data fusion (combining IMU dual-axis tilt, LVDT crack expansion, wire displacement velocity, and piezo vibration) confirms a multi-node spatial correlation score of <strong className="text-purple-400 font-mono">{spatialCorrelationScore}%</strong>.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Hotspot Radius</div>
                <div className="font-mono text-sm font-bold text-slate-100">{hotspotRadius} meters</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Affected Surface Area</div>
                <div className="font-mono text-sm font-bold text-cyan-400">{affectedAreaSqM.toLocaleString()} m²</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Propagation Vector</div>
                <div className="font-mono text-sm font-bold text-amber-400">
                  {propagationVector.directionLabel} ({propagationVector.bearing}°) @ {propagationVector.speedMmDay} mm/d
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Explainable AI Rationale */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center space-x-1.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>2. Explainable AI Diagnostic Rationale</span>
            </h3>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
              "{xaiNarrative}"
            </div>
          </div>

          {/* Section 3: Surface Infrastructure Impact Assessment */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>3. Surface Infrastructure Proximity Assessment</span>
            </h3>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <th className="p-2">Asset Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Criticality</th>
                    <th className="p-2">Buffer Distance</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {infraRisks.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-950/50">
                      <td className="p-2 font-bold font-sans">{asset.name}</td>
                      <td className="p-2">{asset.type}</td>
                      <td className="p-2 text-amber-400">{asset.criticality}</td>
                      <td className="p-2 font-bold">{asset.distanceToHotspotMeters} m</td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          asset.alertStatus === 'CRITICAL_PROXIMITY' ? 'bg-red-900 text-red-100' :
                          asset.alertStatus === 'WARNING_BUFFER' ? 'bg-orange-900 text-orange-100' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {asset.alertStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Recommended Safety Actions & Manager Sign-off */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-sm text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
              <HardHat className="w-4 h-4 text-cyan-400" />
              <span>4. Action Items & Sign-Off Authorization</span>
            </h3>

            <ul className="list-disc list-inside space-y-1 text-slate-300 font-medium">
              {safetyRecommendations.map((r, idx) => (
                <li key={idx}>[{r.priority}] {r.action}</li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800 font-mono text-[11px]">
              <div>
                <div className="border-b border-slate-700 pb-8 text-slate-500">// Signature</div>
                <div className="pt-1 font-bold text-slate-200">Chief Geotechnical Officer</div>
                <div className="text-[10px] text-slate-400">Mine Safety & Operations Division</div>
              </div>
              <div>
                <div className="border-b border-slate-700 pb-8 text-slate-500">// Signature</div>
                <div className="pt-1 font-bold text-slate-200">Mine General Manager</div>
                <div className="text-[10px] text-slate-400">Jharia Underground Operations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
