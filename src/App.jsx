import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ScenarioControls from './components/ScenarioControls';
import GisMap from './components/GisMap';
import RiskOverviewPanel from './components/RiskOverviewPanel';
import XaiExplanationPanel from './components/XaiExplanationPanel';
import InfrastructureRiskCard from './components/InfrastructureRiskCard';
import EdgeTelemetryPanel from './components/EdgeTelemetryPanel';
import TimeSeriesCharts from './components/TimeSeriesCharts';
import NodeInspectorModal from './components/NodeInspectorModal';
import ReportModal from './components/ReportModal';
import EventLogTicker from './components/EventLogTicker';
import EnhancedDashboard from './components/EnhancedDashboard';

import { CRITICAL_INFRASTRUCTURE } from './engine/SensorNetwork';
import { 
  createInitialNodesState, 
  getStepNodesState, 
  SCENARIOS 
} from './engine/SimulationEngine';
import { analyzeNetworkState } from './engine/CorrelationEngine';
import { createEdgeSystemStats } from './engine/MqttBridgeSimulator';

export default function App() {
  const [nodes, setNodes] = useState(() => createInitialNodesState());
  const [currentScenarioId, setCurrentScenarioId] = useState('SCENARIO_LONGWALL_PROGRESSIVE');
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState('S-07');
  const [showNodeInspector, setShowNodeInspector] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMqttBridgeActive, setIsMqttBridgeActive] = useState(true);

  const activeScenarioObj = SCENARIOS.find(s => s.id === currentScenarioId) || SCENARIOS[0];
  const maxSteps = activeScenarioObj.durationSteps || 60;

  // Simulation timer loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prevStep) => {
          const nextStep = (prevStep + 1) % maxSteps;
          return nextStep;
        });
      }, 1200 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, maxSteps]);

  // Re-calculate physics step nodes
  useEffect(() => {
    setNodes((prevNodes) => getStepNodesState(currentScenarioId, step, prevNodes));
  }, [step, currentScenarioId]);

  // Compute multi-node correlation risk analysis
  const riskAnalysis = analyzeNetworkState(nodes, CRITICAL_INFRASTRUCTURE);
  const edgeStats = createEdgeSystemStats();
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleScenarioChange = (newScenarioId) => {
    setCurrentScenarioId(newScenarioId);
    setStep(0);
    setNodes(createInitialNodesState());
  };

  const handleReset = () => {
    setStep(0);
    setNodes(createInitialNodesState());
  };

  const handleStepForward = () => {
    setStep((prev) => (prev + 1) % maxSteps);
  };

  const handleInjectManualAnomaly = (nodeId, customMetrics) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...customMetrics,
            status: 'HIGH_RISK'
          };
        }
        return node;
      })
    );
  };

  const handleSelectNode = (id) => {
    setSelectedNodeId(id);
    setShowNodeInspector(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* 1. Top Header */}
      <Header
        riskAnalysis={riskAnalysis}
        activeScenario={activeScenarioObj}
        edgeStats={edgeStats}
        onOpenReportModal={() => setShowReportModal(true)}
        nodesCount={nodes.length}
      />

      {/* 2. Simulation Scenario & Physics Controls Bar */}
      <ScenarioControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
        onStepForward={handleStepForward}
        speed={speed}
        onChangeSpeed={setSpeed}
        currentScenarioId={currentScenarioId}
        onChangeScenario={handleScenarioChange}
        currentStep={step}
        maxSteps={maxSteps}
        onInjectManualAnomaly={handleInjectManualAnomaly}
        isMqttBridgeActive={isMqttBridgeActive}
        onToggleMqttBridge={() => setIsMqttBridgeActive(!isMqttBridgeActive)}
      />

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 p-4 space-y-4 max-w-[1800px] w-full mx-auto">
        {/* Real-time Event Ticker Feed */}
        <EventLogTicker riskAnalysis={riskAnalysis} nodes={nodes} />

        {/* At-a-glance operational summary: KPIs, charts, and node health */}
        <EnhancedDashboard
          nodes={nodes}
          riskAnalysis={riskAnalysis}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
        />

        {/* Top Row: GIS Map (Left 60%) + Risk Overview & XAI Rationale (Right 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <GisMap
              nodes={nodes}
              riskAnalysis={riskAnalysis}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
            />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <RiskOverviewPanel riskAnalysis={riskAnalysis} selectedNode={selectedNode} />
            <XaiExplanationPanel riskAnalysis={riskAnalysis} />
          </div>
        </div>

        {/* Middle Row: Infrastructure Buffer Risk Mapping & Safety Actions */}
        <InfrastructureRiskCard riskAnalysis={riskAnalysis} />

        {/* Bottom Row: Temporal Telemetry Charts + Raspberry Pi 4 Edge Gateway Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <TimeSeriesCharts nodes={nodes} selectedNodeId={selectedNodeId} />
          </div>
          <div className="lg:col-span-5">
            <EdgeTelemetryPanel
              edgeStats={edgeStats}
              selectedNode={selectedNode}
            />
          </div>
        </div>
      </main>

      {/* Node Inspector Modal */}
      {showNodeInspector && selectedNode && (
        <NodeInspectorModal
          node={selectedNode}
          onClose={() => setShowNodeInspector(false)}
        />
      )}

      {/* Geotechnical Incident Report Modal */}
      {showReportModal && (
        <ReportModal
          riskAnalysis={riskAnalysis}
          nodes={nodes}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 font-mono">
        Mine Sync Distributed AI Mine Subsidence Early Warning System &copy; 2026
      </footer>
    </div>
  );
}
