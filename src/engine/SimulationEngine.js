/**
 * Mine Sync Progressive Subsidence Physics & Scenario Simulator
 */
import { INITIAL_NODES } from './SensorNetwork';

export const SCENARIOS = [
  {
    id: 'SCENARIO_LONGWALL_PROGRESSIVE',
    title: '1. Longwall Panel A1 Progressive Subsidence',
    description: 'Realistic mining extraction sequence: Normal → Micro-tilt → Displacement → Crack opening → Multi-node spatial correlation → Hotspot formation → Expanding high-risk early warning.',
    durationSteps: 60
  },
  {
    id: 'SCENARIO_PILLAR_SHEAR',
    title: '2. Localized Pillar Shear Strain & Micro-Seismic Spike',
    description: 'Sudden structural shear strain on pillar nodes (S-06, S-07, S-10) with sharp vibration anomaly (2.1g) and rapid tilt acceleration.',
    durationSteps: 40
  },
  {
    id: 'SCENARIO_ISOLATED_ANOMALY',
    title: '3. Single Sensor Isolated False Anomaly Filtering',
    description: 'Demonstrates spatial correlation intelligence: Node S-03 reports sudden 5.2° tilt spike, but system filters it out as hardware/bump anomaly because neighbors remain 100% normal.',
    durationSteps: 30
  },
  {
    id: 'SCENARIO_BASELINE_STABILITY',
    title: '4. Nominal Operational Baseline (Active Mining)',
    description: 'Continuous operational monitoring showing ambient background environmental noise across all 16 ESP32 nodes.',
    durationSteps: 30
  }
];

export function createInitialNodesState() {
  return INITIAL_NODES.map(node => ({
    ...node,
    tiltX: (Math.random() * 0.2 - 0.1), // small noise
    tiltY: (Math.random() * 0.2 - 0.1),
    displacement: (Math.random() * 0.5),
    dispVelocity: 0.0,
    crackWidth: (Math.random() * 0.05),
    vibrationG: 0.02 + Math.random() * 0.03,
    batteryV: 3.95 + Math.random() * 0.05,
    rssiDbm: -72 - Math.floor(Math.random() * 10),
    isOffline: false,
    status: 'NORMAL',
    history: []
  }));
}

/**
 * Generate physics state for step index t [0 to N] under specified scenario
 */
export function getStepNodesState(scenarioId, step, currentNodes) {
  const baseNodes = currentNodes ? [...currentNodes] : createInitialNodesState();

  return baseNodes.map(node => {
    let tX = (Math.random() * 0.1 - 0.05);
    let tY = (Math.random() * 0.1 - 0.05);
    let disp = Math.random() * 0.3;
    let vel = 0.0;
    let crack = Math.random() * 0.02;
    let vib = 0.02 + Math.random() * 0.03;
    let status = 'NORMAL';

    switch (scenarioId) {
      case 'SCENARIO_LONGWALL_PROGRESSIVE': {
        // Step 0-10: Baseline
        // Step 11-25: S-06, S-07 micro-tilt
        // Step 26-40: S-06, S-07, S-10, S-11 active subsidence, displacement & velocity jump
        // Step 41-60: Expanding hotspot, crack width > 3.8mm, high spatial correlation
        
        if (step > 10) {
          if (['S-06', 'S-07'].includes(node.id)) {
            const factor = Math.min(1.0, (step - 10) / 35.0);
            tX += 1.8 * factor;
            tY += -1.2 * factor;
            disp += 18.0 * factor;
            vel = 12.5 * factor;
            crack += 1.2 * factor;
            vib += 0.15 * factor;
          }
        }

        if (step > 25) {
          if (['S-10', 'S-11'].includes(node.id)) {
            const factor = Math.min(1.0, (step - 25) / 25.0);
            tX += 2.4 * factor;
            tY += 1.5 * factor;
            disp += 28.0 * factor;
            vel += 18.2 * factor;
            crack += 2.4 * factor;
            vib += 0.28 * factor;
          }
          if (['S-06', 'S-07'].includes(node.id)) {
            const factor = Math.min(1.0, (step - 25) / 25.0);
            tX += 1.8 * factor;
            disp += 24.0 * factor;
            vel += 14.0 * factor;
            crack += 2.5 * factor;
            vib += 0.35 * factor;
          }
        }

        if (step > 40) {
          if (['S-02', 'S-03', 'S-08', 'S-15'].includes(node.id)) {
            const factor = Math.min(1.0, (step - 40) / 15.0);
            tX += 0.9 * factor;
            disp += 12.0 * factor;
            vel += 8.5 * factor;
            crack += 0.8 * factor;
          }
        }
        break;
      }

      case 'SCENARIO_PILLAR_SHEAR': {
        // Sudden shear strain step 10+
        if (step > 8) {
          if (['S-06', 'S-07', 'S-10'].includes(node.id)) {
            const factor = Math.min(1.0, (step - 8) / 15.0);
            tX += 3.8 * factor;
            tY += -2.5 * factor;
            disp += 45.0 * factor;
            vel = 24.0 * factor;
            crack += 4.2 * factor;
            vib += 0.95 * factor;
          }
        }
        break;
      }

      case 'SCENARIO_ISOLATED_ANOMALY': {
        // Only S-03 spikes to test single-node noise filtering
        if (step > 5 && node.id === 'S-03') {
          const factor = Math.min(1.0, (step - 5) / 10.0);
          tX += 4.5 * factor;
          tY += 2.2 * factor;
          disp += 32.0 * factor;
          vel = 18.0 * factor;
          crack += 3.5 * factor;
          vib += 0.65 * factor;
        }
        break;
      }

      case 'SCENARIO_BASELINE_STABILITY':
      default:
        // Nominal
        break;
    }

    // Determine status
    const tiltMag = Math.sqrt(tX * tX + tY * tY);
    if (tiltMag > 3.0 || disp > 35 || crack > 3.0) {
      status = 'HIGH_RISK';
    } else if (tiltMag > 1.8 || disp > 18 || crack > 1.2) {
      status = 'ANOMALOUS';
    } else if (tiltMag > 0.8 || disp > 8 || crack > 0.4) {
      status = 'WATCH';
    }

    // Keep history (last 20 points)
    const newHistory = [
      ...(node.history || []),
      {
        step,
        tiltMag: parseFloat(tiltMag.toFixed(2)),
        displacement: parseFloat(disp.toFixed(1)),
        crackWidth: parseFloat(crack.toFixed(2)),
        vibrationG: parseFloat(vib.toFixed(3))
      }
    ].slice(-25);

    return {
      ...node,
      tiltX: parseFloat(tX.toFixed(2)),
      tiltY: parseFloat(tY.toFixed(2)),
      displacement: parseFloat(disp.toFixed(1)),
      dispVelocity: parseFloat(vel.toFixed(1)),
      crackWidth: parseFloat(crack.toFixed(2)),
      vibrationG: parseFloat(vib.toFixed(3)),
      status,
      history: newHistory
    };
  });
}
