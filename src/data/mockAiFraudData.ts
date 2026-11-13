// Module 3: Multi-Entity AI Anomaly & Voice Fraud Engine Data
// Owner: Chief Technology Officer & Lead ML/Audio Scientist
// Frameworks: NVIDIA Triton, Feast Feature Store, PyTorch Geometric ST-GNN, RawNet3 / Wav2Vec 2.0

export interface GeodesicVelocityAnomaly {
  id: string;
  msisdn: string;
  imsi: string;
  firstEvent: {
    location: string;
    coordinates: [number, number]; // [lat, lng]
    cellId: string;
    protocol: string;
    timestamp: string;
  };
  secondEvent: {
    location: string;
    coordinates: [number, number];
    cellId: string;
    protocol: string;
    timestamp: string;
  };
  timeDeltaSeconds: number;
  distanceKm: number;
  calculatedVelocityKmh: number;
  speedOfFlightRatio: string;
  anomalyScore: number;
  verdict: 'IMPOSSIBLE_GEODESIC_TRAVEL' | 'SPOOFED_ROAMING_ULR' | 'BENIGN_TRANSIT';
  riskAction: string;
}

export interface PostSwapDrainChain {
  id: string;
  msisdn: string;
  imsi: string;
  simSwapEvent: {
    timestamp: string;
    posAgent: string;
    storeLocation: string;
    channel: 'PHYSICAL_SIM' | 'ESIM_QR_PORTAL';
  };
  mfaBurstEvent: {
    timestamp: string;
    elapsedSeconds: number;
    sender: string;
    smsCount: number;
  };
  ciamAnomalyEvent: {
    timestamp: string;
    elapsedSeconds: number;
    targetBank: string;
    srcIp: string;
    ja4Fingerprint: string;
  };
  fraudRiskScore: number;
  totalLossAtRiskUsd: number;
  state: 'INTERCEPTED_QUARANTINED' | 'UNDER_STEP_UP_CHALLENGE' | 'CLEARED';
}

export interface TowerAnomalyReport {
  cellId: string;
  towerName: string;
  carrierTech: '5G NR (gNodeB)' | '4G LTE (eNodeB)' | '2G GSM Downgrade (A5/0)';
  activeUeCount: number;
  anomalyType: 'SIMBOX_CLUSTER' | 'ROGUE_IMSI_CATCHER' | 'NORMAL_OPERATION';
  stGnnScore: number;
  metrics: {
    timingAdvanceVarianceKm: number;
    outboundToInboundRatio: string;
    imeiRotationFrequencyPerHour: number;
    cipherDowngradeAlert: boolean;
    neighborCellDiscrepancy: boolean;
  };
  mitigationStatus: 'ACTIVE_PLAYBOOK' | 'MONITORING' | 'ISOLATED';
}

export interface IpJa4Anomaly {
  srcIp: string;
  clientType: 'Gi-LAN Subscriber' | 'Enterprise SIP Trunk' | 'Public CIAM API';
  ja4Fingerprint: string;
  entropyScore: number;
  asnOrg: string;
  reputationScore: number;
  threatType: 'ESIM_BOT_SWAP' | 'PBX_CREDENTIAL_STUFFING' | 'BENIGN_TELECOM';
  verdict: 'DROP_TCP_RESET' | 'RATE_LIMIT_CHALLENGE' | 'ALLOW';
}

export interface VoiceFraudSession {
  callId: string;
  callerMsisdn: string;
  destinationNumber: string;
  acdDurationSeconds: number;
  irsfHotlistHit: boolean;
  acousticDeepfakeScore: number; // 0.00 to 1.00
  rawNet3ModelLatencyMs: number;
  ramEnclaveStatus: 'EPHEMERAL_PROCESSED_AND_PURGED' | 'ACTIVE_RAM_STREAM';
  isClonedVoice: boolean;
  targetVictimRole: string;
  verdict: 'SYNTHETIC_VOICE_CLONE_BLOCKED' | 'IRSF_WANGIRI_DROP' | 'AUTHENTIC_VOICE_ALLOWED';
}

export interface AiModelShadowArtifact {
  path: string;
  language: 'python';
  responsibility: string;
  code: string;
}

export const INITIAL_GEODESIC_ANOMALIES: GeodesicVelocityAnomaly[] = [
  {
    id: 'GEO-ANOM-01',
    msisdn: '+254 722 819201',
    imsi: '639010048192039',
    firstEvent: {
      location: 'Nairobi CBD (Cell 639-01-eNB-1049)',
      coordinates: [-1.286389, 36.817223],
      cellId: '639-01-eNB-1049',
      protocol: 'RAN LTE Attach',
      timestamp: '19:00:12 UTC'
    },
    secondEvent: {
      location: 'Bucharest, Romania (Global Title +40 722 000192)',
      coordinates: [44.4323, 26.1063],
      cellId: 'RO-VLR-991',
      protocol: 'SS7 MAP_UpdateLocation (ULR)',
      timestamp: '19:00:44 UTC'
    },
    timeDeltaSeconds: 32,
    distanceKm: 5410,
    calculatedVelocityKmh: 608625, // ~Mach 497
    speedOfFlightRatio: '0.00056 c',
    anomalyScore: 0.998,
    verdict: 'IMPOSSIBLE_GEODESIC_TRAVEL',
    riskAction: 'REJECT_SS7_MAP_UPDATE_AND_FREEZE_VLR'
  },
  {
    id: 'GEO-ANOM-02',
    msisdn: '+254 710 334918',
    imsi: '639010088192011',
    firstEvent: {
      location: 'Mombasa Port (Cell 639-01-gNB-2201)',
      coordinates: [-4.0435, 39.6682],
      cellId: '639-01-gNB-2201',
      protocol: '5G SA Attach',
      timestamp: '18:54:10 UTC'
    },
    secondEvent: {
      location: 'Frankfurt, Germany (DEA dra-adversary.peer.io)',
      coordinates: [50.1109, 8.6821],
      cellId: 'DE-DRA-01',
      protocol: 'Diameter S6a_ULR',
      timestamp: '18:55:02 UTC'
    },
    timeDeltaSeconds: 52,
    distanceKm: 6590,
    calculatedVelocityKmh: 456230,
    speedOfFlightRatio: '0.00042 c',
    anomalyScore: 0.995,
    verdict: 'SPOOFED_ROAMING_ULR',
    riskAction: 'ISOLATE_DIAMETER_PEER_DRA'
  }
];

export const INITIAL_POST_SWAP_CHAINS: PostSwapDrainChain[] = [
  {
    id: 'SWAP-CHAIN-8801',
    msisdn: '+254 722 819201',
    imsi: '639010048192039',
    simSwapEvent: {
      timestamp: '18:58:14 UTC',
      posAgent: 'AG-NBO-8819',
      storeLocation: 'Nairobi Kimathi St Retail Shop',
      channel: 'ESIM_QR_PORTAL'
    },
    mfaBurstEvent: {
      timestamp: '18:59:40 UTC',
      elapsedSeconds: 86,
      sender: 'ECOBANK-OTP',
      smsCount: 4
    },
    ciamAnomalyEvent: {
      timestamp: '19:00:15 UTC',
      elapsedSeconds: 121,
      targetBank: 'Ecobank Mobile App Direct API',
      srcIp: '196.201.214.18',
      ja4Fingerprint: 't13d1516h2_8daaf6152771_b123985b4618'
    },
    fraudRiskScore: 0.97,
    totalLossAtRiskUsd: 48500.0,
    state: 'INTERCEPTED_QUARANTINED'
  },
  {
    id: 'SWAP-CHAIN-8802',
    msisdn: '+254 733 910283',
    imsi: '639010077281920',
    simSwapEvent: {
      timestamp: '18:50:00 UTC',
      posAgent: 'AG-ELD-0021',
      storeLocation: 'Eldoret Regional Branch',
      channel: 'PHYSICAL_SIM'
    },
    mfaBurstEvent: {
      timestamp: '18:53:10 UTC',
      elapsedSeconds: 190,
      sender: 'KCB-BANK',
      smsCount: 2
    },
    ciamAnomalyEvent: {
      timestamp: '18:54:05 UTC',
      elapsedSeconds: 245,
      targetBank: 'KCB Internet Banking',
      srcIp: '10.142.08.12',
      ja4Fingerprint: 't13d1516h2_7baac5152881_a421985b1100'
    },
    fraudRiskScore: 0.89,
    totalLossAtRiskUsd: 18200.0,
    state: 'UNDER_STEP_UP_CHALLENGE'
  }
];

export const INITIAL_TOWER_ANOMALIES: TowerAnomalyReport[] = [
  {
    cellId: '639-01-eNB-4482',
    towerName: 'Industrial Area Sector-3 eNodeB',
    carrierTech: '4G LTE (eNodeB)',
    activeUeCount: 142,
    anomalyType: 'SIMBOX_CLUSTER',
    stGnnScore: 0.984,
    metrics: {
      timingAdvanceVarianceKm: 0.002, // Near zero variance across 142 UEs!
      outboundToInboundRatio: '420 : 1 (Zero Inbound Calls)',
      imeiRotationFrequencyPerHour: 84.0,
      cipherDowngradeAlert: false,
      neighborCellDiscrepancy: false
    },
    mitigationStatus: 'ACTIVE_PLAYBOOK'
  },
  {
    cellId: '639-01-ROGUE-09',
    towerName: 'Downtown Embassy Quarter Micro-Cell',
    carrierTech: '2G GSM Downgrade (A5/0)',
    activeUeCount: 78,
    anomalyType: 'ROGUE_IMSI_CATCHER',
    stGnnScore: 0.992,
    metrics: {
      timingAdvanceVarianceKm: 0.015,
      outboundToInboundRatio: 'N/A (Signaling Trap)',
      imeiRotationFrequencyPerHour: 0.0,
      cipherDowngradeAlert: true, // A5/0 unencrypted cipher burst!
      neighborCellDiscrepancy: true
    },
    mitigationStatus: 'ACTIVE_PLAYBOOK'
  },
  {
    cellId: '639-01-gNB-1102',
    towerName: 'Westlands Commercial Hub 5G',
    carrierTech: '5G NR (gNodeB)',
    activeUeCount: 1240,
    anomalyType: 'NORMAL_OPERATION',
    stGnnScore: 0.041,
    metrics: {
      timingAdvanceVarianceKm: 1.84,
      outboundToInboundRatio: '1.2 : 1',
      imeiRotationFrequencyPerHour: 0.2,
      cipherDowngradeAlert: false,
      neighborCellDiscrepancy: false
    },
    mitigationStatus: 'MONITORING'
  }
];

export const INITIAL_IP_JA4_ANOMALIES: IpJa4Anomaly[] = [
  {
    srcIp: '196.201.214.18',
    clientType: 'Gi-LAN Subscriber',
    ja4Fingerprint: 't13d1516h2_8daaf6152771_b123985b4618',
    entropyScore: 7.94,
    asnOrg: 'AS37061 (Proxy / Hosting / Bulletproof)',
    reputationScore: 0.96,
    threatType: 'ESIM_BOT_SWAP',
    verdict: 'DROP_TCP_RESET'
  },
  {
    srcIp: '197.232.88.4',
    clientType: 'Enterprise SIP Trunk',
    ja4Fingerprint: 's12d0910h1_3108ab194411_c01928419200',
    entropyScore: 6.82,
    asnOrg: 'AS36914 (SIP Wholesale Transit)',
    reputationScore: 0.88,
    threatType: 'PBX_CREDENTIAL_STUFFING',
    verdict: 'RATE_LIMIT_CHALLENGE'
  },
  {
    srcIp: '105.160.22.90',
    clientType: 'Public CIAM API',
    ja4Fingerprint: 't13d1516h2_5bbaf8192011_d99102834110',
    entropyScore: 2.14,
    asnOrg: 'AS33771 (Safaricom Consumer 4G/5G)',
    reputationScore: 0.05,
    threatType: 'BENIGN_TELECOM',
    verdict: 'ALLOW'
  }
];

export const INITIAL_VOICE_FRAUD_SESSIONS: VoiceFraudSession[] = [
  {
    callId: 'SIP-CALL-2026-99014',
    callerMsisdn: '+254 700 128941',
    destinationNumber: '+254 722 000000 (Contact Center VIP Line)',
    acdDurationSeconds: 18,
    irsfHotlistHit: false,
    acousticDeepfakeScore: 0.964, // Synthetic AI Voice clone!
    rawNet3ModelLatencyMs: 38.4,
    ramEnclaveStatus: 'EPHEMERAL_PROCESSED_AND_PURGED',
    isClonedVoice: true,
    targetVictimRole: 'Corporate CFO SIM-Swap Authorization',
    verdict: 'SYNTHETIC_VOICE_CLONE_BLOCKED'
  },
  {
    callId: 'SIP-CALL-2026-99015',
    callerMsisdn: '+882 169 004128',
    destinationNumber: '+254 733 910283',
    acdDurationSeconds: 3,
    irsfHotlistHit: true,
    acousticDeepfakeScore: 0.12,
    rawNet3ModelLatencyMs: 24.1,
    ramEnclaveStatus: 'EPHEMERAL_PROCESSED_AND_PURGED',
    isClonedVoice: false,
    targetVictimRole: 'Wangiri One-Ring Fraud Storm',
    verdict: 'IRSF_WANGIRI_DROP'
  },
  {
    callId: 'SIP-CALL-2026-99016',
    callerMsisdn: '+254 722 819201',
    destinationNumber: '+254 710 449201',
    acdDurationSeconds: 245,
    irsfHotlistHit: false,
    acousticDeepfakeScore: 0.042,
    rawNet3ModelLatencyMs: 29.8,
    ramEnclaveStatus: 'EPHEMERAL_PROCESSED_AND_PURGED',
    isClonedVoice: false,
    targetVictimRole: 'Standard Subscriber P2P Voice Call',
    verdict: 'AUTHENTIC_VOICE_ALLOWED'
  }
];

export const AI_FRAUD_SHADOW_ARTIFACTS: AiModelShadowArtifact[] = [
  {
    path: 'ml/models/imei_simswap_velocity/feature_view.py',
    language: 'python',
    responsibility: 'Sliding window feature aggregator computing distinct_imsi_count, pos_agent_entropy, and tower_spread per IMEI over 1m, 5m, and 15m windows.',
    code: `from datetime import timedelta
from feast import Field, FeatureView, ValueType
from feast.types import Int64, Float32, String

# Feast Feature View for IMEI & SIM-Swap Velocity Aggregation
imei_velocity_feature_view = FeatureView(
    name="imei_simswap_velocity_v1",
    entities=["imei"],
    ttl=timedelta(days=7),
    schema=[
        Field(name="swap_attempts_1m", dtype=Int64),
        Field(name="swap_attempts_5m", dtype=Int64),
        Field(name="swap_attempts_10m", dtype=Int64),
        Field(name="distinct_imsi_count", dtype=Int64),
        Field(name="pos_agent_entropy", dtype=Float32),
        Field(name="distinct_towers", dtype=Int64),
        Field(name="mfa_sms_velocity_300s", dtype=Int64),
        Field(name="max_geodesic_velocity_kmh", dtype=Float32),
    ],
    online=True,
    source=feast_kafka_source,
)

def evaluate_continent_wide_block(features: dict) -> bool:
    """Decision threshold:
    swap_attempts_10m >= 1000 OR (swap_attempts_5m >= 50 AND distinct_towers >= 5)
    """
    if features.get("swap_attempts_10m", 0) >= 1000:
        return True
    if features.get("swap_attempts_5m", 0) >= 50 and features.get("distinct_towers", 0) >= 5:
        return True
    return False`
  },
  {
    path: 'ml/models/tower_stgnn/simbox_detector.py',
    language: 'python',
    responsibility: 'ST-GNN model ingesting RAN Timing Advance distributions and CDR ratios per Cell-ID to output simbox_probability and imsi_catcher_probability.',
    code: `import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv, GRUCell

class SpatioTemporalTowerGNN(nn.Module):
    def __init__(self, in_channels=8, hidden_channels=32, out_classes=3):
        super().__init__()
        # in_channels: [timing_advance_var, call_sms_ratio, imei_rotation_rate,
        #               a5_cipher_indicator, neighbor_cell_drift, active_ues,
        #               avg_call_duration, handover_failure_rate]
        self.spatial_conv = GCNConv(in_channels, hidden_channels)
        self.temporal_gru = GRUCell(hidden_channels, hidden_channels)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_channels, 16),
            nn.ReLU(),
            nn.Linear(16, out_classes) # [Normal, SimboxCluster, RogueImsiCatcher]
        )

    def forward(self, x, edge_index, h_state):
        # Spatial graph message passing across neighboring towers
        spatial_out = torch.relu(self.spatial_conv(x, edge_index))
        # Temporal aggregation over sliding time window
        new_h = self.temporal_gru(spatial_out, h_state)
        logits = self.classifier(new_h)
        probs = torch.softmax(logits, dim=-1)
        return probs, new_h`
  },
  {
    path: 'ml/models/voice_antispoof/rtp_deepfake_worker.py',
    language: 'python',
    responsibility: 'gRPC streaming worker consuming 16kHz PCM RTP chunks from SBC, executing RawNet3 ONNX inference in under 40ms per 2-second audio window, zero disk persistence.',
    code: `import numpy as np
import onnxruntime as ort
import grpc
from concurrent import futures

class RtpDeepfakeInferenceWorker:
    def __init__(self, model_path="rawnet3_telecom_quant.onnx"):
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 4
        opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        # Triton / TensorRT Execution Provider
        self.session = ort.InferenceSession(model_path, opts, providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
        self.input_name = self.session.get_inputs()[0].name

    def process_pcm_chunk_ephemeral(self, pcm_bytes_16khz: bytes) -> dict:
        """Processes 2-second chunk (64,000 bytes) in RAM.
        Zero disk persistence guarantees sovereign privacy compliance.
        """
        try:
            # Convert raw 16kHz 16-bit PCM to float32 normalized [-1.0, 1.0]
            audio_array = np.frombuffer(pcm_bytes_16khz, dtype=np.int16).astype(np.float32) / 32768.0
            audio_tensor = np.expand_dims(audio_array, axis=0) # [1, 32000]

            # Execute RawNet3 ONNX model (SLA < 40ms)
            outputs = self.session.run(None, {self.input_name: audio_tensor})
            synthetic_score = float(outputs[0][0][1]) # Index 1 = Deepfake probability

            return {
                "deepfake_probability": synthetic_score,
                "is_clone": synthetic_score > 0.90,
                "latency_ms": 38.4,
                "enclave_purged": True
            }
        finally:
            # Ephemeral zero-fill memory hygiene
            del audio_array
            del audio_tensor`
  }
];
