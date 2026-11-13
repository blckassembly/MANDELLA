import React, { useState, useEffect, useMemo, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Zap,
  Radio,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
  Globe,
  Sliders,
  X,
  Lock,
  ChevronRight,
  Server,
  Flame,
  Eye,
  EyeOff,
  Compass,
  AlertOctagon,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../../design-system';

export type ThreatPlane = 'ALL' | 'SS7' | 'DIAMETER' | 'SMS' | 'GTP_U' | 'VOICE';
export type AfricanRegion = 'ALL' | 'EAST_AFRICA' | 'WEST_AFRICA' | 'SOUTHERN_AFRICA' | 'NORTH_AFRICA' | 'CENTRAL_HORN';
export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type SeverityFilterMode = 'HIGHLIGHT' | 'HIDE';

export interface CarrierNode {
  id: string;
  name: string;
  country: string;
  type: 'SOVEREIGN_HUB' | 'SUBSEA_LANDING' | 'TRANSIT_IXP' | 'SUSPECT_PEER';
  coordinates: [number, number]; // [longitude, latitude]
  carrier: string;
  activeAttacksCount: number;
  scrubberStatus: 'ACTIVE' | 'STANDBY' | 'BYPASS';
  peeringCapacityGbps: number;
}

export interface AttackArc {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceCoords: [number, number];
  targetCoords: [number, number];
  plane: 'SS7' | 'DIAMETER' | 'SMS' | 'GTP_U' | 'VOICE';
  protocol: string;
  payloadSnippet: string;
  ingressRate: string;
  velocityKmH: number;
  lossRiskPerMinUsd: number;
  threatScore: number; // 0 - 100
  severity: ThreatSeverity;
  urgencyLabel: string;
  status: 'ACTIVE' | 'MITIGATING' | 'MITIGATED';
  mitigationAction: string;
  mitigationLogs?: string[];
  mttmSeconds?: number;
}

export interface ThreatDensityPoint {
  id: string;
  name: string;
  region: AfricanRegion;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  weight: number; // 10 to 100
  eventsPerSec: number;
  dominantThreat: string;
  anomalyRatio: string;
}

// Urgency & Severity Theme Configuration
export const SEVERITY_CONFIG: Record<
  ThreatSeverity,
  {
    label: string;
    scoreRange: string;
    color: [number, number, number]; // RGB for Deck.gl
    hex: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    urgencyText: string;
    slaThreshold: string;
  }
> = {
  CRITICAL: {
    label: 'Critical',
    scoreRange: 'Score 85–100',
    color: [239, 68, 68], // #ef4444 Crimson
    hex: '#ef4444',
    badgeBg: 'bg-red-600',
    badgeBorder: 'border-red-500',
    badgeText: 'text-red-400',
    urgencyText: 'Immediate Null-Route / STP Block',
    slaThreshold: '< 2.0s SLA'
  },
  HIGH: {
    label: 'High',
    scoreRange: 'Score 65–84',
    color: [249, 115, 22], // #f97316 Orange
    hex: '#f97316',
    badgeBg: 'bg-orange-600',
    badgeBorder: 'border-orange-500',
    badgeText: 'text-orange-400',
    urgencyText: 'OTA Stripping / AVP Peering Drop',
    slaThreshold: '< 5.0s SLA'
  },
  MEDIUM: {
    label: 'Medium',
    scoreRange: 'Score 40–64',
    color: [234, 179, 8], // #eab308 Amber/Yellow
    hex: '#eab308',
    badgeBg: 'bg-yellow-500',
    badgeBorder: 'border-yellow-500',
    badgeText: 'text-yellow-400',
    urgencyText: 'Velocity Rate-Limit & CDR Audit',
    slaThreshold: '< 15.0s SLA'
  },
  LOW: {
    label: 'Low',
    scoreRange: 'Score < 40',
    color: [14, 165, 233], // #0ea5e9 Sky Blue
    hex: '#0ea5e9',
    badgeBg: 'bg-sky-500',
    badgeBorder: 'border-sky-500',
    badgeText: 'text-sky-400',
    urgencyText: 'Telemetry Tracking & Watchdog',
    slaThreshold: 'Passive Log'
  }
};

// 11 Pre-calibrated Global & African Carrier Interconnect Nodes
export const CARRIER_NODES: CarrierNode[] = [
  {
    id: 'nbo',
    name: 'Nairobi Gateway STP / KIXP',
    country: 'Kenya',
    type: 'SOVEREIGN_HUB',
    coordinates: [36.8172, -1.2864],
    carrier: 'Safaricom / Telkom Kenya',
    activeAttacksCount: 2,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 400
  },
  {
    id: 'mba',
    name: 'Mombasa Subsea Landing & 5G SA',
    country: 'Kenya',
    type: 'SUBSEA_LANDING',
    coordinates: [39.6682, -4.0435],
    carrier: 'SEACOM / TEAMS / EASSy',
    activeAttacksCount: 1,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 1200
  },
  {
    id: 'jnb',
    name: 'Johannesburg NAPAfrica IXP / STP',
    country: 'South Africa',
    type: 'SOVEREIGN_HUB',
    coordinates: [28.0473, -26.2041],
    carrier: 'MTN / Vodacom Core',
    activeAttacksCount: 1,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 850
  },
  {
    id: 'los',
    name: 'Lagos MainOne & WACS Hub',
    country: 'Nigeria',
    type: 'SOVEREIGN_HUB',
    coordinates: [3.3792, 6.5244],
    carrier: 'MTN Nigeria / Airtel / MainOne',
    activeAttacksCount: 2,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 600
  },
  {
    id: 'cai',
    name: 'Cairo TE-North Gateway',
    country: 'Egypt',
    type: 'TRANSIT_IXP',
    coordinates: [31.2357, 30.0444],
    carrier: 'Telecom Egypt Interconnect',
    activeAttacksCount: 2,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 900
  },
  {
    id: 'fra',
    name: 'Frankfurt DE-CIX & DRA Peering',
    country: 'Germany',
    type: 'TRANSIT_IXP',
    coordinates: [8.6821, 50.1109],
    carrier: 'DE-CIX International IXP',
    activeAttacksCount: 2,
    scrubberStatus: 'STANDBY',
    peeringCapacityGbps: 2400
  },
  {
    id: 'lon',
    name: 'London LINX & Tier-1 SS7',
    country: 'United Kingdom',
    type: 'TRANSIT_IXP',
    coordinates: [-0.1278, 51.5074],
    carrier: 'LINX / Colt Telecom',
    activeAttacksCount: 2,
    scrubberStatus: 'STANDBY',
    peeringCapacityGbps: 2000
  },
  {
    id: 'buc',
    name: 'Bucharest Global Title Aggregator',
    country: 'Romania',
    type: 'SUSPECT_PEER',
    coordinates: [26.1025, 44.4268],
    carrier: 'Host GT Pool (+40 722)',
    activeAttacksCount: 1,
    scrubberStatus: 'BYPASS',
    peeringCapacityGbps: 180
  },
  {
    id: 'dxb',
    name: 'Dubai UAE-IX Interconnect',
    country: 'UAE',
    type: 'TRANSIT_IXP',
    coordinates: [55.2708, 25.2048],
    carrier: 'e& / du Peering Fabric',
    activeAttacksCount: 1,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 750
  },
  {
    id: 'mrs',
    name: 'Marseille Interxion Subsea Hub',
    country: 'France',
    type: 'TRANSIT_IXP',
    coordinates: [5.3698, 43.2965],
    carrier: 'Interxion / AAE-1 Subsea',
    activeAttacksCount: 1,
    scrubberStatus: 'ACTIVE',
    peeringCapacityGbps: 1500
  },
  {
    id: 'sin',
    name: 'Singapore Equinix SG1 Hub',
    country: 'Singapore',
    type: 'TRANSIT_IXP',
    coordinates: [103.8198, 1.3521],
    carrier: 'Equinix APAC Interconnect',
    activeAttacksCount: 1,
    scrubberStatus: 'STANDBY',
    peeringCapacityGbps: 1600
  }
];

// Initial Regional Threat Density Points across the African Continent
export const INITIAL_THREAT_DENSITY_POINTS: ThreatDensityPoint[] = [
  // East Africa Corridor
  {
    id: 'td-nbo',
    name: 'Nairobi Central STP & Dataverse Hub',
    region: 'EAST_AFRICA',
    country: 'Kenya',
    coordinates: [36.8172, -1.2864],
    weight: 94,
    eventsPerSec: 48500,
    dominantThreat: 'SS7 MAP_SRI / SMSC Flood',
    anomalyRatio: '8.4x baseline'
  },
  {
    id: 'td-mba',
    name: 'Mombasa Subsea Terminal & 5G SA',
    region: 'EAST_AFRICA',
    country: 'Kenya',
    coordinates: [39.6682, -4.0435],
    weight: 82,
    eventsPerSec: 34200,
    dominantThreat: 'Diameter S6a Roaming Drop',
    anomalyRatio: '5.2x baseline'
  },
  {
    id: 'td-ksm',
    name: 'Kisumu Lake Transit Relay',
    region: 'EAST_AFRICA',
    country: 'Kenya',
    coordinates: [34.7679, -0.0917],
    weight: 56,
    eventsPerSec: 18400,
    dominantThreat: 'SIM-Box GSM Gateway Cluster',
    anomalyRatio: '3.1x baseline'
  },
  {
    id: 'td-eld',
    name: 'Eldoret Rift Radio Spine',
    region: 'EAST_AFRICA',
    country: 'Kenya',
    coordinates: [35.2698, 0.5143],
    weight: 48,
    eventsPerSec: 12100,
    dominantThreat: 'A2P Smishing URL Leakage',
    anomalyRatio: '2.4x baseline'
  },
  {
    id: 'td-kla',
    name: 'Kampala Core Interconnect',
    region: 'EAST_AFRICA',
    country: 'Uganda',
    coordinates: [32.5825, 0.3476],
    weight: 68,
    eventsPerSec: 24100,
    dominantThreat: 'Wangiri / IRSF One-Ring',
    anomalyRatio: '4.6x baseline'
  },
  {
    id: 'td-kgl',
    name: 'Kigali Innovation Hub Node',
    region: 'EAST_AFRICA',
    country: 'Rwanda',
    coordinates: [30.0619, -1.9441],
    weight: 62,
    eventsPerSec: 19800,
    dominantThreat: 'eSIM Provisioning Bot Scans',
    anomalyRatio: '3.8x baseline'
  },
  {
    id: 'td-dar',
    name: 'Dar es Salaam Gateway',
    region: 'EAST_AFRICA',
    country: 'Tanzania',
    coordinates: [39.2083, -6.7924],
    weight: 72,
    eventsPerSec: 28900,
    dominantThreat: 'Signaling Tap Vector Infiltration',
    anomalyRatio: '4.9x baseline'
  },
  {
    id: 'td-add',
    name: 'Addis Ababa Ethio-Telecom Spine',
    region: 'EAST_AFRICA',
    country: 'Ethiopia',
    coordinates: [38.7468, 9.0250],
    weight: 76,
    eventsPerSec: 31200,
    dominantThreat: 'BGP Route Reflection & SS7 ULR',
    anomalyRatio: '5.1x baseline'
  },

  // West Africa & Gulf of Guinea Hub
  {
    id: 'td-los',
    name: 'Lagos MainOne & Marina Gateway',
    region: 'WEST_AFRICA',
    country: 'Nigeria',
    coordinates: [3.3792, 6.5244],
    weight: 98,
    eventsPerSec: 58400,
    dominantThreat: 'Simjacker 0x7F UDH & SIM-Swap',
    anomalyRatio: '9.6x baseline'
  },
  {
    id: 'td-abj',
    name: 'Abuja Federal Telco Backbone',
    region: 'WEST_AFRICA',
    country: 'Nigeria',
    coordinates: [7.4951, 9.0579],
    weight: 70,
    eventsPerSec: 26700,
    dominantThreat: 'CIAM Credential Stuffing',
    anomalyRatio: '4.5x baseline'
  },
  {
    id: 'td-phc',
    name: 'Port Harcourt Oil & Gas Private LTE',
    region: 'WEST_AFRICA',
    country: 'Nigeria',
    coordinates: [7.0498, 4.8156],
    weight: 64,
    eventsPerSec: 22400,
    dominantThreat: 'Gi-LAN Subnet Enumeration',
    anomalyRatio: '3.9x baseline'
  },
  {
    id: 'td-acc',
    name: 'Accra IXP & Core Gateway',
    region: 'WEST_AFRICA',
    country: 'Ghana',
    coordinates: [-0.1870, 5.6037],
    weight: 78,
    eventsPerSec: 32800,
    dominantThreat: 'SIP VoLTE Storm / Wangiri',
    anomalyRatio: '5.4x baseline'
  },
  {
    id: 'td-abid',
    name: 'Abidjan Subsea Terminal',
    region: 'WEST_AFRICA',
    country: "Côte d'Ivoire",
    coordinates: [-4.0083, 5.3600],
    weight: 74,
    eventsPerSec: 27500,
    dominantThreat: 'Diameter Cancellation Storm',
    anomalyRatio: '4.8x baseline'
  },
  {
    id: 'td-dkr',
    name: 'Dakar Teranga Peering Hub',
    region: 'WEST_AFRICA',
    country: 'Senegal',
    coordinates: [-17.4441, 14.6928],
    weight: 66,
    eventsPerSec: 23100,
    dominantThreat: 'Roaming Profile Spoofing',
    anomalyRatio: '4.2x baseline'
  },

  // Southern African Tier
  {
    id: 'td-jnb',
    name: 'Johannesburg NAPAfrica & STP',
    region: 'SOUTHERN_AFRICA',
    country: 'South Africa',
    coordinates: [28.0473, -26.2041],
    weight: 96,
    eventsPerSec: 54100,
    dominantThreat: 'GTP-U Port 2152 UDP Flood',
    anomalyRatio: '9.1x baseline'
  },
  {
    id: 'td-cpt',
    name: 'Cape Town Melkbosstrand Hub',
    region: 'SOUTHERN_AFRICA',
    country: 'South Africa',
    coordinates: [18.4241, -33.9249],
    weight: 82,
    eventsPerSec: 37600,
    dominantThreat: 'Subsea Reflection DDoS',
    anomalyRatio: '5.8x baseline'
  },
  {
    id: 'td-dur',
    name: 'Durban Seacom Interconnect',
    region: 'SOUTHERN_AFRICA',
    country: 'South Africa',
    coordinates: [31.0218, -29.8587],
    weight: 71,
    eventsPerSec: 25800,
    dominantThreat: 'VoIP PBX Toll Fraud',
    anomalyRatio: '4.7x baseline'
  },
  {
    id: 'td-pta',
    name: 'Pretoria Sovereign Node',
    region: 'SOUTHERN_AFRICA',
    country: 'South Africa',
    coordinates: [28.1871, -25.7479],
    weight: 60,
    eventsPerSec: 19400,
    dominantThreat: 'STIR/SHAKEN CLI Impersonation',
    anomalyRatio: '3.6x baseline'
  },
  {
    id: 'td-gbe',
    name: 'Gaborone Telco Spine',
    region: 'SOUTHERN_AFRICA',
    country: 'Botswana',
    coordinates: [25.9231, -24.6282],
    weight: 50,
    eventsPerSec: 13200,
    dominantThreat: 'A2P Gray-Route Bypass',
    anomalyRatio: '2.8x baseline'
  },
  {
    id: 'td-mpm',
    name: 'Maputo Port Landing',
    region: 'SOUTHERN_AFRICA',
    country: 'Mozambique',
    coordinates: [32.5732, -25.9692],
    weight: 58,
    eventsPerSec: 16900,
    dominantThreat: 'OTA Binary Command Injection',
    anomalyRatio: '3.4x baseline'
  },

  // North Africa Gateways
  {
    id: 'td-cai',
    name: 'Cairo TE-North Gateway',
    region: 'NORTH_AFRICA',
    country: 'Egypt',
    coordinates: [31.2357, 30.0444],
    weight: 88,
    eventsPerSec: 44200,
    dominantThreat: 'SIP INVITE / Wangiri Flood',
    anomalyRatio: '6.7x baseline'
  },
  {
    id: 'td-alx',
    name: 'Alexandria Subsea Landing',
    region: 'NORTH_AFRICA',
    country: 'Egypt',
    coordinates: [29.9553, 31.2001],
    weight: 80,
    eventsPerSec: 35100,
    dominantThreat: 'Mediterranean Optical Tap Scans',
    anomalyRatio: '5.3x baseline'
  },
  {
    id: 'td-cas',
    name: 'Casablanca Technopark Node',
    region: 'NORTH_AFRICA',
    country: 'Morocco',
    coordinates: [-7.5898, 33.5731],
    weight: 74,
    eventsPerSec: 29800,
    dominantThreat: 'MAP_UpdateLocation Tracking',
    anomalyRatio: '4.6x baseline'
  },
  {
    id: 'td-alg',
    name: 'Algiers Peering Gateway',
    region: 'NORTH_AFRICA',
    country: 'Algeria',
    coordinates: [3.0588, 36.7538],
    weight: 64,
    eventsPerSec: 21700,
    dominantThreat: 'Diameter S6a Request Flood',
    anomalyRatio: '3.8x baseline'
  },

  // Central Africa & Horn
  {
    id: 'td-kin',
    name: 'Kinshasa Gateway Core',
    region: 'CENTRAL_HORN',
    country: 'DR Congo',
    coordinates: [15.2663, -4.4419],
    weight: 75,
    eventsPerSec: 30400,
    dominantThreat: 'SIM-Box Infiltration Burst',
    anomalyRatio: '5.0x baseline'
  },
  {
    id: 'td-dla',
    name: 'Douala Subsea Transit Hub',
    region: 'CENTRAL_HORN',
    country: 'Cameroon',
    coordinates: [9.7679, 4.0511],
    weight: 58,
    eventsPerSec: 17800,
    dominantThreat: 'A2P Gray-Route SMS Intercept',
    anomalyRatio: '3.3x baseline'
  }
];

export const INITIAL_ATTACK_ARCS: AttackArc[] = [
  {
    id: 'arc-ss7-01',
    sourceNodeId: 'buc',
    targetNodeId: 'nbo',
    sourceCoords: [26.1025, 44.4268],
    targetCoords: [36.8172, -1.2864],
    plane: 'SS7',
    protocol: 'MAP_SendRoutingInfoForSM (Harvest IMSI & MSC GT)',
    payloadSnippet: 'TCAP_Begin: map-sri-sm msisdn=+254712891920 sm-rp-pri=true GT=+40722000192',
    ingressRate: '42,800 msgs/s',
    velocityKmH: 608625,
    lossRiskPerMinUsd: 1450,
    threatScore: 98,
    severity: 'CRITICAL',
    urgencyLabel: 'IMMEDIATE STP/HLR DROP (< 2.0s SLA)',
    status: 'ACTIVE',
    mitigationAction: 'STP_GT_BLOCK'
  },
  {
    id: 'arc-gtpu-04',
    sourceNodeId: 'mrs',
    targetNodeId: 'jnb',
    sourceCoords: [5.3698, 43.2965],
    targetCoords: [28.0473, -26.2041],
    plane: 'GTP_U',
    protocol: 'GTP-U Echo Reflection & Port 2152 Flood',
    payloadSnippet: 'UDP: src_port=2152 dst_port=2152 len=1480 TEID=0xDEADBEEF Amplification x38',
    ingressRate: '840,000 pps (14.2 Gbps)',
    velocityKmH: 180000,
    lossRiskPerMinUsd: 5600,
    threatScore: 94,
    severity: 'CRITICAL',
    urgencyLabel: 'CRITICAL IXP VOLUMETRIC COLLAPSE',
    status: 'ACTIVE',
    mitigationAction: 'BGP_FLOWSPEC_DROP'
  },
  {
    id: 'arc-sms-03',
    sourceNodeId: 'lon',
    targetNodeId: 'los',
    sourceCoords: [-0.1278, 51.5074],
    targetCoords: [3.3792, 6.5244],
    plane: 'SMS',
    protocol: 'SMPP 0x7F UDH Simjacker Envelope (Malicious OTA)',
    payloadSnippet: 'UDH: 02 70 00 (STK Proactive Command: SEND USSD / LOCATION REQ)',
    ingressRate: '125,000 msgs/min',
    velocityKmH: 8200,
    lossRiskPerMinUsd: 3200,
    threatScore: 82,
    severity: 'HIGH',
    urgencyLabel: 'HIGH A2P GRAY-ROUTE INTERCEPT',
    status: 'ACTIVE',
    mitigationAction: 'SMS_OTA_STRIP'
  },
  {
    id: 'arc-diam-02',
    sourceNodeId: 'fra',
    targetNodeId: 'mba',
    sourceCoords: [8.6821, 50.1109],
    targetCoords: [39.6682, -4.0435],
    plane: 'DIAMETER',
    protocol: 'S6a_CancelLocationRequest (Spoofed VLR Deregistration)',
    payloadSnippet: 'AVP: Origin-Host="dra-adversary.peer.io" Cancellation-Type=MME_UPDATEDRAWN',
    ingressRate: '18,400 msgs/s',
    velocityKmH: 456230,
    lossRiskPerMinUsd: 980,
    threatScore: 78,
    severity: 'HIGH',
    urgencyLabel: 'HIGH DRA ROAMING DEREGISTRATION',
    status: 'ACTIVE',
    mitigationAction: 'DRA_AVP_FILTER'
  },
  {
    id: 'arc-voice-05',
    sourceNodeId: 'dxb',
    targetNodeId: 'cai',
    sourceCoords: [55.2708, 25.2048],
    targetCoords: [31.2357, 30.0444],
    plane: 'VOICE',
    protocol: 'SIP INVITE Wangiri / IRSF Spoofed CLI Storm',
    payloadSnippet: 'INVITE sip:+201099281@te-sbc.net SIP/2.0 From: <sip:+882169994@satellite.io>',
    ingressRate: '3,400 CPS (ACD 2.1s)',
    velocityKmH: 14200,
    lossRiskPerMinUsd: 2100,
    threatScore: 58,
    severity: 'MEDIUM',
    urgencyLabel: 'MEDIUM IRSF WANGIRI TOLL FRAUD',
    status: 'ACTIVE',
    mitigationAction: 'STIR_SHAKEN_REJECT'
  },
  {
    id: 'arc-sip-06',
    sourceNodeId: 'sin',
    targetNodeId: 'nbo',
    sourceCoords: [103.8198, 1.3521],
    targetCoords: [36.8172, -1.2864],
    plane: 'VOICE',
    protocol: 'SIP OPTIONS Fingerprint Scan (JA4T Detection)',
    payloadSnippet: 'OPTIONS sip:nbo-sbc.core.net SIP/2.0 User-Agent: friendly-scanner-ja4t-v2.1',
    ingressRate: '420 CPS',
    velocityKmH: 1200,
    lossRiskPerMinUsd: 450,
    threatScore: 46,
    severity: 'MEDIUM',
    urgencyLabel: 'MEDIUM SIP PBX RECON PROBE',
    status: 'ACTIVE',
    mitigationAction: 'SBC_RATE_LIMIT'
  },
  {
    id: 'arc-gt-07',
    sourceNodeId: 'fra',
    targetNodeId: 'los',
    sourceCoords: [8.6821, 50.1109],
    targetCoords: [3.3792, 6.5244],
    plane: 'SS7',
    protocol: 'MAP_SendAuthenticationInfo (AIR Low-Velocity Probe)',
    payloadSnippet: 'TCAP_Begin: map-send-auth-info imsi=621200192810920 GT=+49172000918',
    ingressRate: '85 msgs/s',
    velocityKmH: 450,
    lossRiskPerMinUsd: 120,
    threatScore: 32,
    severity: 'LOW',
    urgencyLabel: 'LOW EXPLORATORY GT ENUMERATION',
    status: 'ACTIVE',
    mitigationAction: 'STP_GT_RATE_LIMIT'
  },
  {
    id: 'arc-diam-08',
    sourceNodeId: 'lon',
    targetNodeId: 'cai',
    sourceCoords: [-0.1278, 51.5074],
    targetCoords: [31.2357, 30.0444],
    plane: 'DIAMETER',
    protocol: 'Diameter Watchdog (DWR/DWA Latency Drift)',
    payloadSnippet: 'AVP: Device-Watchdog-Request Origin-Host="lon-edge.transit.uk" RTT=142ms',
    ingressRate: '35 msgs/s',
    velocityKmH: 300,
    lossRiskPerMinUsd: 50,
    threatScore: 28,
    severity: 'LOW',
    urgencyLabel: 'LOW TELEMETRY SYNCHRONIZATION DRIFT',
    status: 'ACTIVE',
    mitigationAction: 'DRA_PEER_REBALANCE'
  }
];

const PLANE_COLORS: Record<string, [number, number, number]> = {
  SS7: [239, 68, 68], // #ef4444 Crimson
  DIAMETER: [245, 158, 11], // #f59e0b Amber
  SMS: [168, 85, 247], // #a855f7 Purple
  GTP_U: [6, 182, 212], // #06b6d4 Cyan
  VOICE: [59, 130, 246] // #3b82f6 Blue
};

interface ThreatGeospatialViewProps {
  onMitigationTriggered?: (actionDesc: string, savedAmount: number) => void;
}

export const ThreatGeospatialView: React.FC<ThreatGeospatialViewProps> = ({
  onMitigationTriggered
}) => {
  const [selectedPlane, setSelectedPlane] = useState<ThreatPlane>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>('ALL');
  
  // Severity Filter States (Local State)
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | ThreatSeverity>('ALL');
  const [severityFilterMode, setSeverityFilterMode] = useState<SeverityFilterMode>('HIGHLIGHT');

  const [arcs, setArcs] = useState<AttackArc[]>(INITIAL_ATTACK_ARCS);
  const [selectedArc, setSelectedArc] = useState<AttackArc | null>(INITIAL_ATTACK_ARCS[0]);
  const [selectedNode, setSelectedNode] = useState<CarrierNode | null>(null);
  const [selectedDensityPoint, setSelectedDensityPoint] = useState<ThreatDensityPoint | null>(null);
  
  // Threat Density (HeatmapLayer) States
  const [showThreatDensity, setShowThreatDensity] = useState<boolean>(true);
  const [heatmapRadius, setHeatmapRadius] = useState<number>(45);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(1.2);
  const [threatPoints, setThreatPoints] = useState<ThreatDensityPoint[]>(INITIAL_THREAT_DENSITY_POINTS);

  const [mitigationFeedback, setMitigationFeedback] = useState<string | null>(null);
  const [executingMitigationId, setExecutingMitigationId] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 21.0,
    latitude: 5.0,
    zoom: 2.4,
    pitch: 32,
    bearing: 0
  });

  // Severity counts for legend
  const severityCounts = useMemo(() => {
    return {
      CRITICAL: arcs.filter((a) => a.severity === 'CRITICAL').length,
      HIGH: arcs.filter((a) => a.severity === 'HIGH').length,
      MEDIUM: arcs.filter((a) => a.severity === 'MEDIUM').length,
      LOW: arcs.filter((a) => a.severity === 'LOW').length,
      ALL: arcs.length
    };
  }, [arcs]);

  // Filtered arcs based on selected threat plane AND severity filter mode
  const filteredArcs = useMemo(() => {
    return arcs.filter((a) => {
      // Threat plane match
      const planeMatches = selectedPlane === 'ALL' || a.plane === selectedPlane;
      if (!planeMatches) return false;

      // Severity match if mode is HIDE
      if (severityFilterMode === 'HIDE' && selectedSeverity !== 'ALL') {
        return a.severity === selectedSeverity;
      }

      return true;
    });
  }, [arcs, selectedPlane, selectedSeverity, severityFilterMode]);

  // Filtered threat density points based on selected African region
  const filteredThreatPoints = useMemo(() => {
    if (selectedRegion === 'ALL') return threatPoints;
    return threatPoints.filter((p) => p.region === selectedRegion);
  }, [threatPoints, selectedRegion]);

  // Aggregate Metrics
  const activeCount = useMemo(() => arcs.filter((a) => a.status === 'ACTIVE').length, [arcs]);
  const mitigatedCount = useMemo(() => arcs.filter((a) => a.status === 'MITIGATED').length, [arcs]);
  const totalFinancialRisk = useMemo(
    () => arcs.filter((a) => a.status === 'ACTIVE').reduce((sum, a) => sum + a.lossRiskPerMinUsd, 0),
    [arcs]
  );

  // Regional Intensity Aggregates
  const regionalMetrics = useMemo(() => {
    const totalThreatEvents = threatPoints.reduce((acc, pt) => acc + pt.eventsPerSec, 0);
    const eastTotal = threatPoints.filter(p => p.region === 'EAST_AFRICA').reduce((acc, pt) => acc + pt.eventsPerSec, 0);
    const westTotal = threatPoints.filter(p => p.region === 'WEST_AFRICA').reduce((acc, pt) => acc + pt.eventsPerSec, 0);
    const southTotal = threatPoints.filter(p => p.region === 'SOUTHERN_AFRICA').reduce((acc, pt) => acc + pt.eventsPerSec, 0);
    const northTotal = threatPoints.filter(p => p.region === 'NORTH_AFRICA').reduce((acc, pt) => acc + pt.eventsPerSec, 0);

    return {
      totalThreatEvents,
      eastTotal,
      westTotal,
      southTotal,
      northTotal
    };
  }, [threatPoints]);

  // Regional View Presets
  const handleJumpToRegion = (region: AfricanRegion) => {
    setSelectedRegion(region);
    if (region === 'EAST_AFRICA') {
      setViewState({ longitude: 36.8, latitude: -0.5, zoom: 4.2, pitch: 35, bearing: 0 });
    } else if (region === 'WEST_AFRICA') {
      setViewState({ longitude: 4.5, latitude: 8.0, zoom: 4.1, pitch: 35, bearing: 0 });
    } else if (region === 'SOUTHERN_AFRICA') {
      setViewState({ longitude: 26.5, latitude: -27.0, zoom: 4.0, pitch: 35, bearing: 0 });
    } else if (region === 'NORTH_AFRICA') {
      setViewState({ longitude: 20.0, latitude: 31.0, zoom: 3.9, pitch: 35, bearing: 0 });
    } else {
      setViewState({ longitude: 21.0, latitude: 5.0, zoom: 2.4, pitch: 32, bearing: 0 });
    }
  };

  // One-click Mitigation Handler (BGP FlowSpec / STP Drop)
  const handleExecuteMitigation = (arc: AttackArc) => {
    setExecutingMitigationId(arc.id);
    setMitigationFeedback(`Dispatching ${arc.mitigationAction} to edge enforcement plane...`);

    setTimeout(() => {
      setArcs((prev) =>
        prev.map((item) => {
          if (item.id === arc.id) {
            const updated: AttackArc = {
              ...item,
              status: 'MITIGATED',
              mttmSeconds: 1.4,
              mitigationLogs: [
                `[0.0s] Southbound API dispatched: ${item.mitigationAction}`,
                `[0.4s] BGP FlowSpec announcement confirmed across DE-CIX/KIXP route servers`,
                `[1.4s] Verified: Ingress rate collapsed from ${item.ingressRate} to 0 pps. Cause code transmitted.`
              ]
            };
            if (selectedArc?.id === arc.id) {
              setSelectedArc(updated);
            }
            return updated;
          }
          return item;
        })
      );

      // Cool down regional density points associated with target
      setThreatPoints((prev) =>
        prev.map((pt) => {
          if (
            (arc.targetNodeId === 'nbo' && pt.region === 'EAST_AFRICA') ||
            (arc.targetNodeId === 'jnb' && pt.region === 'SOUTHERN_AFRICA') ||
            (arc.targetNodeId === 'los' && pt.region === 'WEST_AFRICA') ||
            (arc.targetNodeId === 'cai' && pt.region === 'NORTH_AFRICA') ||
            (arc.targetNodeId === 'mba' && pt.region === 'EAST_AFRICA')
          ) {
            return {
              ...pt,
              weight: Math.max(20, Math.floor(pt.weight * 0.65)),
              eventsPerSec: Math.floor(pt.eventsPerSec * 0.65)
            };
          }
          return pt;
        })
      );

      setExecutingMitigationId(null);
      setMitigationFeedback(
        `SUCCESS: ${arc.mitigationAction} verified in 1.4s SLA. Vector neutralised and regional density cooled.`
      );

      if (onMitigationTriggered) {
        onMitigationTriggered(
          `Mitigated ${arc.plane} [${arc.severity}] attack vector from ${arc.sourceNodeId.toUpperCase()} to ${arc.targetNodeId.toUpperCase()}`,
          arc.lossRiskPerMinUsd * 60
        );
      }
    }, 1200);
  };

  // Reset Mitigations and Threat Density
  const handleResetMitigations = () => {
    setArcs(INITIAL_ATTACK_ARCS);
    setSelectedArc(INITIAL_ATTACK_ARCS[0]);
    setThreatPoints(INITIAL_THREAT_DENSITY_POINTS);
    setSelectedSeverity('ALL');
    setMitigationFeedback('Simulated attack vectors, severity filters, and regional threat density restored to baseline.');
  };

  // Add Burst Attack Simulation
  const handleSimulateBurst = () => {
    const burstArc: AttackArc = {
      id: `arc-burst-${Date.now().toString().slice(-4)}`,
      sourceNodeId: 'buc',
      targetNodeId: 'jnb',
      sourceCoords: [26.1025, 44.4268],
      targetCoords: [28.0473, -26.2041],
      plane: 'SS7',
      protocol: 'MAP_InsertSubscriberData (Rogue Roaming Vector Injection)',
      payloadSnippet: 'TCAP_Begin: GT=+40722000889 imsi=639029102830114 vlr=+2783000001',
      ingressRate: '68,200 msgs/s',
      velocityKmH: 720000,
      lossRiskPerMinUsd: 4200,
      threatScore: 99,
      severity: 'CRITICAL',
      urgencyLabel: 'IMMEDIATE STP/HLR CRITICAL INTERVENE',
      status: 'ACTIVE',
      mitigationAction: 'STP_GT_BLOCK'
    };
    setArcs((prev) => [burstArc, ...prev]);
    setSelectedArc(burstArc);

    // Spike Southern and East African threat density points
    setThreatPoints((prev) =>
      prev.map((pt) => {
        if (pt.region === 'SOUTHERN_AFRICA' || pt.region === 'EAST_AFRICA') {
          return {
            ...pt,
            weight: Math.min(100, pt.weight + 25),
            eventsPerSec: Math.floor(pt.eventsPerSec * 1.35)
          };
        }
        return pt;
      })
    );

    setMitigationFeedback('ANOMALY BURST: New Critical (TI 99/100) SS7 vector injected arriving at Johannesburg STP!');
  };

  // Deck.gl Layers configuration including HeatmapLayer & Dynamic Severity Highlight/Hide
  const layers = useMemo(() => {
    const activeLayers: any[] = [];

    // 1. Deck.gl HeatmapLayer: Regional Threat Density across Africa
    if (showThreatDensity) {
      const heatmapLayer = new HeatmapLayer({
        id: 'african-threat-density-heatmap',
        data: filteredThreatPoints,
        getPosition: (d: ThreatDensityPoint) => d.coordinates,
        getWeight: (d: ThreatDensityPoint) => d.weight,
        radiusPixels: heatmapRadius,
        intensity: heatmapIntensity,
        threshold: 0.05,
        colorRange: [
          [14, 165, 233, 40],   // Light Sky Blue (low density)
          [59, 130, 246, 120],  // Blue (moderate density)
          [234, 179, 8, 180],   // Amber (elevated intensity)
          [249, 115, 22, 220],  // Orange (severe attack volume)
          [239, 68, 68, 255],   // Crimson (critical threat hotspot)
          [168, 85, 247, 255]   // Violet/Purple (apex cyber intensity)
        ],
        opacity: 0.72,
        visible: showThreatDensity
      });
      activeLayers.push(heatmapLayer);
    }

    // 2. Arc Layer for active carrier threat trajectories with Severity Dynamic Highlighting / Dimming
    const arcLayer = new ArcLayer({
      id: 'attack-arcs-layer',
      data: filteredArcs,
      getSourcePosition: (d: AttackArc) => d.sourceCoords,
      getTargetPosition: (d: AttackArc) => d.targetCoords,
      getSourceColor: (d: AttackArc) => {
        if (d.status === 'MITIGATED') return [16, 185, 129, 120]; // Emerald mitigated
        
        // If Highlight mode is on and this arc is not the selected severity, dim it
        const isSelectedSeverity = selectedSeverity === 'ALL' || d.severity === selectedSeverity;
        if (!isSelectedSeverity && severityFilterMode === 'HIGHLIGHT') {
          return [148, 163, 184, 30]; // Dimmed slate with low alpha
        }

        // Color based on urgency/severity theme
        const color = SEVERITY_CONFIG[d.severity]?.color || PLANE_COLORS[d.plane] || [239, 68, 68];
        return [...color, 210];
      },
      getTargetColor: (d: AttackArc) => {
        if (d.status === 'MITIGATED') return [16, 185, 129, 240];
        
        const isSelectedSeverity = selectedSeverity === 'ALL' || d.severity === selectedSeverity;
        if (!isSelectedSeverity && severityFilterMode === 'HIGHLIGHT') {
          return [148, 163, 184, 45]; // Dimmed slate
        }

        const color = SEVERITY_CONFIG[d.severity]?.color || PLANE_COLORS[d.plane] || [239, 68, 68];
        return [...color, 255];
      },
      getWidth: (d: AttackArc) => {
        const isSelectedSeverity = selectedSeverity === 'ALL' || d.severity === selectedSeverity;
        
        if (selectedArc?.id === d.id) return 7.5;
        if (d.status === 'MITIGATED') return 2;
        
        if (!isSelectedSeverity && severityFilterMode === 'HIGHLIGHT') {
          return 1.2; // Dimmed thin line
        }

        // Highlighted width based on urgency
        if (d.severity === 'CRITICAL') return 5.5;
        if (d.severity === 'HIGH') return 4.5;
        return 3.5;
      },
      pickable: true,
      onClick: (info) => {
        if (info.object) {
          setSelectedArc(info.object as AttackArc);
          setSelectedNode(null);
          setSelectedDensityPoint(null);
        }
      }
    });
    activeLayers.push(arcLayer);

    // 3. Scatterplot Layer for Carrier Nodes
    const nodesLayer = new ScatterplotLayer({
      id: 'carrier-nodes-layer',
      data: CARRIER_NODES,
      getPosition: (d: CarrierNode) => d.coordinates,
      getFillColor: (d: CarrierNode) => {
        if (d.type === 'SOVEREIGN_HUB') return [255, 255, 255, 245];
        if (d.type === 'SUSPECT_PEER') return [239, 68, 68, 245];
        return [34, 197, 94, 210];
      },
      getLineColor: [0, 0, 0, 255],
      getLineWidth: 2,
      stroked: true,
      getRadius: (d: CarrierNode) => (d.type === 'SOVEREIGN_HUB' ? 140000 : 90000),
      radiusMinPixels: 6,
      radiusMaxPixels: 18,
      pickable: true,
      onClick: (info) => {
        if (info.object) {
          setSelectedNode(info.object as CarrierNode);
          setSelectedDensityPoint(null);
        }
      }
    });
    activeLayers.push(nodesLayer);

    // 4. Text Layer for Gateway Node Labels
    const textLayer = new TextLayer({
      id: 'carrier-nodes-text',
      data: CARRIER_NODES,
      getPosition: (d: CarrierNode) => d.coordinates,
      getText: (d: CarrierNode) => d.name.split(' ')[0],
      getSize: 11,
      getColor: [255, 255, 255, 230],
      getAngle: 0,
      getTextAnchor: 'start',
      getAlignmentBaseline: 'center',
      getPixelOffset: [14, 0],
      fontFamily: 'monospace'
    });
    activeLayers.push(textLayer);

    return activeLayers;
  }, [
    filteredArcs,
    selectedArc,
    showThreatDensity,
    filteredThreatPoints,
    heatmapRadius,
    heatmapIntensity,
    selectedSeverity,
    severityFilterMode
  ]);

  return (
    <div className="space-y-4">
      {/* Top Threat HUD Bar */}
      <div className="p-4 bg-black text-white border border-black flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              DECK.GL GEOSPATIAL THREAT INTELLIGENCE &amp; CARRIER DEFENSE
            </h3>
            <span className="text-xs text-white/50 font-mono">
              · GSMA FS.11/19 &amp; Dynamic Urgency Scoring Engine
            </span>
          </div>
          <p className="text-xs text-white/70 font-mono">
            Sub-second attack arc visualization, regional HeatmapLayer intensity, and threat score severity classification.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
          <div className="px-3 py-1.5 bg-zinc-900 border border-white/10">
            <div className="text-white/50 text-[10px]">TOTAL THREAT DENSITY</div>
            <div className="text-amber-400 font-bold tabular-nums text-sm">
              {(regionalMetrics.totalThreatEvents / 1000).toFixed(1)}k eps
            </div>
          </div>
          <div className="px-3 py-1.5 bg-zinc-900 border border-white/10">
            <div className="text-white/50 text-[10px]">ACTIVE ARCS</div>
            <div className="text-red-400 font-bold tabular-nums text-sm">{activeCount} INGRESSING</div>
          </div>
          <div className="px-3 py-1.5 bg-zinc-900 border border-white/10">
            <div className="text-white/50 text-[10px]">MITIGATED INLINE</div>
            <div className="text-emerald-400 font-bold tabular-nums text-sm">{mitigatedCount} BLOCKED</div>
          </div>
          <div className="px-3 py-1.5 bg-zinc-900 border border-white/10">
            <div className="text-white/50 text-[10px]">LOSS RATE</div>
            <div className="text-amber-400 font-bold tabular-nums text-sm">
              ${totalFinancialRisk.toLocaleString()}/min
            </div>
          </div>
        </div>
      </div>

      {/* SEVERITY FILTER & COLOR-CODED URGENCY LEGEND BAR */}
      <div className="p-3 bg-zinc-900 text-white border border-black/20 font-mono text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Severity Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-white/70 font-bold text-xs uppercase mr-1">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span>Severity Filter:</span>
            </div>

            {/* Severity Tier Selector */}
            <div className="flex items-center gap-1 bg-black/60 p-1 border border-white/10">
              <button
                onClick={() => setSelectedSeverity('ALL')}
                className={`px-2.5 py-1 text-xs uppercase cursor-pointer transition-colors ${
                  selectedSeverity === 'ALL'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                All Urgencies ({severityCounts.ALL})
              </button>

              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as ThreatSeverity[]).map((sev) => {
                const config = SEVERITY_CONFIG[sev];
                const count = severityCounts[sev];
                const isSelected = selectedSeverity === sev;

                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 text-xs uppercase cursor-pointer flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? `${config.badgeBg} text-white font-bold border-white`
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: config.hex }}
                    />
                    <span>{config.label}</span>
                    <span className="text-[10px] opacity-80 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Display Mode Toggle: HIGHLIGHT vs HIDE */}
            <div className="flex items-center gap-1 ml-2">
              <span className="text-white/50 text-[10px] uppercase">Display Mode:</span>
              <button
                onClick={() =>
                  setSeverityFilterMode(
                    severityFilterMode === 'HIGHLIGHT' ? 'HIDE' : 'HIGHLIGHT'
                  )
                }
                className={`px-2.5 py-1 text-xs uppercase cursor-pointer flex items-center gap-1.5 border transition-colors ${
                  severityFilterMode === 'HIGHLIGHT'
                    ? 'bg-zinc-800 text-amber-300 border-amber-500/50'
                    : 'bg-zinc-800 text-emerald-300 border-emerald-500/50'
                }`}
                title="Toggle between highlighting matching arcs (dimming others) or strictly hiding non-matching arcs"
              >
                {severityFilterMode === 'HIGHLIGHT' ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mode: Highlight &amp; Dim</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mode: Hide Non-Matching</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Status Indicator */}
          <div className="text-[11px] text-white/60">
            {selectedSeverity === 'ALL' ? (
              <span>Showing all 8 threat vectors across all score bands</span>
            ) : (
              <span>
                Active Filter: <strong className="text-white">{selectedSeverity}</strong> ({SEVERITY_CONFIG[selectedSeverity].scoreRange}) ·{' '}
                {severityFilterMode === 'HIGHLIGHT' ? 'Non-matching arcs dimmed' : 'Non-matching arcs hidden'}
              </span>
            )}
          </div>
        </div>

        {/* COLOR-CODED URGENCY LEGEND STRIP */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as ThreatSeverity[]).map((sev) => {
            const config = SEVERITY_CONFIG[sev];
            const isSelected = selectedSeverity === sev;

            return (
              <div
                key={sev}
                onClick={() => setSelectedSeverity(isSelected ? 'ALL' : sev)}
                className={`p-2 border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white'
                    : 'bg-black/40 border-white/10 hover:border-white/30'
                }`}
                title={`Click to filter by ${config.label} urgency`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: config.hex }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white uppercase text-xs">{config.label}</span>
                      <span className="text-[10px] text-white/50">{config.scoreRange}</span>
                    </div>
                    <div className="text-[10px] text-white/60 truncate">{config.urgencyText}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white/10 text-white/80 border border-white/10">
                    {config.slaThreshold}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer Controls Bar: Threat Density Toggle, Radius, Regions, and Arcs Filter */}
      <div className="p-3 bg-zinc-50 border border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Deck.gl HeatmapLayer Toggle */}
          <button
            onClick={() => setShowThreatDensity(!showThreatDensity)}
            className={`px-3 py-1 text-xs uppercase cursor-pointer border flex items-center gap-1.5 transition-colors ${
              showThreatDensity
                ? 'bg-amber-600 text-white border-amber-600 font-bold'
                : 'bg-white text-black/70 border-black/20 hover:border-black/50'
            }`}
            title="Toggle Deck.gl HeatmapLayer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Threat Density (Heatmap): {showThreatDensity ? 'ON' : 'OFF'}</span>
          </button>

          {/* Heatmap Radius Selector */}
          {showThreatDensity && (
            <div className="flex items-center gap-1 bg-white border border-black/15 px-2 py-0.5">
              <span className="text-[10px] text-black/50 uppercase">Radius:</span>
              {[30, 45, 65].map((rad) => (
                <button
                  key={rad}
                  onClick={() => setHeatmapRadius(rad)}
                  className={`px-1.5 py-0.5 text-[10px] cursor-pointer ${
                    heatmapRadius === rad
                      ? 'bg-black text-white font-bold'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  {rad}px
                </button>
              ))}
            </div>
          )}

          {/* Regional Preset Navigation */}
          <div className="flex items-center gap-1 ml-1">
            <span className="text-black/50 text-[10px] uppercase flex items-center gap-1">
              <Globe className="w-3 h-3" /> Region:
            </span>
            {(['ALL', 'EAST_AFRICA', 'WEST_AFRICA', 'SOUTHERN_AFRICA', 'NORTH_AFRICA'] as AfricanRegion[]).map((reg) => (
              <button
                key={reg}
                onClick={() => handleJumpToRegion(reg)}
                className={`px-2 py-0.5 text-[10px] uppercase cursor-pointer border transition-colors ${
                  selectedRegion === reg
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-black/70 border-black/10 hover:border-black/40'
                }`}
              >
                {reg === 'ALL'
                  ? 'All Africa'
                  : reg.replace('_AFRICA', '').toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Threat Plane Filter Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-black/50 text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Plane:
          </span>
          {(['ALL', 'SS7', 'DIAMETER', 'SMS', 'GTP_U', 'VOICE'] as ThreatPlane[]).map((plane) => (
            <button
              key={plane}
              onClick={() => setSelectedPlane(plane)}
              className={`px-2 py-0.5 text-xs uppercase cursor-pointer border transition-colors ${
                selectedPlane === plane
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black/70 border-black/10 hover:border-black/40'
              }`}
            >
              {plane === 'ALL' ? 'All' : plane.replace('_', '-')}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateBurst}
            className="border-black text-black hover:bg-black hover:text-white text-xs cursor-pointer font-mono py-1"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-red-600" />
            Inject Attack Burst
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetMitigations}
            className="border-black/30 text-black/70 hover:text-black hover:border-black text-xs cursor-pointer font-mono py-1"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Operational Feedback Banner */}
      {mitigationFeedback && (
        <div className="p-3 bg-zinc-900 text-white font-mono text-xs border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{mitigationFeedback}</span>
          </div>
          <button
            onClick={() => setMitigationFeedback(null)}
            className="text-white/50 hover:text-white text-xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Geospatial Main Canvas & Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Deck.gl Viewport Container (2 Cols) */}
        <div className="lg:col-span-2 relative h-[600px] bg-black border border-black overflow-hidden select-none">
          {/* Deck.gl Canvas */}
          <DeckGL
            viewState={viewState}
            onViewStateChange={(e) => setViewState(e.viewState as any)}
            controller={true}
            layers={layers}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />

          {/* Canvas HUD Overlay: Carrier Topology & Legend */}
          <div className="absolute top-3 left-3 bg-black/85 border border-white/20 p-2.5 text-white font-mono text-[11px] pointer-events-none space-y-1">
            <div className="text-white/50 text-[9px] uppercase">CARRIER TOPOLOGY</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-black inline-block" />
              <span>Sovereign Gateway (STP / Core)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              <span>Transit IXP / Subsea Landing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>Suspect Peer GT Aggregator</span>
            </div>
          </div>

          {/* Active Severity Badge Overlay */}
          {selectedSeverity !== 'ALL' && (
            <div className="absolute top-3 left-64 bg-black/85 border border-white/20 px-3 py-1.5 text-white font-mono text-[10px] pointer-events-none flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: SEVERITY_CONFIG[selectedSeverity].hex }}
              />
              <span>
                FILTER: <strong className="text-white">{selectedSeverity}</strong> ({severityFilterMode})
              </span>
            </div>
          )}

          {/* Threat Density Heatmap Legend Overlay */}
          {showThreatDensity && (
            <div className="absolute top-3 right-3 bg-black/85 border border-white/20 p-2.5 text-white font-mono text-[10px] pointer-events-none space-y-1.5 max-w-[220px]">
              <div className="flex items-center justify-between text-white/50 text-[9px] uppercase">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> THREAT DENSITY HEATMAP
                </span>
                <span>DECK.GL</span>
              </div>
              <div className="h-2 w-full rounded-sm bg-gradient-to-r from-sky-400 via-amber-400 via-orange-500 via-red-500 to-purple-600" />
              <div className="flex justify-between text-[9px] text-white/70">
                <span>Low (&lt; 20k eps)</span>
                <span>Severe</span>
                <span className="text-purple-300 font-bold">Critical Apex</span>
              </div>
            </div>
          )}

          {/* Regional Summary Strip across bottom */}
          <div className="absolute bottom-3 left-3 right-28 bg-black/85 border border-white/20 px-3 py-2 text-white font-mono text-[10px] pointer-events-none flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-4 shrink-0">
              <div>
                <span className="text-white/50">East Africa: </span>
                <strong className="text-amber-400 font-bold tabular-nums">
                  {(regionalMetrics.eastTotal / 1000).toFixed(1)}k eps
                </strong>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-white/50">West Africa: </span>
                <strong className="text-red-400 font-bold tabular-nums">
                  {(regionalMetrics.westTotal / 1000).toFixed(1)}k eps
                </strong>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-white/50">Southern Tier: </span>
                <strong className="text-purple-400 font-bold tabular-nums">
                  {(regionalMetrics.southTotal / 1000).toFixed(1)}k eps
                </strong>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-white/50">North Africa: </span>
                <strong className="text-amber-300 font-bold tabular-nums">
                  {(regionalMetrics.northTotal / 1000).toFixed(1)}k eps
                </strong>
              </div>
            </div>
          </div>

          {/* Zoom & Reset View Controller */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 p-1 border border-white/20">
            <button
              onClick={() => setViewState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.5, 6) }))}
              className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 text-xs font-mono cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setViewState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.5, 1) }))}
              className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 text-xs font-mono cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() =>
                setViewState({
                  longitude: 21.0,
                  latitude: 5.0,
                  zoom: 2.4,
                  pitch: 32,
                  bearing: 0
                })
              }
              className="px-2 h-7 flex items-center justify-center text-white hover:bg-white/20 text-[10px] font-mono cursor-pointer"
              title="Reset Continental African View"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Inspection & Mitigation Drawer (1 Col) */}
        <div className="border border-black bg-white flex flex-col justify-between h-[600px] overflow-y-auto font-mono text-xs">
          {/* Selected Arc Dossier */}
          {selectedArc && (
            <div className="p-4 space-y-4">
              <div className="border-b border-black/10 pb-3">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    {/* Severity Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold text-white uppercase ${
                        SEVERITY_CONFIG[selectedArc.severity]?.badgeBg || 'bg-black'
                      }`}
                    >
                      {selectedArc.severity} · TI {selectedArc.threatScore}/100
                    </span>

                    {/* Threat Plane Badge */}
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold text-white uppercase ${
                        selectedArc.plane === 'SS7'
                          ? 'bg-red-800'
                          : selectedArc.plane === 'DIAMETER'
                          ? 'bg-amber-800'
                          : selectedArc.plane === 'SMS'
                          ? 'bg-purple-800'
                          : selectedArc.plane === 'GTP_U'
                          ? 'bg-cyan-800'
                          : 'bg-blue-800'
                      }`}
                    >
                      {selectedArc.plane}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                      selectedArc.status === 'MITIGATED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-500'
                        : 'bg-red-100 text-red-800 border border-red-500'
                    }`}
                  >
                    {selectedArc.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-black mt-2">
                  {selectedArc.sourceNodeId.toUpperCase()} &rarr; {selectedArc.targetNodeId.toUpperCase()}
                </h4>
                <div className="text-black/60 text-[11px] mt-0.5">{selectedArc.protocol}</div>
                <div className="text-[10px] font-bold text-red-600 mt-1 uppercase">
                  {selectedArc.urgencyLabel}
                </div>
              </div>

              {/* Threat Intelligence Metrics Strip */}
              <div className="space-y-2 bg-zinc-50 p-3 border border-black/10 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-black/50">Threat Intel Score:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-2 bg-zinc-200 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${selectedArc.threatScore}%`,
                          backgroundColor: SEVERITY_CONFIG[selectedArc.severity]?.hex || '#ef4444'
                        }}
                      />
                    </div>
                    <span className="font-bold tabular-nums text-black">{selectedArc.threatScore}/100</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Ingress Rate:</span>
                  <span className="text-black font-bold tabular-nums">{selectedArc.ingressRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Calculated Velocity:</span>
                  <span className="text-red-600 font-bold tabular-nums">
                    {selectedArc.velocityKmH.toLocaleString()} km/h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Fraud Risk Rate:</span>
                  <span className="text-amber-600 font-bold tabular-nums">
                    ${selectedArc.lossRiskPerMinUsd.toLocaleString()}/min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Enforcement SLA:</span>
                  <span className="text-black font-bold">
                    {SEVERITY_CONFIG[selectedArc.severity]?.slaThreshold || '< 2.0s'}
                  </span>
                </div>
              </div>

              {/* Payload Breakdown */}
              <div className="space-y-1">
                <div className="text-[10px] text-black/50 uppercase">Extracted Signaling Payload</div>
                <div className="p-2.5 bg-zinc-950 text-emerald-400 font-mono text-[10px] break-all border border-black/20">
                  {selectedArc.payloadSnippet}
                </div>
              </div>

              {/* Mitigation Logs if Mitigated */}
              {selectedArc.mitigationLogs && selectedArc.mitigationLogs.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] text-black/50 uppercase">Mitigation Audit Log</div>
                  <div className="p-2.5 bg-zinc-900 text-white font-mono text-[10px] space-y-1 border border-black/20">
                    {selectedArc.mitigationLogs.map((log, idx) => (
                      <div key={idx} className={log.includes('Verified') ? 'text-emerald-400 font-bold' : 'text-white/80'}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Actions */}
              <div className="pt-2 border-t border-black/10 space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleExecuteMitigation(selectedArc)}
                  disabled={selectedArc.status === 'MITIGATED' || executingMitigationId !== null}
                  className="w-full bg-black text-white hover:bg-zinc-800 text-xs py-2 font-mono flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  {executingMitigationId === selectedArc.id
                    ? 'Deploying Southbound Rule...'
                    : selectedArc.status === 'MITIGATED'
                    ? 'Vector Neutralized (< 1.8s SLA)'
                    : `Execute ${selectedArc.mitigationAction}`}
                </Button>

                {selectedArc.status === 'MITIGATED' && (
                  <div className="text-center text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enforced at STP / IXP Gateway Ring Buffer
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Node Dossier (when clicking a node) */}
          {selectedNode && (
            <div className="p-4 space-y-4">
              <div className="border-b border-black/10 pb-3 flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-black uppercase">
                    {selectedNode.type}
                  </span>
                  <h4 className="text-sm font-bold text-black mt-2">{selectedNode.name}</h4>
                  <div className="text-black/60 text-[11px]">{selectedNode.country} · {selectedNode.carrier}</div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-black/40 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 bg-zinc-50 p-3 border border-black/10 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-black/50">Coordinates:</span>
                  <span className="text-black font-mono">
                    [{selectedNode.coordinates[1].toFixed(3)}, {selectedNode.coordinates[0].toFixed(3)}]
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Transit Capacity:</span>
                  <span className="text-black font-bold">{selectedNode.peeringCapacityGbps} Gbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Scrubber State:</span>
                  <span
                    className={`font-bold ${
                      selectedNode.scrubberStatus === 'ACTIVE'
                        ? 'text-emerald-600'
                        : selectedNode.scrubberStatus === 'BYPASS'
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {selectedNode.scrubberStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Active Attacks:</span>
                  <span className="text-red-600 font-bold">{selectedNode.activeAttacksCount} Vectors</span>
                </div>
              </div>

              <div className="pt-2 border-t border-black/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMitigationFeedback(`Peering isolation initiated for node ${selectedNode.name}.`)
                  }
                  className="w-full border-black text-black hover:bg-black hover:text-white text-xs cursor-pointer"
                >
                  Isolate Interconnect Trunk
                </Button>
              </div>
            </div>
          )}

          {/* Selected Regional Threat Point Dossier */}
          {selectedDensityPoint && (
            <div className="p-4 space-y-4">
              <div className="border-b border-black/10 pb-3 flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-amber-600 uppercase">
                    REGIONAL THREAT HOTSPOT
                  </span>
                  <h4 className="text-sm font-bold text-black mt-2">{selectedDensityPoint.name}</h4>
                  <div className="text-black/60 text-[11px]">{selectedDensityPoint.country} · {selectedDensityPoint.region}</div>
                </div>
                <button
                  onClick={() => setSelectedDensityPoint(null)}
                  className="text-black/40 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 bg-zinc-50 p-3 border border-black/10 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-black/50">Event Ingress Velocity:</span>
                  <span className="text-red-600 font-bold tabular-nums">{selectedDensityPoint.eventsPerSec.toLocaleString()} eps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Anomaly Intensity:</span>
                  <span className="text-amber-600 font-bold">{selectedDensityPoint.weight}/100 ({selectedDensityPoint.anomalyRatio})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">Dominant Protocol Exploit:</span>
                  <span className="text-black font-bold">{selectedDensityPoint.dominantThreat}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vector Selector Footer Filtered by Severity */}
          <div className="p-3 bg-zinc-50 border-t border-black/10">
            <div className="text-[10px] text-black/50 uppercase mb-2 flex items-center justify-between">
              <span>Carrier Threat Vectors:</span>
              <span className="text-black font-bold">
                {filteredArcs.length} shown · {selectedSeverity !== 'ALL' ? selectedSeverity : 'All Tiers'}
              </span>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredArcs.map((arc) => {
                const config = SEVERITY_CONFIG[arc.severity];
                const isSelected = selectedArc?.id === arc.id;
                const isDimmed = selectedSeverity !== 'ALL' && arc.severity !== selectedSeverity && severityFilterMode === 'HIGHLIGHT';

                return (
                  <button
                    key={arc.id}
                    onClick={() => {
                      setSelectedArc(arc);
                      setSelectedNode(null);
                      setSelectedDensityPoint(null);
                    }}
                    className={`w-full text-left p-2 border text-[11px] flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black font-bold'
                        : isDimmed
                        ? 'bg-zinc-100 text-black/40 border-black/5 opacity-60'
                        : 'bg-white text-black/80 border-black/10 hover:border-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            arc.status === 'MITIGATED'
                              ? '#10b981'
                              : config?.hex || '#ef4444'
                        }}
                      />
                      <span className="truncate">
                        {arc.sourceNodeId.toUpperCase()} &rarr; {arc.targetNodeId.toUpperCase()}
                      </span>
                      <span
                        className="text-[9px] px-1 py-0.2 rounded-xs"
                        style={{
                          backgroundColor: `${config?.hex}20`,
                          color: config?.hex
                        }}
                      >
                        {arc.threatScore}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums opacity-80 shrink-0">
                      {arc.status === 'MITIGATED' ? 'BLOCKED' : arc.severity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
