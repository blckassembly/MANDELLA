import React, { useState } from 'react';
import { SovereignLicense, AuditLogEntry, PhoneNumberRecord, AfricanCountry } from '../types/nms';
import { ShieldCheck, FileText, Download, CheckCircle2, AlertTriangle, Clock, RefreshCw, Upload, Lock } from 'lucide-react';

interface ComplianceRegistryProps {
  licenses: SovereignLicense[];
  auditLogs: AuditLogEntry[];
  quarantinedNumbers: PhoneNumberRecord[];
  countries: AfricanCountry[];
  onUploadLicense: (license: SovereignLicense) => void;
  onAdvanceRecycleStep: (numberId: string) => void;
}

export const ComplianceRegistry: React.FC<ComplianceRegistryProps> = ({
  licenses,
  auditLogs,
  quarantinedNumbers,
  countries,
  onUploadLicense,
  onAdvanceRecycleStep,
}) => {
  const [activeTab, setActiveTab] = useState<'recycling' | 'licenses' | 'audit' | 'export'>('recycling');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reportExportCountry, setReportExportCountry] = useState('NG');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Upload license state
  const [newLicCountry, setNewLicCountry] = useState('CM');
  const [newLicNumber, setNewLicNumber] = useState('ART/VAS/2026/0991');
  const [newLicName, setNewLicName] = useState('Value Added Services & Interconnect Carrier License');

  const handleCreateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const c = countries.find((item) => item.code === newLicCountry) || countries[0];
    const created: SovereignLicense = {
      id: `lic-${Date.now()}`,
      countryCode: c.code,
      countryName: c.name,
      licenseNumber: newLicNumber,
      licenseName: newLicName,
      regulator: c.regulator,
      issuedAt: '2026-10-10',
      expiresAt: '2031-10-09',
      status: 'active',
      documentUrl: '#',
      authorizedRanges: `${c.dialCode} 800-899 National Range`
    };
    onUploadLicense(created);
    setShowUploadModal(false);
  };

  const handleDownloadReport = (format: 'json' | 'csv') => {
    const c = countries.find((item) => item.code === reportExportCountry) || countries[0];
    const dummyData = {
      report: `${c.regulatorAcronym} Sovereign Number Utilization & Porting Return`,
      period: 'Q3-2026 Filing',
      timestamp: new Date().toISOString(),
      country: c.name,
      assignedE164Count: 1420,
      quarantinedCount: 48,
      portInCount: 120,
      portOutCount: 14,
      complianceOfficer: 'Mandela Regulatory Team',
      hash: 'sha256:8f2a991b1029c8e104f9810a991204859a1029381029'
    };

    const blob = new Blob(
      [format === 'json' ? JSON.stringify(dummyData, null, 2) : 'Country,Regulator,Assigned,Quarantine\n' + `${c.name},${c.regulatorAcronym},1420,48`],
      { type: format === 'json' ? 'application/json' : 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.code}_${c.regulatorAcronym}_Compliance_Return_Q3_2026.${format}`;
    a.click();

    setDownloadSuccessMessage(`Successfully generated official ${c.regulatorAcronym} report export.`);
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Lifecycle & Regulatory Compliance Engine</h2>
            <span className="text-xs text-emerald-400 font-mono font-medium">· Section 6.4</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated number recycling, sovereign license tracking, immutable audit trail, and regulatory reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Regulatory License</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('recycling')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'recycling'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Number Recycling Engine (TIRMS / CA 2026)</span>
        </button>
        <button
          onClick={() => setActiveTab('licenses')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'licenses'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sovereign Licenses Registry ({licenses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Immutable Audit Log</span>
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'export'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Regulatory Filings & Returns</span>
        </button>
      </div>

      {/* Tab 1: Recycling rules engine */}
      {activeTab === 'recycling' && (
        <div className="space-y-6">
          {/* Country recycling rules matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Nigeria NCC TIRMS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                  360-DAY INACTIVITY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Mandatory alerts sent to subscriber at 300 days and 330 days. Unbundling from subscriber registry happens only after day 360 with NCC TIRMS clearance.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Kenya CA 2026 Rules</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                  MULTI-MONTH NOTICE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                New CA 2026 directive: 60-day prior written/SMS notification + 30-day Kenya Gazette publication + 90-day cooldown quarantine before any reallocation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Ghana NCA Framework</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                  90-DAY GRACE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Automated 90-day quarantine. Subscriber electronic SIM link released and synchronized with the Central MNP Clearinghouse database.
              </p>
            </div>
          </div>

          {/* Numbers currently in recycling quarantine */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Numbers In Recycling Quarantine & Notice Pipeline ({quarantinedNumbers.length})</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Prevents premature reallocation and regulatory violations
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {quarantinedNumbers.map((num) => (
                <div key={num.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white">{num.e164}</span>
                      <span className="text-xs font-mono text-slate-400">[{num.countryName}]</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                        Recycling Hold
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Carrier: {num.carrier} · Last activity: {num.lastActivityAt || 'N/A'} · Quarantine target: {num.recyclingDueAt || 'Approaching'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAdvanceRecycleStep(num.id)}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs rounded transition-colors"
                    >
                      Process Next Notice
                    </button>
                    <button
                      onClick={() => onAdvanceRecycleStep(num.id)}
                      className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors"
                    >
                      Clear & Return to Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sovereign Licenses */}
      {activeTab === 'licenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Mandela Direct Interconnect & National Numbering Authorizations</span>
            <span className="text-emerald-400 font-mono font-medium">All 54 African Jurisdictions Ready</span>
          </div>

          <div className="divide-y divide-slate-800">
            {licenses.map((lic) => (
              <div key={lic.id} className="p-5 hover:bg-slate-850/40 transition-colors space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-sm">{lic.countryName}</span>
                    <span className="font-mono text-xs text-amber-300 font-semibold">{lic.licenseNumber}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                        lic.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {lic.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    Valid: {lic.issuedAt} → {lic.expiresAt}
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {lic.licenseName}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between text-xs text-slate-400 gap-2 pt-1 border-t border-slate-800/60">
                  <div className="font-mono text-[11px]">
                    Authorized Ranges: <span className="text-slate-300">{lic.authorizedRanges}</span>
                  </div>
                  <div>Regulator: <span className="text-white">{lic.regulator}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Cryptographic Telemetry Journal (Append-Only)</span>
            <span className="font-mono text-slate-500">SHA-256 Validated</span>
          </div>

          <div className="divide-y divide-slate-800 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-1 hover:bg-slate-950/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{log.action}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300">{log.actor}</span>
                    {log.e164 && (
                      <>
                        <span className="text-slate-500">·</span>
                        <span className="text-emerald-400">{log.e164}</span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">{log.details}</p>
                <div className="text-[10px] text-slate-500 break-all pt-1">
                  DIGITAL SEAL: {log.verificationHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Export Reports */}
      {activeTab === 'export' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">National Regulatory Filings Exporter</h3>
            <p className="text-xs text-slate-400">
              One-click statutory filings formatted per national regulatory standards (NCC, CA, NCA, ICASA)
            </p>
          </div>

          {downloadSuccessMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Select Jurisdiction</label>
              <select
                value={reportExportCountry}
                onChange={(e) => setReportExportCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-white"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} — {c.regulatorAcronym}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Reporting Cycle</label>
              <input
                type="text"
                disabled
                value="Q3-2026 Periodic Utilization Return & MNP Audit"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleDownloadReport('json')}
              className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Regulatory JSON Return</span>
            </button>
            <button
              onClick={() => handleDownloadReport('csv')}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Statutory CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload License Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Upload Sovereign License Document</h3>
                <p className="text-xs text-slate-400">Add official carrier interconnect or VAS authorization</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Country</label>
                <select
                  value={newLicCountry}
                  onChange={(e) => setNewLicCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.regulatorAcronym})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">License Certificate Number</label>
                <input
                  type="text"
                  required
                  value={newLicNumber}
                  onChange={(e) => setNewLicNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Authorization Title</label>
                <input
                  type="text"
                  required
                  value={newLicName}
                  onChange={(e) => setNewLicName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-dashed border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">Attached: License_Document_Official_Seal.pdf</span>
                <span className="text-emerald-400 font-mono text-[11px]">Ready (2.4 MB)</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
                >
                  Save & Validate License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
