import React, { useState } from 'react';
import { Plus, Minus, Layers, Maximize, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button, Select, CalloutBanner, KeyValueTable, Tabs } from '../../design-system';
import { AfricanCountry } from '../../types/nms';
import { CommandControlMap } from '../CommandControlMap';
import { OsSectionId } from './types';

interface InfrastructureWorkspaceProps {
  countries: AfricanCountry[];
  connectors: any[];
  selectedCountryCode: string;
  onSelectCountryCode: (code: string) => void;
  onSelectSection: (section: OsSectionId) => void;
  onOpenAiForecast: (country: AfricanCountry) => void;
  onTriggerAutoOrder: (countryCode: string, count: number) => void;
}

export const useInfrastructureSidebar = (
  infraSubView: 'map' | 'site_inspector' | 'readiness',
  setInfraSubView: (v: 'map' | 'site_inspector' | 'readiness') => void,
  filterCountry: string,
  setFilterCountry: (v: string) => void,
  filterRegion: string,
  setFilterRegion: (v: string) => void,
  filterLayer: string,
  setFilterLayer: (v: string) => void
) => (
  <div className="p-4 space-y-4">
    <div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
        INFRASTRUCTURE
      </div>
      <h2 className="text-xl font-extrabold text-black tracking-tight">Continental Map</h2>
      <div className="font-mono text-[11px] font-bold uppercase text-black mt-0.5">INSPECTOR</div>
    </div>

    <div className="space-y-1 border-t border-black pt-3">
      {[
        { id: 'map', label: 'WF-12 Continental Explorer' },
        { id: 'site_inspector', label: 'WF-14 Rural Clinic Site Inspector' },
        { id: 'readiness', label: 'WF-15 Site Readiness Assessment' }
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setInfraSubView(item.id as any)}
          className={`w-full text-left px-3 py-2 text-xs font-bold cursor-pointer border ${
            infraSubView === item.id
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-transparent hover:border-black'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>

    <div className="space-y-2.5 border-t border-black pt-3">
      <div className="font-mono text-[11px] font-bold uppercase text-black">FILTERS</div>
      <Select
        label="COUNTRY"
        value={filterCountry}
        onChange={(e) => setFilterCountry(e.target.value)}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'DRC (Congo)', value: 'CD' },
          { label: 'Kenya', value: 'KE' },
          { label: 'Nigeria', value: 'NG' },
          { label: 'South Africa', value: 'ZA' },
          { label: 'Egypt', value: 'EG' }
        ]}
      />
      <Select
        label="REGION"
        value={filterRegion}
        onChange={(e) => setFilterRegion(e.target.value)}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Central Africa', value: 'Central' },
          { label: 'East Africa', value: 'East' },
          { label: 'West Africa', value: 'West' },
          { label: 'Southern Africa', value: 'Southern' },
          { label: 'North Africa', value: 'North' }
        ]}
      />
      <Select
        label="INFRASTRUCTURE LAYER"
        value={filterLayer}
        onChange={(e) => setFilterLayer(e.target.value)}
        options={[
          { label: 'All', value: 'ALL' },
          { label: 'Projects', value: 'project' },
          { label: 'Ground Stations', value: 'ground_station' },
          { label: 'Data Centers', value: 'data_center' },
          { label: 'Energy', value: 'energy' }
        ]}
      />
      <Button
        variant="primary"
        size="sm"
        className="w-full"
        onClick={() => {}}
      >
        APPLY FILTERS
      </Button>
    </div>
  </div>
);

export const InfrastructureWorkspace: React.FC<
  InfrastructureWorkspaceProps & {
    infraSubView: 'map' | 'site_inspector' | 'readiness';
    setInfraSubView: (v: 'map' | 'site_inspector' | 'readiness') => void;
    filterCountry: string;
    filterLayer: string;
  }
> = ({
  infraSubView,
  setInfraSubView,
  filterCountry,
  filterLayer,
  countries,
  connectors,
  onSelectSection,
  onOpenAiForecast,
  onTriggerAutoOrder
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [selectedSite, setSelectedSite] = useState<'lukunga' | 'nairobi' | 'lagos' | 'cairo' | 'johannesburg'>('lukunga');
  const [showLiveTelecomMap, setShowLiveTelecomMap] = useState(false);

  const siteDetails = {
    lukunga: {
      name: 'Rural Clinic — Lukunga, DRC',
      country: 'DRC',
      coords: '-4.4419° S, 15.2663° E',
      type: 'Primary Care Rural Clinic',
      connectivity: '20 Mbps Satellite-first (Conditional Backup)',
      power: '2 kW Solar + 24h BMS',
      readiness: 'Conditional — Verify Satellite & Power'
    },
    nairobi: {
      name: 'East Africa Regional Hub — Nairobi',
      country: 'Kenya',
      coords: '-1.2921° S, 36.8219° E',
      type: 'Anycast PoP & Optical Ground Station',
      connectivity: '100G Metro Fiber + LEO Teleport',
      power: 'Grid + Dual Redundant Battery',
      readiness: 'Verified Ready (Demo)'
    },
    lagos: {
      name: 'West Africa Core — Lagos PoP',
      country: 'Nigeria',
      coords: '6.5244° N, 3.3792° E',
      type: 'Data Center & IXP Peering',
      connectivity: 'AS37105 MainOne / Equinix LOS',
      power: 'Tier-III Redundant',
      readiness: 'Verified Ready (Demo)'
    },
    cairo: {
      name: 'North Africa Gateway — Cairo',
      country: 'Egypt',
      coords: '30.0444° N, 31.2357° E',
      type: 'Subsea Landing & Ground Station',
      connectivity: 'Subsea Fiber + Optical Link',
      power: 'Grid + Solar Hybrid',
      readiness: 'Verified Ready (Demo)'
    },
    johannesburg: {
      name: 'Southern Africa Core — Johannesburg',
      country: 'South Africa',
      coords: '-26.2041° S, 28.0473° E',
      type: 'Energy & Carrier Compute Hub',
      connectivity: 'Teraco JNB IXP + Fiber',
      power: '250 kW Hybrid Microgrid',
      readiness: 'Verified Ready (Demo)'
    }
  }[selectedSite];

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black pb-3">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            {infraSubView === 'map'
              ? 'Continental Infrastructure Explorer'
              : infraSubView === 'site_inspector'
              ? 'Rural Clinic Site Inspector'
              : 'Site Readiness Assessment'}
          </h1>
          <p className="font-mono text-xs uppercase text-zinc-600 mt-1">
            AFRICA | INFRASTRUCTURE ASSETS, PROJECTS AND PLANNING LAYERS
          </p>
        </div>

        <Tabs
          variant="boxed"
          tabs={[
            { id: 'map', label: 'MAP (WF-12)' },
            { id: 'site_inspector', label: 'SITE INSPECTOR (WF-14)' },
            { id: 'readiness', label: 'READINESS (WF-15)' }
          ]}
          activeId={infraSubView}
          onChange={(id) => setInfraSubView(id as any)}
        />
      </div>

      {infraSubView === 'map' && (
        <div className="space-y-4">
          <CalloutBanner
            symbol="i"
            text="Illustrative demo locations — not verified physical coverage."
            rightText="NO CONFIRMED SERVICE ROUTES."
          />

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-zinc-700">
              FILTER: {filterCountry === 'ALL' ? 'ALL COUNTRIES' : filterCountry} · LAYER: {filterLayer.toUpperCase()}
            </span>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setShowLiveTelecomMap((p) => !p)}
            >
              {showLiveTelecomMap ? 'SHOW MONOCHROME BLUEPRINT MAP' : 'SHOW LIVE 54-NATION NMS TELEMETRY'}
            </Button>
          </div>

          {showLiveTelecomMap ? (
            <div className="border border-black p-4 bg-white">
              <CommandControlMap
                countries={countries}
                connectors={connectors}
                onSelectCountry={() => setInfraSubView('site_inspector')}
                onOpenAiForecast={onOpenAiForecast}
                onTriggerAutoOrder={onTriggerAutoOrder}
                onGenerateReport={() => onSelectSection('mission_control')}
              />
            </div>
          ) : (
            <div className="border border-black bg-white p-5 relative overflow-hidden min-h-[470px] flex flex-col justify-between">
              {/* Top Right Map Toolbar */}
              <div className="flex justify-between items-start gap-4 z-10">
                <div className="border border-black bg-white px-3 py-2 text-xs">
                  <div className="font-mono text-[10px] font-bold uppercase text-zinc-500">SELECTED NODE</div>
                  <div className="font-bold text-black">{siteDetails.name}</div>
                  <div className="font-mono text-[11px] text-zinc-600 tabular-nums">{siteDetails.coords}</div>
                </div>

                <div className="flex flex-col gap-1.5 w-32 shrink-0">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
                    className="px-2.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ZOOM IN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                    className="px-2.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>ZOOM OUT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfraSubView('site_inspector')}
                    className="px-2.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>INSPECT SITE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="px-2.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>FIT</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setSelectedSite('lukunga');
                    }}
                    className="px-2.5 py-1.5 border border-black bg-white hover:bg-black hover:text-white font-mono text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                </div>
              </div>

              {/* Clean Architectural SVG Africa Map + Interactive Nodes */}
              <div className="my-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 600 540"
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full max-w-[460px] h-auto transition-transform duration-150"
                >
                  {/* Stylized Architectural Africa Continent Outline */}
                  <path
                    d="M 195 45 L 285 38 L 350 58 L 405 62 L 422 95 L 448 158 L 510 218 L 495 270 L 455 320 L 430 390 L 385 450 L 330 495 L 288 492 L 265 445 L 250 385 L 235 315 L 185 268 L 122 250 L 92 205 L 105 148 L 138 102 L 165 62 Z"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  {/* Madagascar */}
                  <path
                    d="M 465 365 L 490 352 L 498 395 L 472 428 L 458 408 Z"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="1.75"
                  />
                  {/* Regional Internal Blueprint Grid Lines */}
                  <path d="M 122 200 L 448 180" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.35" />
                  <path d="M 235 315 L 455 290" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.35" />
                  <path d="M 290 50 L 315 470" stroke="#000000" strokeWidth="0.7" strokeOpacity="0.35" />

                  {/* Proposed Fiber Corridor Dashed Lines */}
                  <path
                    d="M 185 235 Q 250 265 305 298 T 418 332"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <path
                    d="M 305 298 Q 312 385 308 462"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />

                  {/* Conceptual Service Areas (Dotted Circles) */}
                  <circle cx="305" cy="298" r="52" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 4" />
                  <circle cx="428" cy="260" r="46" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 4" />

                  {/* Interactive Infrastructure Markers */}
                  {/* Project Circle: DRC Clinic */}
                  <g className="cursor-pointer" onClick={() => setSelectedSite('lukunga')}>
                    <circle
                      cx="305"
                      cy="298"
                      r="10"
                      fill={selectedSite === 'lukunga' ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="2.5"
                    />
                    <text x="320" y="294" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="#000">
                      DRC CLINIC
                    </text>
                  </g>

                  {/* Ground Station Square: Nairobi */}
                  <g className="cursor-pointer" onClick={() => setSelectedSite('nairobi')}>
                    <rect
                      x="420"
                      y="252"
                      width="16"
                      height="16"
                      fill={selectedSite === 'nairobi' ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="442" y="264" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#000">
                      NBO GS
                    </text>
                  </g>

                  {/* Ground Station Square: Cairo */}
                  <g className="cursor-pointer" onClick={() => setSelectedSite('cairo')}>
                    <rect
                      x="375"
                      y="82"
                      width="16"
                      height="16"
                      fill={selectedSite === 'cairo' ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="345" y="76" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#000">
                      CAI
                    </text>
                  </g>

                  {/* Data Center Diamond: Lagos */}
                  <g className="cursor-pointer" onClick={() => setSelectedSite('lagos')}>
                    <polygon
                      points="185,223 197,235 185,247 173,235"
                      fill={selectedSite === 'lagos' ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="148" y="220" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#000">
                      LOS IXP
                    </text>
                  </g>

                  {/* Energy Triangle: Johannesburg */}
                  <g className="cursor-pointer" onClick={() => setSelectedSite('johannesburg')}>
                    <polygon
                      points="308,450 320,472 296,472"
                      fill={selectedSite === 'johannesburg' ? '#000000' : '#ffffff'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text x="326" y="468" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#000">
                      JNB CORE
                    </text>
                  </g>
                </svg>
              </div>

              {/* Bottom Right Legend Box */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm" onClick={() => onSelectSection('golden_command')}>
                    CONFIGURE SITE IN GOLDEN COMMAND
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setInfraSubView('readiness')}>
                    CHECK READINESS
                  </Button>
                </div>

                <div className="border border-black bg-white p-3.5 text-xs space-y-1.5 min-w-[210px]">
                  <div className="font-mono text-[11px] font-bold uppercase border-b border-black pb-1 mb-1.5">
                    LEGEND
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full border-2 border-black inline-block" />
                    <span>Project</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 border-2 border-black inline-block" />
                    <span>Ground station</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 border-2 border-black rotate-45 inline-block" />
                    <span>Data center</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs">△</span>
                    <span>Energy</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 border-t-2 border-dashed border-black inline-block" />
                    <span>Proposed fiber</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 border-t-2 border-dotted border-black inline-block" />
                    <span>Conceptual service area</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {infraSubView === 'site_inspector' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <KeyValueTable
                title="SITE PROFILE (WF-14)"
                rows={[
                  { key: 'SITE NAME', value: siteDetails.name },
                  { key: 'COUNTRY', value: siteDetails.country },
                  { key: 'COORDINATES', value: siteDetails.coords },
                  { key: 'SITE TYPE', value: siteDetails.type },
                  { key: 'CONNECTIVITY TARGET', value: siteDetails.connectivity },
                  { key: 'POWER BASELINE', value: siteDetails.power },
                  { key: 'READINESS STATUS', value: siteDetails.readiness }
                ]}
              />
            </div>

            <div className="lg:col-span-5 border border-black p-5 bg-white space-y-4">
              <div className="font-mono text-xs font-bold uppercase text-black">SWITCH INSPECTED SITE</div>
              <div className="space-y-2">
                {(['lukunga', 'nairobi', 'lagos', 'cairo', 'johannesburg'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedSite(k)}
                    className={`w-full text-left px-3 py-2 border border-black text-xs font-bold uppercase cursor-pointer ${
                      selectedSite === k ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <Button variant="primary" className="w-full" onClick={() => setInfraSubView('readiness')}>
                OPEN READINESS ASSESSMENT
              </Button>
            </div>
          </div>
        </div>
      )}

      {infraSubView === 'readiness' && (
        <div className="space-y-5">
          <CalloutBanner
            symbol="!"
            text="Site readiness reflects demo planning assumptions until field survey evidence is uploaded."
          />

          <div className="border border-black bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black bg-zinc-50 font-mono uppercase">
                  <th className="py-2.5 px-4">DOMAIN</th>
                  <th className="py-2.5 px-4">SYSTEM</th>
                  <th className="py-2.5 px-4">CRITERION</th>
                  <th className="py-2.5 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/15">
                <tr>
                  <td className="py-3 px-4 font-bold">Solar Power</td>
                  <td className="py-3 px-4 font-mono">System 12</td>
                  <td className="py-3 px-4">2 kW PV + 24h LiFePO4 rack autonomy</td>
                  <td className="py-3 px-4 font-mono font-bold inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SCOPED
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Satellite Access</td>
                  <td className="py-3 px-4 font-mono">System 10</td>
                  <td className="py-3 px-4">20 Mbps LEO sky-view assessment</td>
                  <td className="py-3 px-4 font-mono font-bold inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> VERIFY COVERAGE
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Optical Ground Link</td>
                  <td className="py-3 px-4 font-mono">System 11</td>
                  <td className="py-3 px-4">Conditional station availability</td>
                  <td className="py-3 px-4 font-mono font-bold">UNVERIFIED (ROUTE-B READY)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Voice &amp; Numbering</td>
                  <td className="py-3 px-4 font-mono">Systems 01 / 04</td>
                  <td className="py-3 px-4">1 business line + TLS SIP trunk</td>
                  <td className="py-3 px-4 font-mono font-bold">READY FOR PROVISIONING</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" onClick={() => onSelectSection('golden_command')}>
              PROCEED TO GOLDEN COMMAND
            </Button>
            <Button variant="secondary" onClick={() => setInfraSubView('map')}>
              BACK TO MAP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
