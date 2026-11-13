import React, { useState } from 'react';
import { EnterprisePbxCredential, PopCode } from '../../types/sbc';
import { SBC_ANYCAST_IPS } from '../../data/mockSbcData';
import {
  Server,
  ShieldCheck,
  Copy,
  Check,
  Play,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  FileCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface PbxConnectWizardProps {
  credentials: EnterprisePbxCredential[];
  onTestRegister: (pbxId: string) => Promise<PopCode>;
  onCreateCredential: (cred: Partial<EnterprisePbxCredential>) => void;
}

export const PbxConnectWizard: React.FC<PbxConnectWizardProps> = ({
  credentials,
  onTestRegister,
  onCreateCredential
}) => {
  const [selectedPbxId, setSelectedPbxId] = useState<string>(credentials[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'asterisk' | 'cisco' | 'freeswitch' | '3cx'>('asterisk');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    pop: PopCode;
    latencyMs: number;
    message: string;
  } | null>(null);

  const selectedPbx = credentials.find((c) => c.id === selectedPbxId) || credentials[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunTestCall = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const pop = await onTestRegister(selectedPbx.id);
      setTimeout(() => {
        setTestResult({
          success: true,
          pop,
          latencyMs: 32,
          message: `PBX successfully registered and verified from ${pop} PoP via Anycast BGP (TLS 1.3 · SRTP Enabled)`
        });
        setIsTesting(false);
      }, 1400);
    } catch {
      setIsTesting(false);
    }
  };

  // Sample PBX snippets
  const getPbxConfigSnippet = () => {
    switch (activeTab) {
      case 'asterisk':
        return `; /etc/asterisk/pjsip.conf - Mandela Anycast Trunk
[transport-tls]
type=transport
protocol=tls
bind=0.0.0.0:5061

[mandela-reg]
type=registration
outbound_auth=mandela-auth
server_uri=sip:sip.mandela.africa:5061\\;transport=tls
client_uri=sip:${selectedPbx.username}@sip.mandela.africa
expiration=300

[mandela-auth]
type=auth
auth_type=userpass
username=${selectedPbx.username}
password=s0vereign_M@ndela_2026_Key!
realm=${selectedPbx.realm}

[mandela-endpoint]
type=endpoint
context=from-mandela
dtmf_mode=rfc4733
disallow=all
allow=opus,g722,alaw
media_encryption=sdes`;
      case 'cisco':
        return `! Cisco Unified Communications Manager / CUBE Config
voice class uri 100 sip
 host ipv4 102.134.88.10
 host ipv4 102.134.88.20
 host ipv4 102.134.88.30
!
dial-peer voice 100 voip
 destination-pattern +23412345...
 session protocol sipv2
 session target dns:sip.mandela.africa
 session transport tcp tls
 srtp
 codec opus`;
      case 'freeswitch':
        return `<!-- conf/sip_profiles/external/mandela.xml -->
<include>
  <gateway name="mandela-anycast">
    <param name="realm" value="${selectedPbx.realm}"/>
    <param name="username" value="${selectedPbx.username}"/>
    <param name="password" value="s0vereign_M@ndela_2026_Key!"/>
    <param name="proxy" value="sip.mandela.africa:5061"/>
    <param name="register-transport" value="tls"/>
    <param name="register" value="true"/>
    <param name="expire-seconds" value="300"/>
    <param name="sip-ip" value="auto-nat"/>
  </gateway>
</include>`;
      case '3cx':
        return `3CX Generic SIP Trunk Configuration:
Registrar / Server: sip.mandela.africa
Port: 5061 (TLS)
Authentication ID: ${selectedPbx.username}
Password: [Generated Password]
Outbound Proxy: 102.134.88.10 (Anycast Nearest PoP)
SRTP: Required
Codecs: Opus, G.711a`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Novice Header Card (PRD Section 4.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Connect Your Office PBX & SIP Trunk</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4.1 & 9.1</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Eliminate foreign dependency. Route your company&apos;s PBX directly to Mandela&apos;s sovereign African SIP core in 3 simple steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPbxId}
            onChange={(e) => setSelectedPbxId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none"
          >
            {credentials.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName} ({c.username})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step 1 & 2: Whitelist & Credentials (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* STEP 1: Firewall Whitelist Anycast IPs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Whitelist 3 Anycast IP Addresses on Your Firewall
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Mandela broadcasts anycast BGP routing across Africa. Allow signaling and SRTP media packets through your corporate firewall for these 3 sovereign IP addresses:
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {SBC_ANYCAST_IPS.map((ip, index) => (
                <div
                  key={ip}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-500 block">Anycast #{index + 1}</span>
                    <span className="text-amber-300 font-bold text-[11px]">{ip}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(ip, `ip-${ip}`)}
                    className="text-slate-500 hover:text-white p-1"
                    title="Copy IP"
                  >
                    {copiedKey === `ip-${ip}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Ports to open: 5061 (TLS Signaling), 5060 (UDP), 10000–20000 (SRTP Media Relay)
            </div>
          </div>

          {/* STEP 2: SIP Credentials */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Enter SIP Credentials in Your PBX
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">SIP Domain / Registrar</span>
                  <span className="text-white font-bold">{selectedPbx.sipDomain}</span>
                </div>
                <button
                  onClick={() => handleCopy(selectedPbx.sipDomain, 'domain')}
                  className="text-slate-500 hover:text-white p-1"
                >
                  {copiedKey === 'domain' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">SIP Username</span>
                    <span className="text-amber-300 font-bold">{selectedPbx.username}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedPbx.username, 'username')}
                    className="text-slate-500 hover:text-white p-1"
                  >
                    {copiedKey === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Auth Password</span>
                    <span className="text-emerald-400 font-bold">••••••••••••••</span>
                  </div>
                  <button
                    onClick={() => handleCopy('s0vereign_M@ndela_2026_Key!', 'pwd')}
                    className="text-slate-500 hover:text-white p-1"
                    title="Copy Password"
                  >
                    {copiedKey === 'pwd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">Bound Sovereign DIDs (System 1)</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPbx.assignedDids.map((did) => (
                      <span key={did} className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                        {did}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Test Call & Ready-Made Snippets (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* STEP 3: Live Verification & Test Call */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Test Call & Registration Verification
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Status: {selectedPbx.registrationStatus.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Click &ldquo;Verify PBX Registration&rdquo; to send an automated test SIP OPTIONS/INVITE handshake from our Anycast edge to your PBX.
            </p>

            <button
              onClick={handleRunTestCall}
              disabled={isTesting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Probing SIP Register from Nearest PoP...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Verify PBX Registration & Test Call</span>
                </>
              )}
            </button>

            {/* Test Result Callout */}
            {testResult && (
              <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PBX Registered from {testResult.pop} PoP</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {testResult.message}
                </p>
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1 border-t border-emerald-900/60">
                  <div>
                    <span className="text-slate-400 block">Edge PoP:</span>
                    <span className="text-amber-300 font-bold">{testResult.pop} (BGP Nearest)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">RTT Latency:</span>
                    <span className="text-white font-bold">{testResult.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Crypto:</span>
                    <span className="text-emerald-400 font-bold">SRTP Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PBX Copy-Paste Configuration Snippets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                PBX Configuration Templates
              </span>
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                {(['asterisk', 'cisco', 'freeswitch', '3cx'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      activeTab === t ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400/90 overflow-x-auto max-h-52">
                {getPbxConfigSnippet()}
              </pre>
              <button
                onClick={() => handleCopy(getPbxConfigSnippet(), 'snippet')}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 text-xs flex items-center gap-1 font-mono"
              >
                {copiedKey === 'snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
