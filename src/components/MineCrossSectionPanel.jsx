import React from 'react';

/**
 * MinerossCrossSection — 3D-style underground mine cross-section visualization
 * Pure SVG — no external deps
 */
export default function MineCrossSectionPanel({ riskAnalysis, nodes }) {
  const score = riskAnalysis?.compositeRiskScore ?? 0;
  const riskLevel = riskAnalysis?.riskLevel ?? 'NORMAL';
  const hotspotR = riskAnalysis?.hotspotRadius ?? 0;

  // Subsidence bowl deflection based on risk
  const subsidenceDepth = Math.min(30, (score / 100) * 30);
  const crackVisible = score > 35;
  const pillarDistress = score > 55;
  const goafCracked = score > 70;

  const subsColor = riskLevel === 'HIGH_RISK_EMERGENCY' ? '#ef4444' : riskLevel === 'ANOMALOUS_WARNING' ? '#f97316' : riskLevel === 'WATCH' ? '#eab308' : '#10b981';

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-[10px]">↕</div>
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Underground Mine Cross-Section View (Indicative)
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>Seam Depth ≈ 280m</span>
          <span className="text-slate-600">·</span>
          <span>Subsidence Basin Amplitude: <strong className={score > 50 ? 'text-red-400' : 'text-cyan-400'}>{subsidenceDepth.toFixed(0)}mm</strong></span>
        </div>
      </div>

      <svg viewBox="0 0 860 300" className="w-full h-auto rounded-lg border border-slate-800" style={{ background: '#060a12' }}>
        <defs>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c3d1e" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0a1a0c" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2030"/>
            <stop offset="100%" stopColor="#0d1520"/>
          </linearGradient>
          <linearGradient id="coalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1a22"/>
            <stop offset="40%" stopColor="#252530"/>
            <stop offset="60%" stopColor="#1a1a22"/>
            <stop offset="100%" stopColor="#252530"/>
          </linearGradient>
          <radialGradient id="subsidenceBowl" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor={subsColor} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={subsColor} stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* ── Sky / Surface ── */}
        <rect x="0" y="0" width="860" height="60" fill="#06080f"/>

        {/* Surface infrastructure icons */}
        {/* Rail line */}
        <line x1="50" y1="55" x2="810" y2="55" stroke="#6b5a10" strokeWidth="3"/>
        <line x1="50" y1="52" x2="810" y2="52" stroke="#4a4030" strokeWidth="1"/>
        {[100,200,320,440,560,680].map(x => <line key={x} x1={x} y1="50" x2={x+20} y2="56" stroke="#8b7340" strokeWidth="1.5"/>)}
        <text x="430" y="47" fill="#d4a617" fontSize="8" fontFamily="monospace" textAnchor="middle">Railway Line</text>

        {/* Pipeline */}
        <rect x="50" y="40" width="760" height="6" rx="3" fill="none" stroke="#0e6b7a" strokeWidth="1.5" strokeDasharray="12,6"/>
        <text x="430" y="35" fill="#0e9aad" fontSize="8" fontFamily="monospace" textAnchor="middle">Gas / Water Pipeline</text>

        {/* Buildings */}
        <rect x="30" y="22" width="30" height="28" rx="2" fill="#1a2535" stroke="#2d3f55" strokeWidth="1"/>
        <rect x="800" y="22" width="40" height="28" rx="2" fill="#1a2535" stroke="#2d3f55" strokeWidth="1"/>
        <text x="45" y="17" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">Pithead</text>
        <text x="820" y="17" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">Admin</text>

        {/* Ground surface (with subsidence deformation) */}
        {(() => {
          const bowlCenter = 430;
          const bowlWidth = 200 + hotspotR * 0.5;
          const pts = [];
          for (let x = 50; x <= 810; x += 10) {
            const dx = x - bowlCenter;
            const bowl = subsidenceDepth * Math.exp(-0.5 * (dx / bowlWidth) ** 2);
            pts.push(`${x},${60 + bowl}`);
          }
          return (
            <polyline
              points={pts.join(' ')}
              fill="none"
              stroke={score > 25 ? subsColor : '#1c3d1e'}
              strokeWidth="2.5"
            />
          );
        })()}

        {/* Subsidence bowl fill */}
        {score > 10 && (
          <ellipse cx="430" cy="60" rx={Math.min(200, 80 + score * 1.5)} ry={subsidenceDepth * 0.8 + 4}
            fill="url(#subsidenceBowl)" opacity="0.9"/>
        )}

        {/* ── Upper Rock Strata (overburden) ── */}
        {[
          { y: 60, h: 40, color: '#14222e', label: 'Sandy Overburden & Alluvium', hy: 95 },
          { y: 100, h: 50, color: '#1a2a3a', label: 'Sandstone & Shale (Seam VI)', hy: 130 },
          { y: 150, h: 40, color: '#152030', label: 'Argillaceous Shale', hy: 175 },
          { y: 190, h: 20, color: '#0e1c2e', label: 'Fireclay Horizon', hy: 204 },
        ].map((s, i) => (
          <g key={i}>
            <rect x="50" y={s.y} width="760" height={s.h} fill={s.color} stroke="#1e2d3d" strokeWidth="0.5"/>
            <text x="80" y={s.hy} fill="#2d4056" fontSize="7.5" fontFamily="monospace">{s.label}</text>
          </g>
        ))}

        {/* ── Coal Seam V (active Panel A1) ── */}
        <rect x="50" y="210" width="760" height="22" fill="url(#coalGrad)" stroke="#3d3d52" strokeWidth="1"/>
        <text x="430" y="224" fill="#7878a0" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          COAL SEAM V (Seam V — 280m Depth)
        </text>

        {/* ── Underground Longwall Panels ── */}
        {/* Panel A1 - Active */}
        <rect x="200" y="232" width="200" height="35" rx="3" fill="#2a0808" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="300" y="247" fill="#ef4444" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Panel A1</text>
        <text x="300" y="258" fill="#d45" fontSize="7" fontFamily="monospace" textAnchor="middle">ACTIVE LONGWALL</text>
        <text x="300" y="267" fill="#d45" fontSize="7" fontFamily="monospace" textAnchor="middle">Face advance → →</text>

        {/* Panel A2 - Planned */}
        <rect x="50" y="232" width="140" height="35" rx="3" fill="#0a1a2e" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,3"/>
        <text x="120" y="252" fill="#3b82f6" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Panel A2</text>
        <text x="120" y="262" fill="#3b82f6" fontSize="7" fontFamily="monospace" textAnchor="middle">PLANNED</text>

        {/* Goaf (Mined-out void) */}
        <rect x="410" y="232" width="180" height="35" rx="3" fill="#0d0d15" stroke="#475569" strokeWidth="1"/>
        <text x="500" y="252" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Goaf (Caved)</text>

        {/* Panel B1 - Stabilized */}
        <rect x="600" y="232" width="200" height="35" rx="3" fill="#072218" stroke="#10b981" strokeWidth="1"/>
        <text x="700" y="252" fill="#10b981" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Panel B1 (Goaf Stowed)</text>
        <text x="700" y="262" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle">STABILIZED</text>

        {/* ── Pillars ── */}
        {[194, 398].map((x, i) => (
          <g key={i}>
            <rect x={x} y="210" width="6" height="57" fill={pillarDistress ? '#7c2d12' : '#2d3748'} stroke={pillarDistress ? '#f97316' : '#475569'} strokeWidth="1"/>
            {pillarDistress && <text x={x+3} y="203" fill="#f97316" fontSize="7" fontFamily="monospace" textAnchor="middle">⚠</text>}
          </g>
        ))}

        {/* ── Sensor Nodes Surface ── */}
        {[120, 230, 340, 430, 530, 650, 750].map((x, i) => {
          const nodeStatus = nodes?.[i]?.status ?? 'NORMAL';
          const col = nodeStatus === 'HIGH_RISK' ? '#ef4444' : nodeStatus === 'ANOMALOUS' ? '#f97316' : nodeStatus === 'WATCH' ? '#eab308' : '#10b981';
          const tilt = nodes?.[i]?.tiltMag ?? 0;
          return (
            <g key={i}>
              {/* Surface sensor node marker */}
              <circle cx={x} cy={62 + Math.min(20, (nodes?.[i]?.displacement ?? 0) * 0.12)} r="5" fill={col} stroke="#000" strokeWidth="1.2"/>
              <line x1={x} y1="55" x2={x} y2={62 + Math.min(20, (nodes?.[i]?.displacement ?? 0) * 0.12)} stroke={col} strokeWidth="1" opacity="0.6"/>
              <text x={x} y="48" fill={col} fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                S-{String(i+1).padStart(2,'0')}
              </text>
            </g>
          );
        })}

        {/* ── Surface Cracks ── */}
        {crackVisible && score > 40 && (
          <>
            <line x1="370" y1="60" x2="365" y2="75" stroke="#ef4444" strokeWidth="2" opacity="0.7"/>
            <line x1="490" y1="60" x2="497" y2="78" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          </>
        )}

        {/* ── Depth scale ── */}
        {[0, 50, 100, 150, 200, 280].map((depth, i) => {
          const y = 60 + depth * (220/280);
          return (
            <g key={i}>
              <line x1="35" y1={y} x2="45" y2={y} stroke="#2d4056" strokeWidth="0.8"/>
              <text x="33" y={y+3} fill="#2d4056" fontSize="7" fontFamily="monospace" textAnchor="end">{depth}m</text>
            </g>
          );
        })}
        <line x1="44" y1="60" x2="44" y2="270" stroke="#2d4056" strokeWidth="0.8"/>
        <text x="14" y="165" fill="#2d4056" fontSize="7" fontFamily="monospace" textAnchor="middle" transform="rotate(-90,14,165)">DEPTH</text>

        {/* ── Risk annotation ── */}
        {score > 0 && (
          <g>
            <rect x="640" y="70" width="170" height="55" rx="6" fill="#0a1220" stroke={subsColor} strokeWidth="1"/>
            <text x="725" y="85" fill={subsColor} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SUBSIDENCE STATUS</text>
            <text x="725" y="98" fill={subsColor} fontSize="8" fontFamily="monospace" textAnchor="middle">Risk Score: {score}/100</text>
            <text x="725" y="110" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Basin Depth: {subsidenceDepth.toFixed(0)}mm</text>
            <text x="725" y="120" fill="#94a3b8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">{riskLevel.replace(/_/g,' ')}</text>
          </g>
        )}
      </svg>

      <div className="text-[10px] text-slate-500 font-mono text-center">
        ⚠ Indicative schematic only. Vertical scale exaggerated for clarity. Not to scale with actual mine geometry.
      </div>
    </div>
  );
}
