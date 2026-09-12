/**
 * Mine Sync Multi-Parameter Spatial-Temporal Correlation & Explainable AI Engine
 */

// Haversine distance in meters between two lat/lng points
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Bearing angle in degrees between two lat/lng points
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Calculates per-node individual normalized anomaly metrics [0 to 1]
 */
export function calculateNodeAnomaly(nodeState) {
  // Tilt magnitude theta = sqrt(tiltX^2 + tiltY^2)
  const tiltMag = Math.sqrt(Math.pow(nodeState.tiltX || 0, 2) + Math.pow(nodeState.tiltY || 0, 2));
  const tiltScore = Math.min(1.0, tiltMag / 5.0); // 5 degrees is max severe tilt threshold

  // Displacement & Velocity
  const disp = nodeState.displacement || 0;
  const dispScore = Math.min(1.0, disp / 60.0); // 60mm is severe

  const vel = nodeState.dispVelocity || 0; // mm/day
  const velScore = Math.min(1.0, Math.abs(vel) / 25.0); // 25 mm/day severe

  // Crack Width & Growth Rate
  const crack = nodeState.crackWidth || 0;
  const crackScore = Math.min(1.0, crack / 5.0); // 5mm severe crack

  // Vibration anomaly
  const vib = nodeState.vibrationG || 0;
  const vibScore = Math.min(1.0, vib / 1.2); // 1.2g severe vibration

  // Weighted raw individual anomaly
  const rawAnomaly = (tiltScore * 0.25) + (dispScore * 0.20) + (velScore * 0.25) + (crackScore * 0.20) + (vibScore * 0.10);

  return {
    rawAnomaly,
    tiltScore,
    dispScore,
    velScore,
    crackScore,
    vibScore,
    tiltMag
  };
}

/**
 * Perform Spatial-Temporal Correlation across all 16 nodes
 */
export function analyzeNetworkState(nodesState, infrastructureList) {
  const nodeCount = nodesState.length;
  if (nodeCount === 0) return null;

  // 1. Calculate individual node anomalies
  const nodeAnalysis = nodesState.map(node => {
    const metrics = calculateNodeAnomaly(node);
    return {
      ...node,
      ...metrics
    };
  });

  // 2. Spatial Correlation Matrix & Neighbor Coherence
  // Radius of spatial neighbor interaction (in meters) - e.g. 250m for subsidence basin
  const NEIGHBOR_RADIUS = 250;
  let totalSpatialCorrelationSum = 0;
  let activeNeighborPairs = 0;
  const spatialLinks = [];

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const n1 = nodeAnalysis[i];
      const n2 = nodeAnalysis[j];

      if (n1.isOffline || n2.isOffline) continue;

      const dist = calculateDistanceMeters(n1.lat, n1.lng, n2.lat, n2.lng);

      if (dist <= NEIGHBOR_RADIUS) {
        // Inverse distance weight
        const distanceWeight = Math.exp(-dist / 120.0);
        
        // Co-deformation similarity: minimum of their individual raw anomalies, scaled by similarity
        const similarity = 1.0 - Math.abs(n1.rawAnomaly - n2.rawAnomaly);
        const pairwiseCoherence = Math.min(n1.rawAnomaly, n2.rawAnomaly) * similarity * distanceWeight;

        if (pairwiseCoherence > 0.08) {
          totalSpatialCorrelationSum += pairwiseCoherence;
          activeNeighborPairs++;
          spatialLinks.push({
            from: n1.id,
            to: n2.id,
            fromPos: [n1.lat, n1.lng],
            toPos: [n2.lat, n2.lng],
            coherence: pairwiseCoherence,
            strength: Math.min(1.0, pairwiseCoherence * 3.5)
          });
        }
      }
    }
  }

  // Normalized Spatial Correlation Score [0 to 100]
  const spatialCorrelationScore = activeNeighborPairs > 0 
    ? Math.min(100, Math.round((totalSpatialCorrelationSum / activeNeighborPairs) * 220))
    : 0;

  // 3. Identify Hotspot Epicenter & Radius
  const anomalousNodes = nodeAnalysis.filter(n => !n.isOffline && n.rawAnomaly >= 0.25);
  
  let hotspotCenter = null;
  let hotspotRadius = 0;
  let affectedAreaSqM = 0;
  let propagationVector = { bearing: 0, speedMmDay: 0, directionLabel: 'N/A' };

  if (anomalousNodes.length >= 2 && spatialCorrelationScore > 15) {
    // Weighted center based on anomaly magnitude
    let weightedLatSum = 0;
    let weightedLngSum = 0;
    let weightSum = 0;

    anomalousNodes.forEach(n => {
      weightedLatSum += n.lat * n.rawAnomaly;
      weightedLngSum += n.lng * n.rawAnomaly;
      weightSum += n.rawAnomaly;
    });

    const cLat = weightedLatSum / weightSum;
    const cLng = weightedLngSum / weightSum;
    hotspotCenter = { lat: cLat, lng: cLng };

    // Max distance from epicenter to active node
    let maxDist = 0;
    anomalousNodes.forEach(n => {
      const d = calculateDistanceMeters(cLat, cLng, n.lat, n.lng);
      if (d > maxDist) maxDist = d;
    });
    hotspotRadius = Math.max(35, Math.round(maxDist + 25)); // min 35m
    affectedAreaSqM = Math.round(Math.PI * Math.pow(hotspotRadius, 2));

    // Propagation vector estimation based on highest velocity gradient
    const sortedByVel = [...anomalousNodes].sort((a, b) => b.velScore - a.velScore);
    if (sortedByVel.length >= 2) {
      const fastestNode = sortedByVel[0];
      const bearing = calculateBearing(cLat, cLng, fastestNode.lat, fastestNode.lng);
      const avgVel = sortedByVel.reduce((s, n) => s + Math.abs(n.dispVelocity || 0), 0) / sortedByVel.length;
      
      const compassDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const dirIndex = Math.round(bearing / 45) % 8;

      propagationVector = {
        bearing: Math.round(bearing),
        speedMmDay: parseFloat(avgVel.toFixed(1)),
        directionLabel: compassDirs[dirIndex]
      };
    }
  } else if (anomalousNodes.length === 1) {
    // Single isolated node anomaly
    hotspotCenter = { lat: anomalousNodes[0].lat, lng: anomalousNodes[0].lng };
    hotspotRadius = 20;
    affectedAreaSqM = 1250;
  }

  // 4. Calculate Aggregate Network Metrics
  const avgTilt = nodeAnalysis.reduce((s, n) => s + (n.isOffline ? 0 : n.tiltMag), 0) / nodeCount;
  const maxTilt = Math.max(...nodeAnalysis.map(n => n.isOffline ? 0 : n.tiltMag));
  const avgDisp = nodeAnalysis.reduce((s, n) => s + (n.isOffline ? 0 : (n.displacement || 0)), 0) / nodeCount;
  const maxDisp = Math.max(...nodeAnalysis.map(n => n.isOffline ? 0 : (n.displacement || 0)));
  const maxCrack = Math.max(...nodeAnalysis.map(n => n.isOffline ? 0 : (n.crackWidth || 0)));
  const maxVib = Math.max(...nodeAnalysis.map(n => n.isOffline ? 0 : (n.vibrationG || 0)));
  const avgVel = nodeAnalysis.reduce((s, n) => s + (n.isOffline ? 0 : Math.abs(n.dispVelocity || 0)), 0) / nodeCount;

  // 5. Composite Risk Score & Confidence Score
  // Composite Risk formula incorporates multi-node spatial correlation to differentiate isolated noise from subsidence front
  const baseAnomalyAgg = Math.min(100, Math.round((maxTilt / 5.0 * 25) + (maxDisp / 60.0 * 20) + (maxCrack / 5.0 * 20) + (avgVel / 25.0 * 15) + (maxVib / 1.2 * 10)));

  // Spatial Correlation multiplier: if spatial correlation is high, risk confidence & magnitude increase
  let compositeRiskScore = 0;
  if (anomalousNodes.length === 1 && spatialCorrelationScore < 15) {
    // Isolated anomaly cap (e.g. max 45 Watch status)
    compositeRiskScore = Math.min(45, Math.round(baseAnomalyAgg * 0.5));
  } else {
    compositeRiskScore = Math.min(100, Math.round(baseAnomalyAgg * 0.65 + spatialCorrelationScore * 0.35));
  }

  // Confidence Score: Higher if multiple nodes confirm trend and spatial correlation exists
  let confidenceScore = 0;
  if (anomalousNodes.length === 0) {
    confidenceScore = 98; // High confidence in normal state
  } else if (anomalousNodes.length === 1) {
    confidenceScore = 42; // Low confidence, possible sensor fault
  } else {
    confidenceScore = Math.min(96, Math.round(60 + (spatialCorrelationScore * 0.36)));
  }

  // Risk Classification Status
  let riskLevel = 'NORMAL';
  let riskColor = '#10b981'; // Emerald
  if (compositeRiskScore >= 75) {
    riskLevel = 'HIGH_RISK_EMERGENCY';
    riskColor = '#ef4444'; // Red
  } else if (compositeRiskScore >= 50) {
    riskLevel = 'ANOMALOUS_WARNING';
    riskColor = '#f97316'; // Orange
  } else if (compositeRiskScore >= 25) {
    riskLevel = 'WATCH';
    riskColor = '#eab308'; // Amber
  }

  // 6. Explainable AI (XAI) Feature Contributions (%)
  const totalFeatureWeight = (maxTilt * 2.0) + (maxDisp * 0.8) + (maxCrack * 8.0) + (maxVib * 25.0) + (avgVel * 1.5) + (spatialCorrelationScore * 0.8) || 1.0;

  const xaiContributions = [
    { name: 'Multi-Node Spatial Correlation', weight: Math.round(((spatialCorrelationScore * 0.8) / totalFeatureWeight) * 100), color: '#a855f7' },
    { name: 'IMU Tilt Anomaly Gradient', weight: Math.round(((maxTilt * 2.0) / totalFeatureWeight) * 100), color: '#3b82f6' },
    { name: 'Displacement & Subsidence Velocity', weight: Math.round(((maxDisp * 0.8 + avgVel * 1.5) / totalFeatureWeight) * 100), color: '#f59e0b' },
    { name: 'LVDT Crack Expansion Rate', weight: Math.round(((maxCrack * 8.0) / totalFeatureWeight) * 100), color: '#ef4444' },
    { name: 'Seismic & Acoustic Vibration Peak', weight: Math.round(((maxVib * 25.0) / totalFeatureWeight) * 100), color: '#06b6d4' }
  ];

  // 7. Human-Readable Natural Language XAI Narrative
  let xaiNarrative = '';
  if (riskLevel === 'NORMAL') {
    xaiNarrative = 'System operating nominally. All 16 ESP32 sensor nodes report ambient background noise within safe geotechnical thresholds. No spatial coherence detected across underground panels.';
  } else if (anomalousNodes.length === 1 && spatialCorrelationScore < 15) {
    xaiNarrative = `ALERT FILTERED: Sensor node ${anomalousNodes[0].id} reports elevated tilt (${anomalousNodes[0].tiltMag.toFixed(1)}°), but all ${nodeCount - 1} neighboring nodes remain fully nominal (Spatial Correlation: ${spatialCorrelationScore}%). System auto-classifies this as an ISOLATED SENSOR ANOMALY or local surface disturbance. Field sensor inspection recommended.`;
  } else {
    const nodeIds = anomalousNodes.map(n => n.id).join(', ');
    xaiNarrative = `SPATIAL CORRELATION CONFIRMED: High confidence early warning (${confidenceScore}% confidence). ${anomalousNodes.length} neighboring nodes (${nodeIds}) simultaneously exhibit progressive co-deformation. Primary driver is ${xaiContributions[0].name} (${xaiContributions[0].weight}%), combined with maximum tilt of ${maxTilt.toFixed(1)}° and displacement velocity of ${propagationVector.speedMmDay} mm/day towards ${propagationVector.directionLabel} (${propagationVector.bearing}°). Active hotspot expansion radius: ${hotspotRadius}m.`;
  }

  // 8. Infrastructure Risk & Safety Recommendations
  const infraRisks = (infrastructureList || []).map(infra => {
    let minDistance = 9999;
    
    if (infra.coordinates && Array.isArray(infra.coordinates[0])) {
      // Polyline / polygon asset
      infra.coordinates.forEach(coord => {
        if (hotspotCenter) {
          const d = calculateDistanceMeters(hotspotCenter.lat, hotspotCenter.lng, coord[0], coord[1]);
          if (d < minDistance) minDistance = d;
        }
      });
    } else if (infra.coordinates && typeof infra.coordinates[0] === 'number') {
      // Point asset
      if (hotspotCenter) {
        minDistance = calculateDistanceMeters(hotspotCenter.lat, hotspotCenter.lng, infra.coordinates[0], infra.coordinates[1]);
      }
    }

    minDistance = Math.round(minDistance);
    
    let alertStatus = 'SAFE';
    let alertBadge = 'Green';
    if (minDistance <= hotspotRadius + 15) {
      alertStatus = 'CRITICAL_PROXIMITY';
      alertBadge = 'Red';
    } else if (minDistance <= hotspotRadius + 60) {
      alertStatus = 'WARNING_BUFFER';
      alertBadge = 'Orange';
    } else if (minDistance <= 150) {
      alertStatus = 'MONITORING';
      alertBadge = 'Yellow';
    }

    return {
      ...infra,
      distanceToHotspotMeters: minDistance,
      alertStatus,
      alertBadge
    };
  });

  // Actionable Mine Operations Recommendations
  const safetyRecommendations = [];
  if (riskLevel === 'HIGH_RISK_EMERGENCY') {
    safetyRecommendations.push({
      priority: 'IMMEDIATE',
      action: 'Enforce immediate speed restriction (max 10 km/h) or temporary hold on Main Railway Line near Panel A1.',
      icon: 'AlertTriangle'
    });
    safetyRecommendations.push({
      priority: 'URGENT',
      action: 'Dispatch geotechnical field team to conduct Total Station & GNSS validation around Node S-07 & S-11.',
      icon: 'ShieldAlert'
    });
    safetyRecommendations.push({
      priority: 'OPERATIONAL',
      action: 'Review underground longwall face advance rate in Panel A1 (Longwall 101) to mitigate surface stress concentration.',
      icon: 'HardHat'
    });
  } else if (riskLevel === 'ANOMALOUS_WARNING') {
    safetyRecommendations.push({
      priority: 'HIGH',
      action: 'Increase ESP32 LoRa node sampling frequency from 60s to 5s on nodes S-06, S-07, S-10, S-11.',
      icon: 'Radio'
    });
    safetyRecommendations.push({
      priority: 'MEDIUM',
      action: 'Inspect High-Pressure Drainage Pipeline joints in Sector 2 for strain deflection.',
      icon: 'Wrench'
    });
  } else {
    safetyRecommendations.push({
      priority: 'NOMINAL',
      action: 'Continue standard continuous edge monitoring. All telemetry streams stable.',
      icon: 'CheckCircle2'
    });
  }

  return {
    nodeAnalysis,
    spatialLinks,
    spatialCorrelationScore,
    hotspotCenter,
    hotspotRadius,
    affectedAreaSqM,
    propagationVector,
    avgTilt,
    maxTilt,
    avgDisp,
    maxDisp,
    maxCrack,
    maxVib,
    avgVel,
    compositeRiskScore,
    confidenceScore,
    riskLevel,
    riskColor,
    xaiContributions,
    xaiNarrative,
    infraRisks,
    safetyRecommendations
  };
}
