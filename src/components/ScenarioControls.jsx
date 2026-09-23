import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  FastForward, 
  Sliders, 
  Flame, 
  CheckCircle2, 
  Zap, 
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { SCENARIOS } from '../engine/SimulationEngine';

export default function ScenarioControls({
  isPlaying,
  onTogglePlay,
  onReset,
  onStepForward,
  speed,
  onChangeSpeed,
  currentScenarioId,
  onChangeScenario,
  currentStep,
  maxSteps,
  onInjectManualAnomaly,
  isMqttBridgeActive,
  onToggleMqttBridge
}) {
  const [selectedNodeForInject, setSelectedNodeForInject] = useState('S-07');
  const [injectTilt, setInjectTilt] = useState(4.2);
  const [injectDisp, setInjectDisp] = useState(45.0);
  const [injectCrack, setInjectCrack] = useState(3.5);
  const [showManualModal, setShowManualModal] = useState(false);

  const activeScenarioObj = SCENARIOS.find(s => s.id === currentScenarioId) || SCENARIOS[0];

  const handleInjectSubmit = (e) => {
    e.preventDefault();
    onInjectManualAnomaly(selectedNodeForInject, {
      tiltX: parseFloat(injectTilt),
      tiltY: parseFloat((injectTilt * 0.6).toFixed(2)),
      displacement: parseFloat(injectDisp),
      dispVelocity: 22.5,
      crackWidth: parseFloat(injectCrack),
      vibrationG: 0.85
    });
    setShowManualModal(false);
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-3">
      <div className="flex flex-col xl:flex-row xl:flex-wrap items-stretch xl:items-center justify-between gap-3 xl:gap-4">
        {/* Scenario Selector */}
        <div className="flex items-center space-x-3 flex-1 min-w-0 w-full xl:w-auto">
          <div className="scenario-label flex items-center space-x-2 text-cyan-400 font-semibold text-xs shrink-0 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Simulation Scenario:</span><span className="sm:hidden">Scenario</span>
          </div>
          <select
            value={currentScenarioId}
            onChange={(e) => onChangeScenario(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-medium flex-1 outline-none cursor-pointer"
          >
            {SCENARIOS.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.title}
              </option>
            ))}
          </select>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between space-x-2 bg-slate-950 border border-slate-800 rounded-lg p-1 w-full xl:w-auto">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            title="Step Next"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Simulation"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">Speed:</span>
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  speed === s
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Slider Bar */}
        <div className="flex items-center space-x-3 text-xs text-slate-400 min-w-0 w-full xl:w-auto">
          <span className="font-mono text-slate-300 font-semibold shrink-0">
            Step {currentStep} / {maxSteps}
          </span>
          <div className="flex-1 max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden shrink-0">
            <div
              className="bg-linear-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / maxSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons: Hardware MQTT Bridge & Manual Anomaly Injector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full xl:w-auto">
          {/* Hardware MQTT Bridge Simulator Toggle */}
          <button
            onClick={onToggleMqttBridge}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
              isMqttBridgeActive
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700 ring-1 ring-cyan-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Simulated Physical ESP32 LoRa MQTT Gateway Payload Stream"
          >
            <Radio className={`w-3.5 h-3.5 ${isMqttBridgeActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{isMqttBridgeActive ? 'ESP32 MQTT Stream: ON' : 'ESP32 MQTT Stream: OFF'}</span>
            <span className="sm:hidden">MQTT {isMqttBridgeActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Manual Anomaly Trigger Modal Button */}
          <button
            onClick={() => setShowManualModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Inject Custom Anomaly</span><span className="sm:hidden">Inject</span>
          </button>
        </div>
      </div>

      {/* Description hint of active scenario */}
      <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded border border-slate-800/80 flex items-center justify-between">
        <span className="truncate">
          <strong className="text-slate-300">Active Sequence Details:</strong> {activeScenarioObj.description}
        </span>
        <span className="shrink-0 text-cyan-400 font-mono text-[10px]">16 Sensor Array Ingestion Active</span>
      </div>

      {/* Manual Anomaly Injector Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                <Flame className="w-5 h-5" />
                <span>Inject Manual Node Anomaly</span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                aria-label="Close anomaly injector"
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleInjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target ESP32 Sensor Node:</label>
                <select
                  value={selectedNodeForInject}
                  onChange={(e) => setSelectedNodeForInject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                >
                  {Array.from({ length: 16 }).map((_, i) => {
                    const id = `S-${String(i + 1).padStart(2, '0')}`;
                    return <option key={id} value={id}>Node {id}</option>;
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tilt Angle (°):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={injectTilt}
                    onChange={(e) => setInjectTilt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Displacement (mm):</label>
                  <input
                    type="number"
                    step="1"
                    value={injectDisp}
                    onChange={(e) => setInjectDisp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Crack Gauge Width (mm):</label>
                <input
                  type="number"
                  step="0.1"
                  value={injectCrack}
                  onChange={(e) => setInjectCrack(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold shadow-lg shadow-amber-900/30"
                >
                  Inject Anomaly
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
