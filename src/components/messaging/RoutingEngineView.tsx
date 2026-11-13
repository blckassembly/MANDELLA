import React, { useState } from 'react';
import { RouteProfile } from '../../types/messaging';
import { INITIAL_ROUTE_PROFILES } from '../../data/mockMessagingData';
import { Sliders, Plus, CheckCircle2, ShieldCheck, Layers, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const RoutingEngineView: React.FC = () => {
  const [profiles, setProfiles] = useState<RouteProfile[]>(INITIAL_ROUTE_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0].id);

  // Form modal
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('Kenya Safari Telecom Priority');
  const [newProfileCountry, setNewProfileCountry] = useState('KE');
  const [newPrimaryRoute, setNewPrimaryRoute] = useState('bind-saf-ke-01 (Safaricom Direct)');
  const [newFallbackRoute, setNewFallbackRoute] = useState('SIGTRAN USSD Push / Airtel Kenya');

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RouteProfile = {
      id: `prof-${Date.now()}`,
      name: newProfileName,
      description: `Custom profile for ${newProfileCountry} with dedicated primary and fallback binds.`,
      mode: 'custom_rules',
      countryCode: newProfileCountry,
      primaryCarrierBind: newPrimaryRoute,
      fallbackCarrierBind: newFallbackRoute,
      ussdConversionThreshold: 0.70,
      retrySchedule: [0, 300, 1800],
      ttlMinutes: 1440
    };
    setProfiles((prev) => [created, ...prev]);
    setSelectedProfileId(created.id);
    setShowAddProfileModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Multi-Factor Routing & Store-and-Forward Engine</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 5.4 & 7</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic quality scoring, AI failure prediction weighting, and configurable retry exponential backoff.
          </p>
        </div>

        <button
          onClick={() => setShowAddProfileModal(true)}
          className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Expert Route Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Profiles List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            Configured Route Profiles
          </div>

          <div className="space-y-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProfileId(p.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  p.id === selectedProfileId
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="font-mono text-[10px] text-amber-300">{p.countryCode}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          {/* Store-and-forward queue status */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px] block">
              Store-and-Forward Queue Health
            </span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Queue Depth:</span>
                <span className="font-mono text-emerald-400 font-bold">14 messages</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Backoff Strategy:</span>
                <span className="font-mono text-white">0s, 300s, 1800s</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Permanent Fails:</span>
                <span className="font-mono text-slate-500">Auto-dropped (invalid MSISDN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Profile Detailed Editor (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedProfile.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 uppercase">
                  {selectedProfile.mode.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedProfile.description}</p>
            </div>
          </div>

          {/* Flow Visualizer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
              Routing Decision Pipeline
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">PRIMARY PATH</div>
                <div className="text-xs font-bold text-white mt-1">Direct SMPP v5 Bind</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{selectedProfile.primaryCarrierBind}</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">AI CONVERSION TRIGGER</div>
                <div className="text-xs font-bold text-amber-300 mt-1">Confidence &gt; {Math.round(selectedProfile.ussdConversionThreshold * 100)}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">HLR 2G / Cell Edge</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono">FALLBACK PATH</div>
                <div className="text-xs font-bold text-white mt-1">SIGTRAN USSD Push</div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">{selectedProfile.fallbackCarrierBind}</div>
              </div>
            </div>
          </div>

          {/* Factors Weighting Matrix (PRD Section 7.1) */}
          <div className="space-y-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
              Multi-Factor Evaluation Weights
            </span>

            <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Carrier 1-Hour Rolling Quality Score</span>
                  <span className="text-white font-bold">40%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[40%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>AI Pre-Send Failure Prediction (HLR Telemetry)</span>
                  <span className="text-white font-bold">35%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>SMPP Latency & Window Health</span>
                  <span className="text-white font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cost Optimization Bound</span>
                  <span className="text-white font-bold">10%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to add route profile */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create Expert Route Profile</h3>
                <p className="text-xs text-slate-400">Override default routing with deterministic carrier binds</p>
              </div>
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Profile Name</label>
                <input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Country Scope</label>
                <input
                  type="text"
                  required
                  value={newProfileCountry}
                  onChange={(e) => setNewProfileCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Route Bind</label>
                <input
                  type="text"
                  required
                  value={newPrimaryRoute}
                  onChange={(e) => setNewPrimaryRoute(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fallback Route Bind</label>
                <input
                  type="text"
                  required
                  value={newFallbackRoute}
                  onChange={(e) => setNewFallbackRoute(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
                >
                  Save Route Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
