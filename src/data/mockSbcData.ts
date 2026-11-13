import {
  SbcPointOfPresence,
  EnterprisePbxCredential,
  SipCallTrace,
  SbcHeaderRule,
  SbcGlobalAcl,
  SbcAiAlert
} from '../types/sbc';

export const SBC_ANYCAST_IPS = [
  '102.134.88.10',
  '102.134.88.20',
  '102.134.88.30'
];

export const INITIAL_POPS: SbcPointOfPresence[] = [
  {
    code: 'LOS',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'West Africa',
    flag: '🇳🇬',
    anycastIp: '102.134.88.10',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 7420,
    targetCps: 10000,
    activeChannels: 48920,
    maxChannels: 80000,
    registrationsCount: 14200,
    signalingLatencyMs: 38,
    mediaLatencyMs: 24,
    cpuPercent: 54,
    memoryPercent: 61,
    error5xxRate: 0.012,
    kamailioPods: 12,
    rtpEngineNodes: 8,
    freeSwitchNodes: 6
  },
  {
    code: 'NBO',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'East Africa',
    flag: '🇰🇪',
    anycastIp: '102.134.88.20',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 6180,
    targetCps: 10000,
    activeChannels: 39400,
    maxChannels: 75000,
    registrationsCount: 11840,
    signalingLatencyMs: 42,
    mediaLatencyMs: 28,
    cpuPercent: 48,
    memoryPercent: 57,
    error5xxRate: 0.015,
    kamailioPods: 10,
    rtpEngineNodes: 7,
    freeSwitchNodes: 5
  },
  {
    code: 'JNB',
    city: 'Johannesburg',
    country: 'South Africa',
    region: 'Southern Africa',
    flag: '🇿🇦',
    anycastIp: '102.134.88.30',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 8350,
    targetCps: 10000,
    activeChannels: 54200,
    maxChannels: 90000,
    registrationsCount: 18230,
    signalingLatencyMs: 29,
    mediaLatencyMs: 18,
    cpuPercent: 62,
    memoryPercent: 69,
    error5xxRate: 0.008,
    kamailioPods: 14,
    rtpEngineNodes: 10,
    freeSwitchNodes: 8
  },
  {
    code: 'CAI',
    city: 'Cairo',
    country: 'Egypt',
    region: 'North Africa',
    flag: '🇪🇬',
    anycastIp: '102.134.88.10',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 4210,
    targetCps: 10000,
    activeChannels: 27100,
    maxChannels: 60000,
    registrationsCount: 8400,
    signalingLatencyMs: 51,
    mediaLatencyMs: 34,
    cpuPercent: 39,
    memoryPercent: 45,
    error5xxRate: 0.021,
    kamailioPods: 8,
    rtpEngineNodes: 6,
    freeSwitchNodes: 4
  },
  {
    code: 'DKR',
    city: 'Dakar',
    country: 'Senegal',
    region: 'West Africa',
    flag: '🇸🇳',
    anycastIp: '102.134.88.20',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 3450,
    targetCps: 10000,
    activeChannels: 19800,
    maxChannels: 50000,
    registrationsCount: 6100,
    signalingLatencyMs: 46,
    mediaLatencyMs: 31,
    cpuPercent: 34,
    memoryPercent: 41,
    error5xxRate: 0.018,
    kamailioPods: 6,
    rtpEngineNodes: 5,
    freeSwitchNodes: 4
  },
  {
    code: 'FIH',
    city: 'Kinshasa',
    country: 'DR Congo',
    region: 'Central Africa',
    flag: '🇨🇩',
    anycastIp: '102.134.88.30',
    bgpAsn: 37105,
    status: 'healthy',
    currentCps: 2900,
    targetCps: 10000,
    activeChannels: 16400,
    maxChannels: 45000,
    registrationsCount: 4800,
    signalingLatencyMs: 68,
    mediaLatencyMs: 44,
    cpuPercent: 42,
    memoryPercent: 49,
    error5xxRate: 0.025,
    kamailioPods: 6,
    rtpEngineNodes: 5,
    freeSwitchNodes: 3
  }
];

export const INITIAL_PBX_CREDENTIALS: EnterprisePbxCredential[] = [
  {
    id: 'pbx-zenith-ng',
    companyName: 'Zenith Commercial Bank PLC',
    sipDomain: 'sip.mandela.africa',
    username: 'zenith_core_pbx_01',
    realm: 'mandela.africa',
    authMethod: 'digest',
    whitelistedIps: ['197.210.64.12', '197.210.64.13'],
    assignedDids: ['+23412345678', '+23412345679', '+23412345680'],
    maxCps: 120,
    maxConcurrentCalls: 1500,
    tlsEnabled: true,
    srtpEnabled: true,
    registeredPop: 'LOS',
    registrationStatus: 'registered',
    lastRegisterTime: '2026-10-10 16:10:04 UTC',
    sourceIp: '197.210.64.12:5061',
    userAgent: 'Asterisk PBX 21.4.0-certified / FreePBX'
  },
  {
    id: 'pbx-safaricom-ke',
    companyName: 'Kenya Enterprise Logistics Ltd',
    sipDomain: 'sip.mandela.africa',
    username: 'ke_logistics_trunk',
    realm: 'mandela.africa',
    authMethod: 'ip_whitelist',
    whitelistedIps: ['105.160.22.45'],
    assignedDids: ['+254722550119', '+25420998877'],
    maxCps: 60,
    maxConcurrentCalls: 600,
    tlsEnabled: true,
    srtpEnabled: true,
    registeredPop: 'NBO',
    registrationStatus: 'registered',
    lastRegisterTime: '2026-10-10 16:11:15 UTC',
    sourceIp: '105.160.22.45:5061',
    userAgent: 'Cisco-Unified-CM/14.0'
  },
  {
    id: 'pbx-mtn-gh',
    companyName: 'Accra FinTech Hub & PayGate',
    sipDomain: 'sip.mandela.africa',
    username: 'accra_fintech_sbc',
    realm: 'mandela.africa',
    authMethod: 'digest',
    whitelistedIps: ['154.160.8.90'],
    assignedDids: ['+233244123890'],
    maxCps: 45,
    maxConcurrentCalls: 400,
    tlsEnabled: true,
    srtpEnabled: true,
    registeredPop: 'LOS',
    registrationStatus: 'registered',
    lastRegisterTime: '2026-10-10 16:08:42 UTC',
    sourceIp: '154.160.8.90:5061',
    userAgent: 'FreeSWITCH-mod_sofia/1.10.10'
  }
];

export const INITIAL_CALL_TRACES: SipCallTrace[] = [
  {
    id: 'trace-call-01',
    callId: 'c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12',
    popCode: 'LOS',
    callerMsisdn: '+2348039876543',
    calleeMsisdn: '+23412345678',
    direction: 'inbound',
    status: 'completed',
    sipCode: 200,
    sipReason: 'OK',
    durationSec: 142,
    mosScore: 4.4,
    mediaBypass: true,
    codec: 'Opus 48kHz (SRTP)',
    paiHeader: '<sip:+2348039876543@sip.mandela.africa;user=phone>',
    privacyHeader: 'none',
    messages: [
      {
        id: 'msg-01',
        timestamp: '16:12:01.104',
        relativeTimeMs: 0,
        fromEntity: 'Enterprise PBX',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'INVITE sip:+23412345678@sip.mandela.africa SIP/2.0',
        protocol: 'SIP/2.0/TLS',
        cseq: '101 INVITE',
        rawHeaders: `INVITE sip:+23412345678@sip.mandela.africa:5061;transport=tls SIP/2.0\r\nVia: SIP/2.0/TLS 197.210.64.12:5061;branch=z9hG4bK776asdh8\r\nMax-Forwards: 69\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 101 INVITE\r\nContact: <sip:zenith_core_pbx_01@197.210.64.12:5061;transport=tls>\r\nUser-Agent: Asterisk PBX 21.4.0\r\nP-Asserted-Identity: <sip:+2348039876543@sip.mandela.africa>\r\nContent-Type: application/sdp\r\nContent-Length: 285`,
        sdpBody: `v=0\r\no=asterisk 161201 1 IN IP4 197.210.64.12\r\ns=MandelaSession\r\nc=IN IP4 197.210.64.12\r\nt=0 0\r\nm=audio 16420 RTP/SAVPF 104 9 0 8 101\r\na=rtpmap:104 opus/48000/2\r\na=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:W1MjxzY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA=`
      },
      {
        id: 'msg-02',
        timestamp: '16:12:01.108',
        relativeTimeMs: 4,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'Enterprise PBX',
        methodOrStatus: 'SIP/2.0 100 Trying',
        protocol: 'SIP/2.0/TLS',
        cseq: '101 INVITE',
        rawHeaders: `SIP/2.0 100 Trying\r\nVia: SIP/2.0/TLS 197.210.64.12:5061;branch=z9hG4bK776asdh8;received=197.210.64.12\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 101 INVITE\r\nServer: Mandela-Kamailio-SBC/5.8.2-LOS\r\nContent-Length: 0`
      },
      {
        id: 'msg-03',
        timestamp: '16:12:01.112',
        relativeTimeMs: 8,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'RTPEngine / FreeSWITCH',
        methodOrStatus: 'INVITE (Topology Hidden + RTPEngine NG ng_offer)',
        protocol: 'SIP/2.0/UDP',
        cseq: '101 INVITE',
        rawHeaders: `INVITE sip:+23412345678@10.240.10.15:5060 SIP/2.0\r\nRecord-Route: <sip:10.240.10.1:5060;lr;mandela_sbc=los>\r\nVia: SIP/2.0/UDP 10.240.10.1:5060;branch=z9hG4bKlos_disp_1\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nX-Mandela-Tenant: zenith_core_pbx_01\r\nX-Mandela-PoP: LOS-LAGOS-BGP37105`
      },
      {
        id: 'msg-04',
        timestamp: '16:12:01.240',
        relativeTimeMs: 136,
        fromEntity: 'Carrier PSTN',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'SIP/2.0 180 Ringing',
        protocol: 'SIP/2.0/UDP',
        cseq: '101 INVITE',
        rawHeaders: `SIP/2.0 180 Ringing\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>;tag=mno9921\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 101 INVITE\r\nContact: <sip:+23412345678@10.240.10.15:5060>`
      },
      {
        id: 'msg-05',
        timestamp: '16:12:01.245',
        relativeTimeMs: 141,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'Enterprise PBX',
        methodOrStatus: 'SIP/2.0 180 Ringing',
        protocol: 'SIP/2.0/TLS',
        cseq: '101 INVITE',
        rawHeaders: `SIP/2.0 180 Ringing\r\nVia: SIP/2.0/TLS 197.210.64.12:5061;branch=z9hG4bK776asdh8\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>;tag=mno9921\r\nServer: Mandela-Kamailio-SBC/5.8.2-LOS`
      },
      {
        id: 'msg-06',
        timestamp: '16:12:03.410',
        relativeTimeMs: 2306,
        fromEntity: 'Carrier PSTN',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'SIP/2.0 200 OK (Call Answered)',
        protocol: 'SIP/2.0/UDP',
        cseq: '101 INVITE',
        rawHeaders: `SIP/2.0 200 OK\r\nContact: <sip:+23412345678@10.240.10.15:5060>\r\nContent-Type: application/sdp\r\nContent-Length: 260`,
        sdpBody: `v=0\r\no=mandela-media 202610 1 IN IP4 102.134.88.10\r\ns=RTPEngineRelay\r\nc=IN IP4 102.134.88.10\r\nt=0 0\r\nm=audio 32100 RTP/SAVPF 104\r\na=rtpmap:104 opus/48000/2`
      },
      {
        id: 'msg-07',
        timestamp: '16:12:03.414',
        relativeTimeMs: 2310,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'Enterprise PBX',
        methodOrStatus: 'SIP/2.0 200 OK',
        protocol: 'SIP/2.0/TLS',
        cseq: '101 INVITE',
        rawHeaders: `SIP/2.0 200 OK\r\nVia: SIP/2.0/TLS 197.210.64.12:5061;branch=z9hG4bK776asdh8\r\nFrom: <sip:+2348039876543@sip.mandela.africa>;tag=as49102\r\nTo: <sip:+23412345678@sip.mandela.africa>;tag=mno9921\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 101 INVITE\r\nContact: <sip:sbc-los@102.134.88.10:5061;transport=tls>\r\nContent-Type: application/sdp`
      },
      {
        id: 'msg-08',
        timestamp: '16:12:03.440',
        relativeTimeMs: 2336,
        fromEntity: 'Enterprise PBX',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'ACK sip:sbc-los@102.134.88.10:5061 SIP/2.0',
        protocol: 'SIP/2.0/TLS',
        cseq: '101 ACK',
        rawHeaders: `ACK sip:sbc-los@102.134.88.10:5061;transport=tls SIP/2.0\r\nVia: SIP/2.0/TLS 197.210.64.12:5061;branch=z9hG4bKack991\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 101 ACK`
      },
      {
        id: 'msg-09',
        timestamp: '16:12:03.450',
        relativeTimeMs: 2346,
        fromEntity: 'Enterprise PBX',
        toEntity: 'Carrier PSTN',
        methodOrStatus: '=== SRTP 2-WAY HIGH DEF AUDIO STREAM (Opus 48kHz, MOS 4.4) ===',
        protocol: 'RTP/SAVPF',
        cseq: 'MEDIA ACTIVE',
        rawHeaders: `SRTP session: 197.210.64.12:16420 <-> 102.134.88.10:32100 (Direct Media Bypass / RTPEngine Relay)\r\nJitter: 2.1ms · Packet Loss: 0.00% · Duration: 142s`
      },
      {
        id: 'msg-10',
        timestamp: '16:14:25.120',
        relativeTimeMs: 144016,
        fromEntity: 'Enterprise PBX',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'BYE sip:sbc-los@102.134.88.10:5061 SIP/2.0',
        protocol: 'SIP/2.0/TLS',
        cseq: '102 BYE',
        rawHeaders: `BYE sip:sbc-los@102.134.88.10:5061;transport=tls SIP/2.0\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 102 BYE\r\nReason: Q.850;cause=16;text="Normal call clearing"`
      },
      {
        id: 'msg-11',
        timestamp: '16:14:25.124',
        relativeTimeMs: 144020,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'Enterprise PBX',
        methodOrStatus: 'SIP/2.0 200 OK (Call Cleared)',
        protocol: 'SIP/2.0/TLS',
        cseq: '102 BYE',
        rawHeaders: `SIP/2.0 200 OK\r\nCall-ID: c84918e3-92f1-4a11-88fc-8f78a011@197.210.64.12\r\nCSeq: 102 BYE\r\nServer: Mandela-Kamailio-SBC/5.8.2-LOS`
      }
    ]
  },
  {
    id: 'trace-call-02',
    callId: 'fraud-spike-99a@45.142.122.9',
    popCode: 'JNB',
    callerMsisdn: '+27109988776',
    calleeMsisdn: '+231888999000',
    direction: 'outbound',
    status: 'failed',
    sipCode: 403,
    sipReason: 'Forbidden — AI Fraud Shield',
    durationSec: 0,
    mosScore: 1.0,
    mediaBypass: false,
    codec: 'None',
    messages: [
      {
        id: 'fmsg-01',
        timestamp: '16:14:02.100',
        relativeTimeMs: 0,
        fromEntity: 'Enterprise PBX',
        toEntity: 'Anycast Edge (Kamailio)',
        methodOrStatus: 'INVITE sip:+231888999000@sip.mandela.africa SIP/2.0',
        protocol: 'SIP/2.0/UDP',
        cseq: '1 INVITE',
        rawHeaders: `INVITE sip:+231888999000@sip.mandela.africa:5060 SIP/2.0\r\nVia: SIP/2.0/UDP 45.142.122.9:5060;branch=z9hG4bKbadactor\r\nUser-Agent: friendly-scanner/v3\r\nCall-ID: fraud-spike-99a@45.142.122.9\r\nFrom: <sip:100@sip.mandela.africa>;tag=f102\r\nTo: <sip:+231888999000@sip.mandela.africa>`,
        isError: true
      },
      {
        id: 'fmsg-02',
        timestamp: '16:14:02.103',
        relativeTimeMs: 3,
        fromEntity: 'Anycast Edge (Kamailio)',
        toEntity: 'Enterprise PBX',
        methodOrStatus: 'SIP/2.0 403 Forbidden (Blocked by AI Threat Intelligence)',
        protocol: 'SIP/2.0/UDP',
        cseq: '1 INVITE',
        rawHeaders: `SIP/2.0 403 Forbidden\r\nServer: Mandela-Kamailio-SBC/5.8.2-JNB\r\nWarning: 399 mandela.africa "AI-THREAT-BLOCK: Scanner User-Agent detected; IP blacklisted across 6 African PoPs"\r\nContent-Length: 0`,
        isError: true
      }
    ]
  }
];

export const INITIAL_HEADER_RULES: SbcHeaderRule[] = [
  {
    id: 'rule-topo-hide',
    name: 'Carrier Topology Hiding',
    description: 'Strips internal RFC1918 Via and Record-Route headers before delivering SIP packets to enterprise PBX or PSTN.',
    customerId: '*',
    direction: 'egress',
    headerName: 'Custom',
    action: 'strip',
    targetValue: 'Internal Via / Record-Route',
    status: 'active',
    priority: 1
  },
  {
    id: 'rule-pai-pass',
    name: 'P-Asserted-Identity Normalization',
    description: 'Validates sovereign E.164 number format and passes caller identity from verified tenant.',
    customerId: '*',
    direction: 'ingress',
    headerName: 'P-Asserted-Identity',
    action: 'pass_through',
    targetValue: 'E.164 sovereign format',
    status: 'active',
    priority: 2
  },
  {
    id: 'rule-privacy-id',
    name: 'Privacy Anonymization Rule',
    description: 'When Privacy: id is present, anonymizes From header to sip:anonymous@anonymous.invalid while retaining PAI in sovereign core.',
    customerId: '*',
    direction: 'both',
    headerName: 'Privacy',
    action: 'anonymize',
    targetValue: 'anonymous@anonymous.invalid',
    status: 'active',
    priority: 3
  },
  {
    id: 'rule-diversion',
    name: 'Call Diversion Forwarding Header',
    description: 'Injects carrier-compliant Diversion header when call forwarding is initiated by enterprise PBX.',
    customerId: '*',
    direction: 'egress',
    headerName: 'Diversion',
    action: 'prepend',
    targetValue: '<sip:$fwd_num@sip.mandela.africa>;reason=unconditional',
    status: 'active',
    priority: 4
  },
  {
    id: 'rule-tenant-tag',
    name: 'X-Mandela-Tenant Tagging',
    description: 'Attaches authenticated customer UUID and BGP PoP code for internal telemetry, billing, and Kamailio dispatcher routing.',
    customerId: '*',
    direction: 'ingress',
    headerName: 'X-Mandela-Tenant',
    action: 'overwrite',
    targetValue: '$var(customer_uuid)',
    status: 'active',
    priority: 5
  }
];

export const INITIAL_GLOBAL_ACLS: SbcGlobalAcl[] = [
  {
    id: 'acl-01',
    cidr: '45.142.122.0/24',
    action: 'block',
    reason: 'SIPvicious / Friendly-Scanner registration flood detected',
    appliedBy: 'AI Threat Shield (Auto)',
    createdAt: '2026-10-10 15:48:10 UTC',
    activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH'],
    syncStatus: 'synced_all_pops',
    matchedPacketsLastHour: 18450
  },
  {
    id: 'acl-02',
    cidr: '194.26.29.0/24',
    action: 'block',
    reason: 'Toll fraud scanner targeting high-cost premium destinations',
    appliedBy: 'SecOps (Dual Controlled)',
    createdAt: '2026-10-10 14:12:00 UTC',
    activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH'],
    syncStatus: 'synced_all_pops',
    matchedPacketsLastHour: 9230
  },
  {
    id: 'acl-03',
    cidr: '197.210.64.0/22',
    action: 'allow',
    reason: 'Zenith Bank corporate data center peering prefix',
    appliedBy: 'Enterprise Onboarding',
    createdAt: '2026-10-01 09:00:00 UTC',
    activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH'],
    syncStatus: 'synced_all_pops',
    matchedPacketsLastHour: 142090
  }
];

export const INITIAL_AI_ALERTS: SbcAiAlert[] = [
  {
    id: 'ai-alert-01',
    type: 'capacity_prediction',
    severity: 'high',
    title: 'Predicted Peak Capacity Alert — Lagos PoP',
    description: 'AI model predicts Lagos PoP will hit 88% capacity at 09:30 UTC tomorrow based on recurring banking call surges. Recommends auto-scaling 2 additional Kamailio pods in System 7 (Mandela Cloud).',
    affectedPop: 'LOS',
    suggestedAction: 'Auto-scale 2 Kamailio pods & 1 RTPEngine node in Lagos',
    actionPayload: {
      actionType: 'scale_pods',
      target: 'LOS'
    },
    timestamp: '10 mins ago',
    autoRemediated: false,
    status: 'pending'
  },
  {
    id: 'ai-alert-02',
    type: 'fraud_spike',
    severity: 'critical',
    title: 'Abnormal Toll Prefix Surge (+231 Liberia Satellite)',
    description: 'Unusual spike in INVITEs to high-rate destination +231-888-xxx from prefix 185.220.101.0/24. 420 attempts in 30 seconds.',
    affectedPop: 'JNB',
    suggestedAction: 'Push Global ACL Block 185.220.101.0/24 across all 6 PoPs',
    actionPayload: {
      actionType: 'block_ip',
      target: '185.220.101.0/24'
    },
    timestamp: '18 mins ago',
    autoRemediated: false,
    status: 'pending'
  },
  {
    id: 'ai-alert-03',
    type: 'attack_scanner',
    severity: 'medium',
    title: 'Registration Flood Mitigated — Nairobi PoP',
    description: 'Sub-second flood of 5,000 REGISTER requests with random usernames. Dynamic token bucket rate limiting engaged; source IP rate limited to 2 CPS.',
    affectedPop: 'NBO',
    suggestedAction: 'Permanent ACL block 91.240.118.42',
    actionPayload: {
      actionType: 'block_ip',
      target: '91.240.118.42/32'
    },
    timestamp: '42 mins ago',
    autoRemediated: true,
    status: 'resolved'
  }
];
