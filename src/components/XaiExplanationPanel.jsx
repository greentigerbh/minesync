import React from 'react';
import { 
  HelpCircle, BrainCircuit, CheckCircle2, Cpu
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

export default function XaiExplanationPanel({ riskAnalysis }) {
  if (!riskAnalysis) return null;

  const { xaiContributions, xaiNarrative, riskLevel, compositeRiskScore } = riskAnalysis;

  const radarData = xaiContributions.map(c => ({
    subject: c.name.split(' ').slice(-1)[0],  // Short label
    value: c.weight
  }));

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Explainable AI (XAI) Alert Rationale
          </h2>
        </div>
        <span className="text-[11px] text-purple-400 font-mono flex items-center space-x-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>"Why is this alert generated?"</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Feature Contribution Horizontal Bar Chart */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Feature Risk Contribution (%)
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={xaiContributions} margin={{ top:0, right:20, left:8, bottom:0 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#334155" tick={{ fontSize:9, fill:'#64748b' }} tickFormatter={v=>`${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#334155" width={138} tick={{ fontSize:9, fill:'#94a3b8' }} />
                <Tooltip
                  formatter={v=>[`${v}% Impact`,'Contribution']}
                  contentStyle={{ background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:11 }}
                />
                <Bar dataKey="weight" radius={[0,4,4,0]} maxBarSize={18}>
                  {xaiContributions.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-300 mb-1 uppercase tracking-wider">
            Multi-Parameter Risk Radar
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize:9, fill:'#64748b' }} />
                <Radar name="Risk" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Narrative */}
      <div className="bg-[#09111f] border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-[11px] text-cyan-300 uppercase tracking-wider">Automated Geotechnical AI Diagnostic</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          "{xaiNarrative}"
        </p>
        <div className="mt-2 flex justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
          <span className="flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 text-emerald-400"/><span>Multi-Modal Sensor Fusion</span></span>
          <span className="font-mono text-cyan-400">MINE SYNC-XAI v2.4</span>
        </div>
      </div>
    </div>
  );
}
