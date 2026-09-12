import React from 'react';
import { 
  Building2, 
  Train, 
  Zap, 
  Milestone, 
  Pipette, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  HardHat, 
  Wrench,
  Radio
} from 'lucide-react';

export default function InfrastructureRiskCard({ riskAnalysis }) {
  if (!riskAnalysis) return null;

  const { infraRisks, safetyRecommendations, riskLevel } = riskAnalysis;

  const getAssetIcon = (type) => {
    switch (type) {
      case 'RAILWAY': return <Train className="w-4 h-4 text-amber-400" />;
      case 'PIPELINE': return <Pipette className="w-4 h-4 text-cyan-400" />;
      case 'ROAD': return <Milestone className="w-4 h-4 text-purple-400" />;
      case 'POWER_TOWER': return <Zap className="w-4 h-4 text-orange-400" />;
      case 'BUILDING': return <Building2 className="w-4 h-4 text-slate-400" />;
      default: return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionIcon = (iconName) => {
    switch (iconName) {
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-orange-400" />;
      case 'HardHat': return <HardHat className="w-4 h-4 text-cyan-400" />;
      case 'Radio': return <Radio className="w-4 h-4 text-purple-400" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-amber-400" />;
      default: return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Surface Infrastructure Risk Mapping & Safety Recommendations
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Proximity Buffer Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Infrastructure Asset Proximity Matrix */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Critical Infrastructure Asset Buffer Status
          </div>

          <div className="space-y-2">
            {infraRisks.map((asset) => (
              <div
                key={asset.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  asset.alertStatus === 'CRITICAL_PROXIMITY'
                    ? 'bg-red-950/60 border-red-800 text-red-200'
                    : asset.alertStatus === 'WARNING_BUFFER'
                    ? 'bg-orange-950/50 border-orange-800 text-orange-200'
                    : asset.alertStatus === 'MONITORING'
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-100">{asset.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Criticality: <strong className="text-slate-300">{asset.criticality}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-slate-100">
                    {asset.distanceToHotspotMeters} m
                  </div>
                  <div className="text-[10px] uppercase font-semibold">
                    {asset.alertStatus.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actionable Geotechnical Safety Protocols */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Recommended Operator Safety Actions</span>
            <span className="text-[10px] font-mono text-cyan-400">Mine SOP Guidelines</span>
          </div>

          <div className="space-y-2">
            {safetyRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-start space-x-3 text-xs"
              >
                <div className="shrink-0 mt-0.5">
                  {getActionIcon(rec.icon)}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      rec.priority === 'IMMEDIATE' ? 'bg-red-900 text-red-100' :
                      rec.priority === 'URGENT' ? 'bg-orange-900 text-orange-100' :
                      rec.priority === 'HIGH' ? 'bg-amber-900 text-amber-100' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {rec.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
