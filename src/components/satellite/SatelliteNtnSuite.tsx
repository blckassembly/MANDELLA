import React, { useState } from 'react';
import {
  Satellite,
  Radio,
  Globe2,
  Compass,
  Signal,
  WifiOff,
  Zap,
  ShieldCheck,
  RefreshCw,
  Send,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Activity,
  Terminal,
  Anchor,
  Mountain
} from 'lucide-react';
import { SatelliteTab } from '../../types/multiTenant';
import {
  Card,
  Badge,
  Button,
  StatCard,
  StatusDot,
  CodeBlock,
  SectionHeader
} from '../../design-system';

interface TeleportStation {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: string;
  frequencyBand: 'Ka-Band' | 'Ku-Band' | 'C-Band' | 'S-Band 3GPP Rel-17';
  uplinkGhz: number;
  downlinkGhz: number;
  carrierCapacityGbps: number;
  status: 'active' | 'tracking' | 'standby' | 'calibrating';
  rttMs: number;
  dopplerShiftKHz: number;
  activeBeams: number;
  connectedBirds: string[];
}

const INITIAL_TELEPORTS: TeleportStation[] = [
  {
    id: 'tp-mwembeshi-01',
    name: 'Mwembeshi Central Earth Station',
    location: 'Lusaka Province',
    country: 'Zambia',
    coordinates: '15.3400° S, 27.9500° E',
    frequencyBand: 'S-Band 3GPP Rel-17',
    uplinkGhz: 2.1,
    downlinkGhz: 2.2,
    carrierCapacityGbps: 12.5,
    status: 'active',
    rttMs: 38,
    dopplerShiftKHz: 12.4,
    activeBeams: 24,
    connectedBirds: ['LEO-AFR-01', 'LEO-AFR-04']
  },
  {
    id: 'tp-longonot-02',
    name: 'Longonot Satellite Earth Station',
    location: 'Rift Valley, Naivasha',
    country: 'Kenya',
    coordinates: '0.9080° S, 36.4670° E',
    frequencyBand: 'Ka-Band',
    uplinkGhz: 29.5,
    downlinkGhz: 19.7,
    carrierCapacityGbps: 20.0,
    status: 'active',
    rttMs: 32,
    dopplerShiftKHz: 8.1,
    activeBeams: 32,
    connectedBirds: ['LEO-AFR-02', 'GEO-PANAFR-1']
  },
  {
    id: 'tp-hart-03',
    name: 'Hartebeesthoek Space Teleport',
    location: 'Gauteng, Pretoria',
    country: 'South Africa',
    coordinates: '25.8890° S, 27.7070° E',
    frequencyBand: 'Ku-Band',
    uplinkGhz: 14.2,
    downlinkGhz: 11.9,
    carrierCapacityGbps: 40.0,
    status: 'active',
    rttMs: 29,
    dopplerShiftKHz: -14.6,
    activeBeams: 48,
    connectedBirds: ['LEO-AFR-03', 'LEO-AFR-05']
  },
  {
    id: 'tp-dakar-04',
    name: 'Dakar Atlantic Teleport Gateway',
    location: 'Cap-Vert Peninsula',
    country: 'Senegal',
    coordinates: '14.7167° N, 17.4677° W',
    frequencyBand: 'S-Band 3GPP Rel-17',
    uplinkGhz: 2.1,
    downlinkGhz: 2.2,
    carrierCapacityGbps: 15.0,
    status: 'tracking',
    rttMs: 44,
    dopplerShiftKHz: 21.0,
    activeBeams: 18,
    connectedBirds: ['LEO-AFR-06']
  }
];

interface NtnDeviceSession {
  id: string;
  msisdn: string;
  imsi: string;
  locationName: string;
  deviceCategory: '3GPP Rel-17 Smartphone' | 'Solar IoT Tracker' | 'SOS Emergency Beacon' | 'Satellite SatPhone';
  beamId: string;
  signalStrengthDbm: number;
  elevationAngleDeg: number;
  dopplerHz: number;
  jitterBufferMs: number;
  emergencySosActive: boolean;
  status: 'connected' | 'handover_pending' | 'power_save';
}

const INITIAL_NTN_SESSIONS: NtnDeviceSession[] = [
  {
    id: 'ntn-001',
    msisdn: '+254 712 990 120',
    imsi: '639029182390123',
    locationName: 'Turkana Desert Remote Basin (KE)',
    deviceCategory: '3GPP Rel-17 Smartphone',
    beamId: 'BEAM-KE-RIFT-04',
    signalStrengthDbm: -108,
    elevationAngleDeg: 62.4,
    dopplerHz: 1240,
    jitterBufferMs: 65,
    emergencySosActive: false,
    status: 'connected'
  },
  {
    id: 'ntn-002',
    msisdn: '+234 803 000 9182',
    imsi: '621200192837482',
    locationName: 'Gulf of Guinea Deep Offshore Rig 7',
    deviceCategory: 'SOS Emergency Beacon',
    beamId: 'BEAM-ATLANTIC-MARITIME-01',
    signalStrengthDbm: -99,
    elevationAngleDeg: 48.1,
    dopplerHz: -3200,
    jitterBufferMs: 82,
    emergencySosActive: true,
    status: 'connected'
  },
  {
    id: 'ntn-003',
    msisdn: '+243 998 123 445',
    imsi: '630018293847291',
    locationName: 'Kolwezi Open Pit Cobalt Mine (DRC)',
    deviceCategory: 'Solar IoT Tracker',
    beamId: 'BEAM-DRC-KATANGA-02',
    signalStrengthDbm: -112,
    elevationAngleDeg: 34.0,
    dopplerHz: 4800,
    jitterBufferMs: 110,
    emergencySosActive: false,
    status: 'handover_pending'
  }
];

interface SatelliteNtnSuiteProps {
  activeTab?: SatelliteTab;
  onSelectTab?: (tab: SatelliteTab) => void;
}

export const SatelliteNtnSuite: React.FC<SatelliteNtnSuiteProps> = ({
  activeTab: controlledTab,
  onSelectTab: setControlledTab,
}) => {
  const [internalTab, setInternalTab] = useState<SatelliteTab>('teleport_ground');
  const activeTab = controlledTab || internalTab;
  const onSelectTab = setControlledTab || setInternalTab;

  const [teleports, setTeleports] = useState<TeleportStation[]>(INITIAL_TELEPORTS);
  const [sessions, setSessions] = useState<NtnDeviceSession[]>(INITIAL_NTN_SESSIONS);

  // Direct-to-Device Test Dispatcher
  const [testMsisdn, setTestMsisdn] = useState('+254 799 444 321');
  const [testPayload, setTestPayload] = useState('ALERT: Severe Flash Flood Warning in Turkana. Move to high ground immediately.');
  const [isSosBroadcast, setIsSosBroadcast] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // Doppler Buffer Setting
  const [jitterBufferSizeMs, setJitterBufferSizeMs] = useState(75);
  const [dopplerTrackingActive, setDopplerTrackingActive] = useState(true);

  const handleDispatchSatelliteSms = () => {
    setIsDispatching(true);
    setDispatchStatus('Calculating LEO Ephemeris & Doppler offset...');

    setTimeout(() => {
      setDispatchStatus('Modulating 3GPP Rel-17 S-Band Carrier @ 2.18 GHz (Mwembeshi Teleport)...');
    }, 600);

    setTimeout(() => {
      const newSession: NtnDeviceSession = {
        id: `ntn-${Date.now()}`,
        msisdn: testMsisdn,
        imsi: '63901' + Math.floor(1000000000 + Math.random() * 9000000000),
        locationName: isSosBroadcast ? 'Emergency SOS Wilderness Zone' : 'Remote Rural Off-Grid Terminal',
        deviceCategory: isSosBroadcast ? 'SOS Emergency Beacon' : '3GPP Rel-17 Smartphone',
        beamId: 'BEAM-LEO-EASTAFR-09',
        signalStrengthDbm: -104,
        elevationAngleDeg: 58.2,
        dopplerHz: Math.floor((Math.random() - 0.5) * 6000),
        jitterBufferMs: jitterBufferSizeMs,
        emergencySosActive: isSosBroadcast,
        status: 'connected'
      };

      setSessions([newSession, ...sessions]);
      setIsDispatching(false);
      setDispatchStatus(`Delivered via LEO Direct-to-Cell! RTT: 34ms · Beam: BEAM-LEO-EASTAFR-09`);
    }, 1400);
  };

  const handleTeleportHandover = (teleportId: string) => {
    setTeleports(prev =>
      prev.map(tp =>
        tp.id === teleportId
          ? {
              ...tp,
              status: tp.status === 'active' ? 'tracking' : 'active',
              rttMs: tp.status === 'active' ? tp.rttMs + 6 : Math.max(26, tp.rttMs - 6)
            }
          : tp
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400">
              <Satellite className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  Satellite Carrier Core & 3GPP NTN Gateway
                </h1>
                <Badge variant="satellite" dot>
                  Direct-to-Device LEO Interconnect
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Zero ground cell towers required. Connect LEO/GEO satellite constellations directly to Mandela’s anycast Kamailio & SMPP core with Doppler compensation.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => onSelectTab('teleport_ground')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'teleport_ground'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Teleport Ground Stations</span>
          </button>

          <button
            onClick={() => onSelectTab('ntn_direct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'ntn_direct'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Signal className="w-3.5 h-3.5" />
            <span>3GPP Direct-to-Device</span>
          </button>

          <button
            onClick={() => onSelectTab('orbit_telemetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'orbit_telemetry'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Beam Footprint & Ephemeris</span>
          </button>

          <button
            onClick={() => onSelectTab('maritime_mining')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'maritime_mining'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>Offshore & Mining VSAT</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="African Ground Teleports"
          value="4 Stations"
          subtext="Mwembeshi, Longonot, Hart, Dakar"
          icon={<Radio className="w-4 h-4 text-sky-400" />}
          trend={{ value: '100% Online', positive: true }}
          status="satellite"
        />
        <StatCard
          label="LEO Feeder Capacity"
          value="87.5 Gbps"
          subtext="Ka/Ku & S-Band total aggregated"
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          trend={{ value: '24ms Avg RTT', positive: true }}
          status="live"
        />
        <StatCard
          label="Active Direct-to-Cell Handsets"
          value="18,450"
          subtext="3GPP Rel-17 NTN direct D2D"
          icon={<Signal className="w-4 h-4 text-emerald-400" />}
          trend={{ value: '+14% WoW', positive: true }}
          status="live"
        />
        <StatCard
          label="Doppler Jitter Compensation"
          value="±45 kHz"
          subtext="Dynamic adaptive buffer: 75ms"
          icon={<Sliders className="w-4 h-4 text-violet-400" />}
          trend={{ value: 'Locked', positive: true }}
          status="satellite"
        />
      </div>

      {/* ================= TAB 1: TELEPORT GROUND STATIONS ================= */}
      {activeTab === 'teleport_ground' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <SectionHeader
                title="Pan-African Teleport Earth Station Array"
                subtitle="High-capacity carrier-grade earth stations interconnecting satellite constellations into Mandela AS37105 BGP anycast fabric."
                badge={<Badge variant="satellite">Direct IXP Peering</Badge>}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teleports.map(tp => (
                  <Card key={tp.id} variant="elevated" className="p-4 border-slate-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-100 text-sm">{tp.name}</h3>
                          <Badge
                            variant={tp.status === 'active' ? 'live' : 'satellite'}
                            dot
                          >
                            {tp.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tp.location}, {tp.country} · {tp.coordinates}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Band:</span>
                        <span className="text-sky-300 font-semibold">{tp.frequencyBand}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Capacity:</span>
                        <span className="text-slate-200">{tp.carrierCapacityGbps} Gbps</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Ground RTT:</span>
                        <span className="text-emerald-400">{tp.rttMs} ms</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Doppler Shift:</span>
                        <span className={tp.dopplerShiftKHz > 0 ? 'text-amber-400' : 'text-sky-400'}>
                          {tp.dopplerShiftKHz > 0 ? `+${tp.dopplerShiftKHz}` : tp.dopplerShiftKHz} kHz
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Satellite className="w-3.5 h-3.5 text-sky-400" />
                        <span>Connected: {tp.connectedBirds.join(', ')}</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => handleTeleportHandover(tp.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-track
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Architecture Card */}
            <div>
              <Card variant="default" className="p-5 border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Radio className="w-4 h-4 text-sky-400" />
                    <h3 className="font-semibold text-slate-100 text-sm">
                      Sovereign Ground Interconnect Specs
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mandela provides BGP AS37105 cross-connects at Johannesburg (NAPAfrica), Nairobi (KIXP), and Lagos (IXPN). Satellite downlinks bypass foreign internet backhauls, ensuring compliance with local African data sovereignty laws.
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Signaling Protocol:</span>
                      <span className="text-slate-200 font-mono">SIP over TLS / Kamailio NTN</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Media Gateway:</span>
                      <span className="text-slate-200 font-mono">RTPEngine with Jitter Clamp</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Data Residency:</span>
                      <span className="text-emerald-400 font-semibold">100% In-Country Sovereign</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <CodeBlock
                    fileName="kamailio-satellite-pop.cfg"
                    language="c"
                    code={`# LEO Teleport Dispatcher Rule
route[DISPATCH_SATELLITE] {
    if (is_method("INVITE|MESSAGE")) {
        $var(doppler_ms) = $hdr(X-NTN-Doppler-Buffer);
        rtpengine_manage("trust-address replace-origin replace-session-connection dynamic-jitter=" + $var(doppler_ms));
        ds_select_dst("40", "4"); # Mwembeshi Ground Node
        t_relay();
    }
}`}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: 3GPP DIRECT-TO-DEVICE (D2D) ================= */}
      {activeTab === 'ntn_direct' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live NTN Dispatcher Tool */}
            <div className="lg:col-span-1">
              <Card variant="neonSky" className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Signal className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-slate-100 text-sm">
                    3GPP NTN Direct SMS & SOS Transmitter
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Transmit transactional SMS or Emergency SOS alerts directly to standard handheld phones located in zero-cellular coverage areas via LEO satellite beams.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Recipient Mobile Number (E.164)
                    </label>
                    <input
                      type="text"
                      value={testMsisdn}
                      onChange={e => setTestMsisdn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Message Payload
                    </label>
                    <textarea
                      rows={3}
                      value={testPayload}
                      onChange={e => setTestPayload(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${isSosBroadcast ? 'text-rose-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="text-xs font-medium text-slate-200 block">Emergency SOS Mode</span>
                        <span className="text-[10px] text-slate-400">Bypasses commercial queue / E-911 priority</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSosBroadcast}
                      onChange={e => setIsSosBroadcast(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Adaptive Jitter Buffer:</span>
                      <span className="font-mono text-sky-400">{jitterBufferSizeMs} ms</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={180}
                      value={jitterBufferSizeMs}
                      onChange={e => setJitterBufferSizeMs(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>30ms (LEO Overhead)</span>
                      <span>180ms (Low Elevation)</span>
                    </div>
                  </div>

                  {dispatchStatus && (
                    <div className="p-3 rounded-lg bg-sky-950/60 border border-sky-800/80 text-xs text-sky-300 font-mono">
                      {dispatchStatus}
                    </div>
                  )}

                  <Button
                    variant="satellite"
                    className="w-full mt-2"
                    loading={isDispatching}
                    onClick={handleDispatchSatelliteSms}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Transmit via LEO Satellite
                  </Button>
                </div>
              </Card>
            </div>

            {/* Active Connected Handsets Table */}
            <div className="lg:col-span-2 space-y-4">
              <SectionHeader
                title="Active NTN Handset Sessions (Direct-to-Device)"
                subtitle="Live mobile handsets communicating over S-Band 3GPP Rel-17 direct satellite links."
                badge={<Badge variant="satellite">3GPP Rel-17 Compliant</Badge>}
              />

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">MSISDN & Location</th>
                      <th className="p-3.5">Device Type</th>
                      <th className="p-3.5">Beam & Elevation</th>
                      <th className="p-3.5">Signal (RSRP)</th>
                      <th className="p-3.5">Doppler Shift</th>
                      <th className="p-3.5">SOS Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {sessions.map(s => (
                      <tr key={s.id} className="hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-100">{s.msisdn}</div>
                          <div className="text-[11px] text-slate-400 font-sans mt-0.5">{s.locationName}</div>
                        </td>
                        <td className="p-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                            {s.deviceCategory}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="text-sky-300">{s.beamId}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{s.elevationAngleDeg}° elevation</div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400">{s.signalStrengthDbm} dBm</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-amber-400">
                          {s.dopplerHz > 0 ? `+${s.dopplerHz}` : s.dopplerHz} Hz
                        </td>
                        <td className="p-3.5 font-sans">
                          {s.emergencySosActive ? (
                            <Badge variant="critical" dot>
                              SOS BEACON
                            </Badge>
                          ) : (
                            <Badge variant="live" dot>
                              HEALTHY
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BEAM FOOTPRINT & EPHEMERIS ================= */}
      {activeTab === 'orbit_telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="elevated" className="p-5">
                <SectionHeader
                  title="LEO Constellation African Overpass Schedule"
                  subtitle="Sub-satellite points, elevation tracking, and beam hopping matrix across African sub-regions."
                  badge={<Badge variant="satellite">Ephemeris Synchronized</Badge>}
                />

                <div className="space-y-3 font-mono text-xs">
                  {[
                    {
                      satellite: 'MANDELA-LEO-AFR-01',
                      altitudeKm: 550,
                      speedKmh: 27500,
                      nextPass: 'Turkana & East Africa Rift in 4m 12s',
                      eirpDbf: 62.4,
                      footprintRadiusKm: 850,
                      health: 'Optimal',
                    },
                    {
                      satellite: 'MANDELA-LEO-AFR-02',
                      altitudeKm: 540,
                      speedKmh: 27600,
                      nextPass: 'Congo Basin & Katanga Belt in 12m 45s',
                      eirpDbf: 61.8,
                      footprintRadiusKm: 830,
                      health: 'Optimal',
                    },
                    {
                      satellite: 'MANDELA-LEO-AFR-03',
                      altitudeKm: 555,
                      speedKmh: 27480,
                      nextPass: 'Gulf of Guinea Deepwater in 19m 30s',
                      eirpDbf: 63.1,
                      footprintRadiusKm: 870,
                      health: 'Optimal',
                    },
                    {
                      satellite: 'MANDELA-LEO-AFR-04',
                      altitudeKm: 560,
                      speedKmh: 27420,
                      nextPass: 'Kalahari & South Africa in 28m 05s',
                      eirpDbf: 60.5,
                      footprintRadiusKm: 820,
                      health: 'Optimal',
                    },
                  ].map((bird, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Satellite className="w-4 h-4 text-sky-400" />
                          <span className="font-bold text-slate-100">{bird.satellite}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                            {bird.altitudeKm} km alt · {bird.speedKmh} km/h
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 font-sans mt-1">
                          Pass Target: {bird.nextPass}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-slate-400">
                        <div>
                          <span className="block text-[10px] text-slate-500">Beam EIRP</span>
                          <span className="text-emerald-400 font-semibold">{bird.eirpDbf} dBW</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500">Footprint</span>
                          <span className="text-slate-200">{bird.footprintRadiusKm} km</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card variant="default" className="p-5">
                <h3 className="font-bold text-slate-100 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Regulatory Landing Rights
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Satellite spectrum landing right compliance tracking across African national regulators (ITU Region 1).
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    { country: 'Kenya (CAK)', status: 'Approved', license: 'NTN-CAK-2026-08' },
                    { country: 'South Africa (ICASA)', status: 'Approved', license: 'ICASA-SAT-4819' },
                    { country: 'Nigeria (NCC)', status: 'Approved', license: 'NCC-LEO-DIRECT-01' },
                    { country: 'Zambia (ZICTA)', status: 'Approved', license: 'ZICTA-MWEMB-09' },
                    { country: 'Ghana (NCA)', status: 'Pending Review', license: 'NCA-SUB-2026-X' },
                  ].map((lic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-slate-200">{lic.country}</span>
                        <span className="block text-[10px] font-mono text-slate-500">{lic.license}</span>
                      </div>
                      <Badge variant={lic.status === 'Approved' ? 'live' : 'warning'}>
                        {lic.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: OFFSHORE & MINING VSAT ================= */}
      {activeTab === 'maritime_mining' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="elevated" className="p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Anchor className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-sm">
                  Offshore Maritime Cellular Roaming
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Container ships, fishing fleets, and offshore rigs in the Gulf of Guinea and Mozambique Channel connect through on-vessel picocells, trunked over Ku-band satellite to Mandela’s anycast core.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">MCC-MNC Pair:</span>
                  <span className="text-slate-200">901-88 (International Maritime)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Voice Codec:</span>
                  <span className="text-sky-300">AMR-WB (12.65 kbps bandwidth save)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SIGTRAN Gateway:</span>
                  <span className="text-emerald-400">MAP v3 over M3UA</span>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <Mountain className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm">
                  Remote Open-Pit Mining Private APN
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Dedicated private cellular core for copper, cobalt, and gold mines in remote Katanga, Tarkwa, and Geita regions. Seamlessly routes telemetry and PTT voice over satellite with zero terrestrial dependency.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">APN Name:</span>
                  <span className="text-slate-200">mandela.mine.private</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Push-to-Talk (PTT):</span>
                  <span className="text-amber-300">Mission-Critical MCPTT SIP Trunk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QoS Profile:</span>
                  <span className="text-emerald-400">QCI 1 (Conversational Voice Guaranteed)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
