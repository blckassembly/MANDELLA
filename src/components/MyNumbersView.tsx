import React, { useState } from 'react';
import { PhoneNumberRecord } from '../types/nms';
import { Phone, MessageSquare, Download, Settings, Trash2, CheckCircle2, ShieldCheck, ExternalLink, Globe } from 'lucide-react';

interface MyNumbersViewProps {
  numbers: PhoneNumberRecord[];
  onOpenSoftphone: (number: PhoneNumberRecord) => void;
  onUpdateRouting: (numberId: string, sipUri: string, webhookUrl: string) => void;
  onReleaseNumber: (numberId: string) => void;
  onNavigateToInventory: () => void;
}

export const MyNumbersView: React.FC<MyNumbersViewProps> = ({
  numbers,
  onOpenSoftphone,
  onUpdateRouting,
  onReleaseNumber,
  onNavigateToInventory,
}) => {
  const [editingNumberId, setEditingNumberId] = useState<string | null>(null);
  const [editSipUri, setEditSipUri] = useState('');
  const [editWebhook, setEditWebhook] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState<PhoneNumberRecord | null>(null);

  const activeNumbers = numbers.filter((n) => n.status === 'assigned');

  const startEditRouting = (num: PhoneNumberRecord) => {
    setEditingNumberId(num.id);
    setEditSipUri(num.sipTrunkUri || `sip:${num.e164}@sbc.mandela.africa:5060;transport=tls`);
    setEditWebhook(num.webhookUrl || `https://api.mandela-apps.com/webhooks/incoming-${num.countryCode.toLowerCase()}`);
  };

  const handleSaveRouting = (numId: string) => {
    onUpdateRouting(numId, editSipUri, editWebhook);
    setEditingNumberId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Active Numbers & Routing Endpoints</h2>
          <p className="text-xs text-slate-400">
            Sovereign digital assets connected to Mandela Kamailio SIP Fabric and Telecom Systems 4 & 5
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToInventory}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
          >
            + Acquire More Numbers
          </button>
        </div>
      </div>

      {activeNumbers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No active numbers currently provisioned</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Search 15 African priority markets, choose a mobile or DID range, and have it ringing on your SIP trunk in under 60 seconds.
          </p>
          <button
            onClick={onNavigateToInventory}
            className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
          >
            Browse African Number Inventory
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeNumbers.map((num) => (
            <div
              key={num.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 transition-colors"
            >
              {/* Row Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-white tracking-wide">
                    {num.e164}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {num.nationalFormat}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {num.type}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Ringing</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSoftphone(num)}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Test Softphone</span>
                  </button>
                  <button
                    onClick={() => startEditRouting(num)}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure Routing</span>
                  </button>
                  <button
                    onClick={() => setShowCertificateModal(num)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded transition-colors"
                    title="Download Regulatory Certificate of Allocation"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to release ${num.e164}? It will enter recycling quarantine.`)) {
                        onReleaseNumber(num.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-300 rounded transition-colors"
                    title="Release Number"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Technical Routing Details Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                    Kamailio SIP Trunk Dispatcher
                  </span>
                  <div className="font-mono text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {num.sipTrunkUri || `sip:${num.e164}@sbc.mandela.africa:5060;transport=tls`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Dispatcher ID: <span className="font-mono text-slate-300">{num.kamailioDispatcherId || 101}</span> · TLS Mutual
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                    Inbound Event Webhook
                  </span>
                  <div className="font-mono text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {num.webhookUrl || `https://api.mandela-apps.com/webhooks/incoming`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    HTTP POST · Signature verified
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                    RFC 3761 ENUM Record
                  </span>
                  <div className="font-mono text-amber-300/80 break-all bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                    {num.enumRecord || `${num.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa IN NAPTR`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Global DNS E.164 authoritative delegation
                  </div>
                </div>
              </div>

              {/* Inline Edit Routing Form */}
              {editingNumberId === num.id && (
                <div className="mt-3 p-4 bg-slate-950 rounded-lg border border-amber-500/30 space-y-3 text-xs">
                  <div className="font-semibold text-amber-300 flex items-center justify-between">
                    <span>Edit Live Routing for {num.e164}</span>
                    <button
                      onClick={() => setEditingNumberId(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">SIP Trunk URI (SBC Route Target)</label>
                      <input
                        type="text"
                        value={editSipUri}
                        onChange={(e) => setEditSipUri(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Webhook URL (Voice / SMS Dispatches)</label>
                      <input
                        type="text"
                        value={editWebhook}
                        onChange={(e) => setEditWebhook(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingNumberId(null)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveRouting(num.id)}
                      className="px-4 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
                    >
                      Apply Routing Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sovereign Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mandela Sovereign Asset Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-lg border border-amber-500/20 space-y-3 text-xs font-mono">
              <div className="text-center pb-2 border-b border-slate-800">
                <div className="text-xs text-slate-400">REPUBLIC OF {showCertificateModal.countryName.toUpperCase()}</div>
                <div className="text-sm font-bold text-amber-300 mt-1">OFFICIAL NUMBER ALLOCATION CERTIFICATE</div>
                <div className="text-[10px] text-slate-500">MANDELA CONNECT LAYER (SYSTEM 1: NMS)</div>
              </div>

              <div className="space-y-1.5 pt-1 text-slate-300">
                <div>E.164 ASSET: <span className="text-white font-bold">{showCertificateModal.e164}</span></div>
                <div>NATIONAL FORMAT: <span className="text-white">{showCertificateModal.nationalFormat}</span></div>
                <div>CARRIER AGGREGATOR: <span className="text-white">{showCertificateModal.carrier}</span></div>
                <div>REGULATORY REGIME: <span className="text-white">{showCertificateModal.countryName} Communications Authority</span></div>
                <div>STATUS: <span className="text-emerald-400 font-bold">SOVEREIGN ALLOCATED & ROUTED</span></div>
                <div>ALLOCATION TIME: <span className="text-slate-400">{showCertificateModal.allocatedAt || '2026-10-10 15:42 UTC'}</span></div>
                <div className="pt-2 text-[10px] text-slate-500 break-all">
                  HASH: sha256:4a8b79e001f3589b91024cd9a77192801efc91a0
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">Authorized by Mandela Telecom Layer</span>
              <button
                onClick={() => {
                  alert(`Certificate for ${showCertificateModal.e164} downloaded.`);
                  setShowCertificateModal(null);
                }}
                className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
              >
                Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
