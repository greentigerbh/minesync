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
import CommandCenterOverview from './components/CommandCenterOverview';
import {
  BarChart3,
  BellRing,
  ClipboardList,
  LayoutDashboard,
  Map,
  RadioTower,
  Settings2,
  ShieldCheck
} from 'lucide-react';

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
    <div className="min-h-screen app-shell text-slate-100 flex selection:bg-cyan-500 selection:text-black font-sans">
      <aside className="command-rail hidden lg:flex" aria-label="Primary navigation">
        <div className="rail-mark"><ShieldCheck className="w-5 h-5" /></div>
        <nav className="rail-nav">
          {[
            [LayoutDashboard, 'Dashboard', '#dashboard'],
            [Map, 'Live map', '#map'],
            [RadioTower, 'Telemetry', '#telemetry'],
            [BellRing, 'Alerts', '#alerts'],
            [BarChart3, 'Analytics', '#analytics'],
            [ClipboardList, 'Reports', '#reports']
          ].map(([Icon, label, href], index) => (
            <a key={label} href={href} className={`rail-link ${index === 0 ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <a href="#settings" className="rail-link rail-bottom"><Settings2 className="w-4 h-4" /><span>Settings</span></a>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <Header
          riskAnalysis={riskAnalysis}
          activeScenario={activeScenarioObj}
          edgeStats={edgeStats}
          onOpenReportModal={() => setShowReportModal(true)}
          nodesCount={nodes.length}
        />

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

        <nav className="mobile-nav lg:hidden" aria-label="Mobile navigation">
          {[
            [LayoutDashboard, 'Home', '#dashboard'],
            [Map, 'Map', '#map'],
            [RadioTower, 'Telemetry', '#telemetry'],
            [BellRing, 'Alerts', '#alerts'],
            [ClipboardList, 'Reports', '#reports']
          ].map(([Icon, label, href]) => <a key={label} href={href}><Icon className="w-4 h-4" /><span>{label}</span></a>)}
        </nav>

        <main id="dashboard" className="flex-1 p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 max-w-[1800px] w-full mx-auto">
          <div id="alerts"><EventLogTicker riskAnalysis={riskAnalysis} nodes={nodes} /></div>

          <CommandCenterOverview
            nodes={nodes}
            riskAnalysis={riskAnalysis}
            onSelectNode={handleSelectNode}
          />

          <div id="map" className="grid grid-cols-1 lg:grid-cols-12 gap-4 scroll-mt-4">
            <div className="lg:col-span-7 xl:col-span-8">
              <GisMap nodes={nodes} riskAnalysis={riskAnalysis} selectedNodeId={selectedNodeId} onSelectNode={handleSelectNode} />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              <TimeSeriesCharts nodes={nodes} selectedNodeId={selectedNodeId} />
              <EdgeTelemetryPanel edgeStats={edgeStats} selectedNode={selectedNode} />
            </div>
          </div>

          <div id="analytics" className="grid grid-cols-1 xl:grid-cols-2 gap-4 scroll-mt-4">
            <RiskOverviewPanel riskAnalysis={riskAnalysis} selectedNode={selectedNode} />
            <XaiExplanationPanel riskAnalysis={riskAnalysis} />
          </div>

          <InfrastructureRiskCard riskAnalysis={riskAnalysis} />

          <div id="telemetry" className="scroll-mt-4" />
        </main>

        <footer id="reports" className="border-t border-slate-900 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500 font-mono">
          Mine Sync Distributed AI Mine Subsidence Early Warning System &copy; 2026
        </footer>
      </div>

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

    </div>
  );
}
