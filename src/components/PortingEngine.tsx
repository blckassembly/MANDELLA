import React, { useState } from 'react';
import { PortingRequest, AfricanCountry, PhoneNumberRecord } from '../types/nms';
import { ArrowRightLeft, FileText, CheckCircle2, Clock, Upload, AlertCircle, Plus, Sparkles } from 'lucide-react';

interface PortingEngineProps {
  portingRequests: PortingRequest[];
  countries: AfricanCountry[];
  onSubmitNewPort: (newRequest: PortingRequest) => void;
  onAdvancePortStatus: (requestId: string) => void;
}

export const PortingEngine: React.FC<PortingEngineProps> = ({
  portingRequests,
  countries,
  onSubmitNewPort,
  onAdvancePortStatus,
}) => {
  const [showNewPortModal, setShowNewPortModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('GH');
  const [portNumber, setPortNumber] = useState('');
  const [donorCarrier, setDonorCarrier] = useState('');
  const [subscriberName, setSubscriberName] = useState('');
  const [nationalIdOrCac, setNationalIdOrCac] = useState('');
  const [loaFileName, setLoaFileName] = useState('LOA_Signed_Letter_of_Authorization.pdf');

  const selectedCountry = countries.find((c) => c.code === selectedCountryCode) || countries[0];

  const handleSubmitPort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portNumber.trim() || !donorCarrier.trim() || !subscriberName.trim()) return;

    const newReq: PortingRequest = {
      id: `port-req-${Date.now().toString().slice(-4)}`,
      number: portNumber.startsWith('+') ? portNumber : `${selectedCountry.dialCode}${portNumber.replace(/^0+/, '')}`,
      countryCode: selectedCountry.code,
      currentCarrier: donorCarrier,
      targetCarrier: 'Mandela Kamailio Fabric',
      status: 'submitted',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      estimatedCompletionAt: selectedCountry.mnpSupported ? '24 Hours (Clearinghouse SLA)' : '72 Hours (Bilateral Review)',
      subscriberName,
      loaDocumentName: loaFileName,
      nationalIdOrCac: nationalIdOrCac || 'REG-ID-992144'
    };

    onSubmitNewPort(newReq);
    setShowNewPortModal(false);
    setPortNumber('');
    setDonorCarrier('');
    setSubscriberName('');
  };

  const getStatusBadge = (status: PortingRequest['status']) => {
    switch (status) {
      case 'requested':
        return <span className="text-xs font-mono text-slate-400">REQUESTED</span>;
      case 'submitted':
        return <span className="text-xs font-mono text-amber-400 font-medium">SUBMITTED TO CLEARINGHOUSE</span>;
      case 'in-progress':
        return <span className="text-xs font-mono text-sky-400 font-medium">IN-PROGRESS (DONOR VALIDATION)</span>;
      case 'completed':
        return <span className="text-xs font-mono text-emerald-400 font-medium">COMPLETED & ROUTED</span>;
      case 'rejected':
        return <span className="text-xs font-mono text-rose-400 font-medium">REJECTED BY DONOR</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Sovereign Porting Engine (MNP)</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· Section 6.3</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Port numbers from legacy African carriers (MTN, Airtel, Safaricom, Vodacom) into Mandela SIP & ENUM fabric
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowNewPortModal(true)}
            className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Port Request</span>
          </button>
        </div>
      </div>

      {/* MNP Regulatory Rules & Capabilities Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Automated MNP Markets
          </div>
          <div className="text-sm font-semibold text-white">
            Ghana (NCA), Nigeria (NCC), South Africa (ICASA), Kenya (CA)
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Direct clearinghouse API sync. SLA 24 hours.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Bilateral Carrier Porting
          </div>
          <div className="text-sm font-semibold text-white">
            Uganda (UCC), DR Congo (ARPTC), Zambia (ZICTA)
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Assisted manual donor carrier sign-off workflow.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Automated ENUM Cutover
          </div>
          <div className="text-sm font-semibold text-emerald-400">
            Instantaneous DNS Delegation
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            No voice downtime: e164.arpa zone updates immediately on release.
          </p>
        </div>
      </div>

      {/* Porting Requests Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Porting Transactions Queue ({portingRequests.length})</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            State Machine: Requested → Submitted → In-Progress → Completed
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {portingRequests.map((req) => (
            <div key={req.id} className="p-5 hover:bg-slate-850/40 transition-colors space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-white">
                    {req.number}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [{req.countryCode}]
                  </span>
                  <div>{getStatusBadge(req.status)}</div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status !== 'completed' && req.status !== 'rejected' && (
                    <button
                      onClick={() => onAdvancePortStatus(req.id)}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Advance MNP Status</span>
                    </button>
                  )}
                  {req.status === 'completed' && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ENUM Record Active
                    </span>
                  )}
                </div>
              </div>

              {/* Progress steps track */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                <div
                  className={`p-2 rounded border ${
                    ['requested', 'submitted', 'in-progress', 'completed'].includes(req.status)
                      ? 'bg-slate-950 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  1. LOA Submitted
                </div>
                <div
                  className={`p-2 rounded border ${
                    ['submitted', 'in-progress', 'completed'].includes(req.status)
                      ? 'bg-slate-950 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  2. Clearinghouse Accepted
                </div>
                <div
                  className={`p-2 rounded border ${
                    ['in-progress', 'completed'].includes(req.status)
                      ? 'bg-slate-950 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  3. Donor {req.currentCarrier} Release
                </div>
                <div
                  className={`p-2 rounded border ${
                    req.status === 'completed'
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  4. Mandela SIP Cutover
                </div>
              </div>

              {/* Details strip */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Donor Carrier</span>
                  <span className="text-white font-medium">{req.currentCarrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Subscriber & Entity</span>
                  <span className="text-white font-medium">{req.subscriberName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Verification Document</span>
                  <span className="text-amber-300 font-mono text-[11px] flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {req.loaDocumentName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">SLA Target</span>
                  <span className="font-mono text-slate-300">{req.estimatedCompletionAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Port Request Modal */}
      {showNewPortModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Initiate Sovereign Number Port (MNP)</h3>
                <p className="text-xs text-slate-400">Transfer existing numbers without losing voice or SMS traffic</p>
              </div>
              <button
                onClick={() => setShowNewPortModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPort} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Country</label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => {
                      setSelectedCountryCode(e.target.value);
                      const c = countries.find((country) => country.code === e.target.value);
                      if (c && c.carriers.length > 0) setDonorCarrier(c.carriers[0]);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-medium"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dialCode}) - {c.mnpSupported ? 'MNP Available' : 'Bilateral'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Current Carrier (Donor)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTN, Telecel, Safaricom"
                    value={donorCarrier}
                    onChange={(e) => setDonorCarrier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Phone Number to Port (E.164 or Local)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0244123456 or +233..."
                    value={portNumber}
                    onChange={(e) => setPortNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Subscriber / Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Africa Ltd"
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">National ID or Corporate Registration (CAC / CIPC / RGD)</label>
                <input
                  type="text"
                  placeholder="e.g. RC-991204 or National ID number"
                  value={nationalIdOrCac}
                  onChange={(e) => setNationalIdOrCac(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              {/* Document upload simulation */}
              <div className="p-3 bg-slate-950 rounded-lg border border-dashed border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-medium text-slate-200">Letter of Authorization (LOA)</span>
                    <span className="text-[11px] text-slate-500 block">PDF signed by legal representative</span>
                  </div>
                </div>
                <span className="text-amber-300 font-mono text-[11px]">{loaFileName}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPortModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
                >
                  Submit to Regulatory Clearinghouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
