import React, { useState, useEffect, useRef } from 'react';

/**
 * VibrationFFTChart — Real-time seismic waveform + FFT frequency bars
 * Built with pure SVG + Canvas for zero extra dependencies
 */
export default function VibrationFFTChart({ nodes, selectedNodeId }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const waveRef = useRef([]);
  const lastUiUpdateRef = useRef(0);
  const [fftPeaks, setFftPeaks] = useState([]);
  const [dominantFreq, setDominantFreq] = useState(0);

  const selectedNode = nodes?.find(n => n.id === selectedNodeId) || nodes?.[0];
  const vibG = selectedNode?.vibrationG ?? 0.02;

  // Simulate realistic waveform + FFT analysis 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let t = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const wH = H * 0.55; // waveform section height
      const fH = H * 0.40; // FFT section height
      const fY = wH + H * 0.05; // FFT top y

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, W, H);

      // Divider
      ctx.strokeStyle = '#1e2d3d';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, wH + 2); ctx.lineTo(W, wH + 2); ctx.stroke();

      // ── Waveform ──────────────────────
      const freqs = [14.2, 22.8, 36.5]; // dominant seismic frequencies Hz
      const amps = [vibG * 18, vibG * 9, vibG * 4.5];

      const N = Math.floor(W);
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = i;
        const tVal = t * 0.025 + i * 0.04;
        let y = 0;
        y += amps[0] * Math.sin(2 * Math.PI * freqs[0] * tVal * 0.004 + 0.3);
        y += amps[1] * Math.sin(2 * Math.PI * freqs[1] * tVal * 0.004 + 1.1);
        y += amps[2] * Math.sin(2 * Math.PI * freqs[2] * tVal * 0.004 + 2.2);
        // Add noise
        y += (Math.random() - 0.5) * vibG * 3;
        const screenY = wH / 2 - y * (wH / 2) * 0.85;
        if (i === 0) ctx.moveTo(x, screenY);
        else ctx.lineTo(x, screenY);
      }
      ctx.strokeStyle = vibG > 0.6 ? '#ef4444' : vibG > 0.25 ? '#f97316' : '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center line
      ctx.beginPath(); ctx.moveTo(0, wH/2); ctx.lineTo(W, wH/2);
      ctx.strokeStyle = '#1e2d3d'; ctx.lineWidth = 0.5; ctx.stroke();

      // Threshold line
      const threshY = wH/2 - 0.6 * (wH/2) * 0.85;
      ctx.beginPath(); ctx.moveTo(0, threshY); ctx.lineTo(W, threshY);
      ctx.strokeStyle = 'rgba(239,68,68,0.35)'; ctx.lineWidth = 1;
      ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(239,68,68,0.5)'; ctx.font = '9px monospace';
      ctx.fillText('Alert Threshold (0.6g)', 4, threshY - 4);

      // ── FFT Bars ──────────────────────
      const fftBins = 28;
      const barW = Math.floor((W - 20) / fftBins) - 1;
      const peakData = [];

      for (let i = 0; i < fftBins; i++) {
        const freq = 2 + i * 3;
        // Realistic frequency distribution: main components around 14, 23, 36 Hz
        const dist14 = Math.exp(-0.5 * ((freq - 14.2) / 3.5) ** 2);
        const dist23 = Math.exp(-0.5 * ((freq - 22.8) / 2.5) ** 2);
        const dist36 = Math.exp(-0.5 * ((freq - 36.5) / 4.0) ** 2);
        const magnitude = (dist14 * amps[0] + dist23 * amps[1] + dist36 * amps[2]) * 0.85;
        const noise = Math.random() * 0.03;
        const h = Math.min(fH * 0.85, (magnitude + noise) * fH * 3.5);

        const x = 10 + i * (barW + 1);
        const y = fY + fH - h;

        const hue = vibG > 0.6 ? `rgba(239,68,68,` : vibG > 0.25 ? `rgba(249,115,22,` : `rgba(6,182,212,`;
        const alpha = 0.4 + (magnitude / (amps[0] * 1.1)) * 0.55;

        ctx.fillStyle = `${hue}${Math.min(0.95, alpha)})`;
        ctx.beginPath();
        ctx.roundRect?.(x, y, barW, h, 2) || ctx.rect(x, y, barW, h);
        ctx.fill();

        peakData.push({ freq, magnitude });
      }
      const now = performance.now();
      if (now - lastUiUpdateRef.current > 150) {
        setFftPeaks(peakData.slice(0, 5).sort((a,b) => b.magnitude - a.magnitude));
        setDominantFreq(14.2 + (vibG > 0.5 ? 5 : 0));
        lastUiUpdateRef.current = now;
      }

      // Axis labels
      ctx.fillStyle = '#475569'; ctx.font = '8px monospace';
      ctx.fillText('0 Hz', 8, fY + fH + 12);
      ctx.fillText('45 Hz', W - 36, fY + fH + 12);
      ctx.fillText('Frequency Spectrum (FFT)', W/2 - 55, fY + fH + 12);

      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [vibG]);

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-0.5 items-end h-5">
            {[3,5,7,5,3,7,4,6].map((h, i) => (
              <div key={i} className="waveform-bar" style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s`, background: vibG > 0.6 ? '#ef4444' : '#06b6d4' }} />
            ))}
          </div>
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Real-Time Seismic / Acoustic Waveform &amp; FFT Spectrum
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">Dominant: <strong className="text-cyan-400">{dominantFreq.toFixed(1)} Hz</strong></span>
          <span className="text-slate-400">Peak: <strong className={vibG > 0.6 ? 'text-red-400' : vibG > 0.25 ? 'text-orange-400' : 'text-emerald-400'}>{vibG.toFixed(3)}g</strong></span>
          <span className="pill bg-slate-900 text-slate-400 border border-slate-700">{selectedNodeId}</span>
        </div>
      </div>

      {/* Waveform label */}
      <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
        <span>Seismic Waveform (Time Domain)</span>
        <span>← Amplitude (g) →</span>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full rounded-lg border border-slate-800"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
