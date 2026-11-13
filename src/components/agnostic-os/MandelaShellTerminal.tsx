import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Copy, Check, CornerDownLeft, Sparkles } from 'lucide-react';
import { INITIAL_LIVE_CALLS, INITIAL_PROVIDERS } from '../../data/mockAgnosticData';
import { LiveCallSession, ProviderCapability } from '../../types/agnosticOS';

interface HistoryEntry {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const MandelaShellTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init-1',
      command: 'uname -a',
      output: (
        <span className="text-emerald-400">
          Linux mandela-core-edge-01 6.8.0-45-generic-telecom #45-Ubuntu SMP PREEMPT_DYNAMIC Sun Oct 25 14:10:00 UTC 2026 aarch64 GNU/Linux (RT-PREEMPT Realtime Telecom Kernel)
        </span>
      ),
      timestamp: '00:00:01'
    },
    {
      id: 'init-2',
      command: 'freeswitch -version',
      output: (
        <div className="space-y-0.5">
          <span className="text-cyan-300">FreeSWITCH Version 1.10.12-release-mandela-carrier-patch5 (git e9a8b1c) 64bit</span>
          <div className="text-slate-400 text-xs">
            [SIP Engine: Kamailio 5.7.4 Anycast] [RTPEngine: v11.5.1.25] [ASR: 50 African Languages Neural Streaming]
          </div>
        </div>
      ),
      timestamp: '00:00:02'
    },
    {
      id: 'init-3',
      command: 'help',
      output: (
        <div className="text-slate-300 text-xs space-y-1">
          <div className="text-amber-300 font-bold">Mandela OS Telecom Shell (msh v2.4.0)</div>
          <div>Available Linux &amp; Telecom Core Commands:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-slate-400 font-mono mt-1">
            <div><span className="text-white font-bold">ps aux</span> - List active processes</div>
            <div><span className="text-white font-bold">top</span> - CPU/RAM load snapshot</div>
            <div><span className="text-white font-bold">call list</span> - Show live SIP sessions</div>
            <div><span className="text-white font-bold">call barge &lt;id&gt;</span> - 3-way conference</div>
            <div><span className="text-white font-bold">call whisper &lt;id&gt;</span> - Coach agent</div>
            <div><span className="text-white font-bold">call hangup &lt;id&gt;</span> - Terminate session</div>
            <div><span className="text-white font-bold">provider list</span> - List cloud adapters</div>
            <div><span className="text-white font-bold">provider test</span> - Probe SIP &amp; ASR latency</div>
            <div><span className="text-white font-bold">numbers list</span> - 54 African countries ITU inventory</div>
            <div><span className="text-white font-bold">tcpdump</span> - Inspect SIP packet headers</div>
            <div><span className="text-white font-bold">cat /etc/sip.conf</span> - Read SIP configuration</div>
            <div><span className="text-white font-bold">cat /etc/dialplan</span> - Read VoiceXML flow</div>
            <div><span className="text-white font-bold">netstat -tlpn</span> - List listening ports</div>
            <div><span className="text-white font-bold">uptime</span> - Kernel uptime &amp; load</div>
            <div><span className="text-white font-bold">clear</span> - Clear terminal buffer</div>
            <div><span className="text-white font-bold">help</span> - Display this guide</div>
          </div>
          <div className="text-slate-500 pt-1 italic">Tip: Type any command or click suggestions below.</div>
        </div>
      ),
      timestamp: '00:00:03'
    }
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['uname -a', 'freeswitch -version', 'help']);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const timestamp = new Date().toLocaleTimeString();
    let output: React.ReactNode = null;

    switch (cmd) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'help':
        output = (
          <div className="text-slate-300 text-xs space-y-1">
            <div className="text-amber-300 font-bold">Mandela OS Telecom Shell (msh v2.4.0)</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-slate-400 font-mono mt-1">
              <div><span className="text-white font-bold">ps aux</span> : Active telecom daemons</div>
              <div><span className="text-white font-bold">top</span> : System resource telemetry</div>
              <div><span className="text-white font-bold">call list</span> : Real-time active SIP channels</div>
              <div><span className="text-white font-bold">call barge &lt;id&gt;</span> : Join live media stream</div>
              <div><span className="text-white font-bold">provider list</span> : Telecom &amp; AI providers</div>
              <div><span className="text-white font-bold">tcpdump</span> : Hex SIP header trace</div>
              <div><span className="text-white font-bold">cat &lt;file&gt;</span> : Inspect configs &amp; dialplans</div>
              <div><span className="text-white font-bold">netstat</span> : Ports (5060, 10000-20000)</div>
              <div><span className="text-white font-bold">clear</span> : Clear terminal output</div>
            </div>
          </div>
        );
        break;

      case 'uname':
        output = (
          <span className="text-emerald-400">
            Linux mandela-core-edge-01 6.8.0-45-generic-telecom #45-Ubuntu SMP PREEMPT_DYNAMIC Sun Oct 25 14:10:00 UTC 2026 aarch64 GNU/Linux
          </span>
        );
        break;

      case 'whoami':
        output = <span className="text-cyan-300">root (Tenant: Safaricom Sovereign PLC - ID: 0)</span>;
        break;

      case 'uptime':
        output = (
          <span className="text-slate-300">
            20:14:10 up 42 days, 18:32, 4 active supervisors, load average: 0.24, 0.31, 0.28 (FreeSWITCH 1000 CPS capacity: 94.2% available)
          </span>
        );
        break;

      case 'ps':
        output = (
          <div className="font-mono text-xs text-slate-300 space-y-0.5 overflow-x-auto">
            <div className="text-slate-500 font-bold">PID  USER     %CPU %MEM   VSZ   RSS STAT START   TIME COMMAND</div>
            <div className="text-emerald-400">   1 root      0.1  0.2 16892  9820 Ss   Oct15  12:44 /sbin/init systemd</div>
            <div className="text-cyan-300"> 812 freesw    4.2  8.4 892040 342010 Ssl Oct15 480:12 /usr/bin/freeswitch -ncwait -nonat</div>
            <div className="text-cyan-300"> 815 kamailio  1.8  3.1 412030 128900 Ssl Oct15 210:45 /usr/sbin/kamailio -P /var/run/kamailio.pid</div>
            <div className="text-amber-300"> 820 rtpeng    3.1  4.6 620100 189200 Ssl Oct15 390:01 /usr/sbin/rtpengine -f -p /var/run/rtpengine.pid</div>
            <div className="text-purple-300"> 904 ai-agent  2.4  6.1 720040 240100 Ssl Oct15 180:22 /opt/mandela/bin/african-asr-stream --workers=16</div>
            <div className="text-slate-400"> 910 node      1.2  2.8 380200 115000 Ssl Oct15  94:10 node /app/applet/server.ts</div>
          </div>
        );
        break;

      case 'top':
        output = (
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <div className="text-amber-300">
              Tasks: 184 total, 1 running, 183 sleeping, 0 stopped, 0 zombie
            </div>
            <div className="text-emerald-400">
              %Cpu(s): 7.2 us, 2.1 sy, 0.0 ni, 90.3 id, 0.2 wa, 0.0 hi, 0.2 si
            </div>
            <div className="text-cyan-300">
              MiB Mem :  32140.4 total,  18920.1 free,   7420.2 used,   5800.1 buff/cache
            </div>
            <div className="text-slate-400">
              Active RTP Media Streams: 48 channels · Active SIP Registrations: 1,420 trunks · MOS Score: 4.42
            </div>
          </div>
        );
        break;

      case 'netstat':
        output = (
          <div className="font-mono text-xs text-slate-300 space-y-0.5 overflow-x-auto">
            <div className="text-slate-500 font-bold">Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program</div>
            <div className="text-emerald-400">tcp        0      0 0.0.0.0:5060            0.0.0.0:*               LISTEN      815/kamailio</div>
            <div className="text-emerald-400">udp        0      0 0.0.0.0:5060            0.0.0.0:*                           815/kamailio</div>
            <div className="text-cyan-300">tcp        0      0 127.0.0.1:8021          0.0.0.0:*               LISTEN      812/freeswitch (ESL)</div>
            <div className="text-amber-300">udp        0      0 0.0.0.0:10000:20000     0.0.0.0:*                           820/rtpengine</div>
            <div className="text-purple-300">tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN      910/node (server.ts)</div>
          </div>
        );
        break;

      case 'call': {
        const sub = args[0]?.toLowerCase();
        if (sub === 'list' || !sub) {
          output = (
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">Active FreeSWITCH Bridges ({INITIAL_LIVE_CALLS.length}):</div>
              {INITIAL_LIVE_CALLS.map((c: LiveCallSession) => (
                <div key={c.id} className="p-1.5 rounded bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-cyan-300 font-bold">{c.id}</span>
                  <span className="text-white">{c.from} ({c.fromLabel})</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-emerald-400">{c.to}</span>
                  <span className="text-purple-300">[{c.selectedLanguage || 'sw-KE'}]</span>
                  <span className="text-amber-300">MOS: {c.mosScore}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold uppercase">{c.state}</span>
                </div>
              ))}
            </div>
          );
        } else if (sub === 'barge' || sub === 'whisper' || sub === 'listen') {
          const callId = args[1] || INITIAL_LIVE_CALLS[0].id;
          output = (
            <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs space-y-1">
              <div className="font-bold">✔ FreeSWITCH Media Bridge Command Accepted</div>
              <div>Action: <strong className="text-white uppercase">{sub}</strong> on Session <strong className="text-white">{callId}</strong></div>
              <div>Media Port: <span className="text-cyan-300">19824/udp (RTPEngine)</span> · Supervisor Bridge: <span className="text-cyan-300">sup-admin-01</span></div>
              <div className="text-[11px] text-emerald-400">Audio stream mix successful. Supervisor audio packet injection active.</div>
            </div>
          );
        } else if (sub === 'hangup') {
          const callId = args[1] || INITIAL_LIVE_CALLS[0].id;
          output = (
            <div className="p-2 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-xs">
              ✔ Session <strong className="text-white">{callId}</strong> sent BYE (Q.850 Cause: 16 Normal Clearing). FreeSWITCH channel terminated. S3 CDR committed.
            </div>
          );
        } else {
          output = <span className="text-red-400">Usage: call [list | barge &lt;id&gt; | whisper &lt;id&gt; | listen &lt;id&gt; | hangup &lt;id&gt;]</span>;
        }
        break;
      }

      case 'provider': {
        const sub = args[0]?.toLowerCase();
        if (sub === 'list' || !sub) {
          output = (
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <div className="text-cyan-300 font-bold">Registered Agnostic Providers ({INITIAL_PROVIDERS.length}):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {INITIAL_PROVIDERS.map((p: ProviderCapability) => (
                  <div key={p.id} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{p.name}</span>
                      <span className={`px-1 py-0.2 rounded text-[10px] ${p.status === 'healthy' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px]">{p.category} · Ping: {p.latencyAvgMs}ms</div>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (sub === 'test') {
          output = (
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400 font-bold">Probing All Provider Adapters via gRPC / SIP OPTIONS:</div>
              <div className="text-slate-300">FreeSWITCH Anycast Mesh: <span className="text-emerald-400">12ms (OK - G.711u / Opus / AMR-WB)</span></div>
              <div className="text-slate-300">Mandela Neural ASR (System 7): <span className="text-emerald-400">42ms (OK - 50 African Languages Active)</span></div>
              <div className="text-slate-300">Gemini 3.8 Flash Gateway: <span className="text-emerald-400">88ms (OK - Reasoning ready)</span></div>
              <div className="text-slate-300">RTPEngine Cluster 1 (Lagos): <span className="text-emerald-400">8ms (OK - Kernel forwarding active)</span></div>
            </div>
          );
        }
        break;
      }

      case 'numbers':
      case 'inventory': {
        const sub = args[0]?.toLowerCase() || 'list';
        if (sub === 'list' || sub === 'ls') {
          output = (
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400 font-bold">PAN-AFRICA NUMBER INVENTORY (54 COUNTRIES · ITU REGULATORY SPECS)</div>
              <div className="text-slate-400 text-[10px]">Active Aggregators: DIDWW · Twilio · DIDLogic · Safaricom · MTN · Vodacom</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>🇰🇪 Kenya (+254)</span>
                    <span className="text-emerald-400 text-[10px]">NBO-20</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">+254 20 790 3100 · DIDWW · Voice &amp; SMS</div>
                  <div className="text-[10px] text-emerald-400 font-mono">STATUS: AVAILABLE · $4.50/mo (KES 585)</div>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>🇳🇬 Nigeria (+234)</span>
                    <span className="text-emerald-400 text-[10px]">LOS-1</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">+234 1 888 4200 · DIDWW · Voice (SIP)</div>
                  <div className="text-[10px] text-emerald-400 font-mono">STATUS: AVAILABLE · $6.00/mo (NGN 9,600)</div>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>🇿🇦 South Africa (+27)</span>
                    <span className="text-emerald-400 text-[10px]">JNB-11</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">+27 11 902 4500 · Twilio · Voice &amp; SMS</div>
                  <div className="text-[10px] text-emerald-400 font-mono">STATUS: AVAILABLE · $3.50/mo (ZAR 64.75)</div>
                </div>
                <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>🇬🇭 Ghana (+233)</span>
                    <span className="text-emerald-400 text-[10px]">ACC-30</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">+233 30 299 1234 · DIDLogic · Voice</div>
                  <div className="text-[10px] text-emerald-400 font-mono">STATUS: AVAILABLE · $7.00/mo (GHS 108.50)</div>
                </div>
              </div>
              <div className="text-slate-400 text-[10px] pt-1">
                Run REST query: <span className="text-cyan-400">curl /api/v1/numbers/inventory</span> or open GUI application.
              </div>
            </div>
          );
        } else if (sub === 'sync') {
          output = (
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-cyan-400 font-bold">Synchronizing Aggregator Suppliers...</div>
              <div className="text-slate-300">DIDWW API: 3 DIDs refreshed (Lagos, Nairobi, Johannesburg)</div>
              <div className="text-slate-300">Twilio API: 2 DIDs refreshed (Cape Town, Accra)</div>
              <div className="text-slate-300">DIDLogic API: 1 DID refreshed (Cairo)</div>
              <div className="text-emerald-400 font-bold mt-1">SUCCESS: Unified inventory cache updated (TTL 3600s).</div>
            </div>
          );
        }
        break;
      }

      case 'cat': {
        const file = args[0];
        if (file?.includes('sip.conf') || file?.includes('freeswitch.xml')) {
          output = (
            <pre className="font-mono text-[11px] text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre">
{`<configuration name="sofia.conf" description="Mandela Anycast SIP Profile">
  <global_settings>
    <param name="log-level" value="0"/>
    <param name="auto-restart" value="true"/>
  </global_settings>
  <profiles>
    <profile name="internal">
      <settings>
        <param name="sip-ip" value="anycast.mandela.cloud"/>
        <param name="sip-port" value="5060"/>
        <param name="rtp-ip" value="rtp.mandela.cloud"/>
        <param name="codec-prefs" value="OPUS,AMR-WB,G711U,G711A"/>
        <param name="dtmf-type" value="rfc2833"/>
        <param name="rtp-engine" value="rtpengine-cluster-01"/>
        <param name="record-template" value="/var/recordings/\${uuid}.wav"/>
      </settings>
    </profile>
  </profiles>
</configuration>`}
            </pre>
          );
        } else if (file?.includes('dialplan') || file?.includes('ncco')) {
          output = (
            <pre className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre">
{`{
  "workflow": "Eldoret Agronomy Hotline (NCCO)",
  "version": "2.1.0",
  "entryNumber": "+254700000001",
  "actions": [
    { "action": "answer", "mediaServer": "freeswitch-nbo-01" },
    { "action": "talk", "text": "Karibu kwenye huduma ya ushauri wa kilimo", "voice": "sw-KE-Zawadi-Neural" },
    { "action": "ai_agent", "model": "gemini-3.8-flash", "codeSwitching": true },
    { "action": "connect", "endpoint": [{ "type": "sip", "uri": "sip:agri-officer@nbo.mandela.cloud" }] }
  ]
}`}
            </pre>
          );
        } else {
          output = (
            <span className="text-amber-400">
              cat: {file || 'file'}: No such file. Try <code className="text-white">cat /etc/sip.conf</code> or <code className="text-white">cat /etc/dialplan</code>.
            </span>
          );
        }
        break;
      }

      case 'tcpdump':
        output = (
          <div className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 space-y-1 overflow-x-auto">
            <div className="text-slate-500 font-bold">tcpdump -i eth0 port 5060 -n -s 0 -X -c 2 (Simulated Raw SIP Packet Capture)</div>
            <div className="text-cyan-400">
              20:14:12.890124 IP 196.201.214.10.5060 &gt; 102.134.20.5.5060: SIP, length: 780
            </div>
            <div className="text-slate-400">
              INVITE sip:+254700000001@anycast.mandela.cloud:5060 SIP/2.0<br/>
              Via: SIP/2.0/UDP 196.201.214.10:5060;branch=z9hG4bK-789a12<br/>
              From: &quot;Farmer Eldoret&quot; &lt;sip:+254711892100@safaricom.co.ke&gt;;tag=109283<br/>
              To: &lt;sip:+254700000001@anycast.mandela.cloud&gt;<br/>
              Call-ID: c8921-99214-88124@safaricom-mgw-01<br/>
              CSeq: 101 INVITE<br/>
              Contact: &lt;sip:+254711892100@196.201.214.10:5060&gt;<br/>
              Content-Type: application/sdp<br/>
              Content-Length: 240
            </div>
            <div className="text-emerald-400">
              m=audio 19824 RTP/AVP 96 0 8 101<br/>
              a=rtpmap:96 OPUS/48000/2<br/>
              a=rtpmap:101 telephone-event/8000
            </div>
          </div>
        );
        break;

      default:
        output = (
          <span className="text-red-400">
            msh: command not found: {cmd}. Type <span className="text-white font-bold underline cursor-pointer" onClick={() => executeCommand('help')}>help</span> for available commands.
          </span>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: rawCmd,
        output,
        timestamp
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    }
  };

  const copyTranscript = () => {
    const text = history.map((h) => `$ ${h.command}\n`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono text-xs select-text rounded-b-xl overflow-hidden border border-slate-800">
      {/* Shell Title & Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">mandela-sh (msh) · Linux Telecom Core CLI</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            pts/0 (root)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyTranscript}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Shell Session"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setHistory([])}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear Screen (Ctrl+L)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Commands Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-[11px] text-slate-400">
        <span className="text-slate-500 font-bold shrink-0">Quick Run:</span>
        {[
          'call list',
          'ps aux',
          'top',
          'provider test',
          'tcpdump',
          'cat /etc/sip.conf',
          'cat /etc/dialplan',
          'netstat'
        ].map((qc) => (
          <button
            key={qc}
            onClick={() => executeCommand(qc)}
            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
          >
            {qc}
          </button>
        ))}
      </div>

      {/* Terminal History Output */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 font-mono scrollbar-thin scrollbar-thumb-slate-800">
        {history.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="text-emerald-400 font-bold">root@mandela-core:~#</span>
              <span className="text-white font-bold">{entry.command}</span>
              <span className="text-slate-600 text-[10px] ml-auto">{entry.timestamp}</span>
            </div>
            <div className="pl-4 border-l border-slate-800/80">{entry.output}</div>
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Terminal Command Input Prompt */}
      <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <span className="text-emerald-400 font-bold shrink-0">root@mandela-core:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type linux or telecom command (e.g. 'call list', 'ps aux', 'help')..."
          className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-bold cursor-pointer transition-colors"
          title="Execute"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
