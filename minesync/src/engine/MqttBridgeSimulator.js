/**
 * Mine Sync ESP32 LoRa Hardware & MQTT Edge Bridge Simulator
 */

export function generateMqttPayload(node) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    client_id: node.mac || `ESP32-S3-${node.id}`,
    node_id: node.id,
    topic: `minesentinel/telemetry/${node.id}`,
    timestamp,
    telemetry: {
      imu: {
        tilt_x_deg: node.tiltX,
        tilt_y_deg: node.tiltY,
        temp_c: (24.5 + Math.random() * 0.8).toFixed(1)
      },
      displacement: {
        raw_mm: node.displacement,
        velocity_mm_day: node.dispVelocity
      },
      crack: {
        lvdt_mm: node.crackWidth
      },
      vibration: {
        accel_peak_g: node.vibrationG,
        fft_dominant_freq_hz: (14.2 + Math.random() * 4.5).toFixed(1)
      },
      health: {
        battery_v: node.batteryV,
        rssi_dbm: node.rssiDbm,
        snr_db: (9.5 + Math.random() * 3).toFixed(1),
        pdr_percent: 99.4
      }
    }
  };

  return payload;
}

export function createEdgeSystemStats() {
  return {
    gatewayName: 'RPi4-EDGE-GATEWAY-01',
    os: 'Raspbian Linux 12 (Bookworm - 64 bit)',
    cpuUsage: 18.4,
    ramUsage: 34.2,
    diskSpaceGb: 28.4,
    loraFrequency: '865-867 MHz (IN865 Band)',
    mqttBroker: 'Mosquitto 2.0.18 (Local Edge Broker)',
    localSqliteBufferCount: 14280, // Number of records buffered locally during internet outage
    cloudSyncStatus: 'ONLINE_SYNCED', // ONLINE_SYNCED, OFFLINE_BUFFERING, SYNCING
    packetDeliveryRatio: 99.4,
    uptimeHours: 742
  };
}
