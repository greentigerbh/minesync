import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Database, 
  Wifi, 
  Radio, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  RefreshCw,
  Server
} from 'lucide-react';
import { generateMqttPayload } from '../engine/MqttBridgeSimulator';

export default function EdgeTelemetryPanel({ edgeStats, selectedNode }) {
  const [copied, setCopied] = useState(false);

  const samplePayload = selectedNode ? generateMqttPayload(selectedNode) : null;
  const payloadStr = samplePayload ? JSON.stringify(samplePayload, null, 2) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-4 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-100 tracking-wide uppercase">
            Raspberry Pi 4 Edge Computing & LoRa Gateway Diagnostics
          </h2>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
          Offline Buffer Ready
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Edge Gateway Hardware Stats */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Edge Computing Unit Metrics</span>
            <span className="text-emerald-400 font-mono text-[10px]">RPi4 (4GB RAM) Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">CPU Utilization</div>
                <div className="font-mono-num font-bold text-slate-100 mt-0.5">{edgeStats.cpuUsage}%</div>
              </div>
              <Cpu className="w-5 h-5 text-cyan-400 opacity-60" />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">RAM Usage</div>
                <div className="font-mono-num font-bold text-slate-100 mt-0.5">{edgeStats.ramUsage}%</div>
              </div>
              <Server className="w-5 h-5 text-purple-400 opacity-60" />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">SQLite Edge Buffer</div>
                <div className="font-mono-num font-bold text-amber-400 mt-0.5">
                  {edgeStats.localSqliteBufferCount.toLocaleString()} Recs
                </div>
              </div>
              <Database className="w-5 h-5 text-amber-400 opacity-60" />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">LoRa Packet Delivery</div>
                <div className="font-mono-num font-bold text-emerald-400 mt-0.5">
                  {edgeStats.packetDeliveryRatio}% PDR
                </div>
              </div>
              <Wifi className="w-5 h-5 text-emerald-400 opacity-60" />
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>LoRa Physical Band:</span>
              <span className="font-mono text-slate-200">{edgeStats.loraFrequency}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>MQTT Broker:</span>
              <span className="font-mono text-emerald-400">{edgeStats.mqttBroker}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cloud Synchronization Status:</span>
              <span className="font-mono text-cyan-400 font-bold">{edgeStats.cloudSyncStatus}</span>
            </div>
          </div>
        </div>

        {/* Right: ESP32 Hardware MQTT Payload Inspector */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>ESP32 MQTT Hardware Telemetry Packet</span>
            </span>

            <button
              onClick={handleCopy}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded flex items-center space-x-1 transition-all"
            >
              <Copy className="w-3 h-3 text-cyan-400" />
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-cyan-300 h-44 overflow-y-auto leading-relaxed shadow-inner">
            <pre>{payloadStr || '// Select a sensor node to inspect raw ESP32 MQTT packet'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
