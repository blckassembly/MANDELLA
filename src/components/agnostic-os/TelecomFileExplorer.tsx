import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, Download, Eye, Copy, Check, Search, HardDrive } from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  path: string;
  size: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  contentPreview?: string;
  lastModified: string;
}

const FILE_SYSTEM_TREE: FileNode[] = [
  {
    id: 'f-etc',
    name: 'etc',
    path: '/etc',
    size: '124 KB',
    type: 'folder',
    lastModified: '2026-10-25 10:20',
    children: [
      {
        id: 'f-mnd',
        name: 'mandela',
        path: '/etc/mandela',
        size: '84 KB',
        type: 'folder',
        lastModified: '2026-10-25 10:20',
        children: [
          {
            id: 'f-sip-conf',
            name: 'sip.conf',
            path: '/etc/mandela/sip.conf',
            size: '3.4 KB',
            type: 'file',
            lastModified: '2026-10-25 09:12',
            contentPreview: `[general]
bindport=5060
bindaddr=0.0.0.0
srvlookup=yes
disallow=all
allow=opus
allow=amr-wb
allow=g711u
dtmfmode=rfc2833
rtpengine_host=rtpengine-cluster-1`
          },
          {
            id: 'f-fs-xml',
            name: 'freeswitch.xml',
            path: '/etc/mandela/freeswitch.xml',
            size: '8.2 KB',
            type: 'file',
            lastModified: '2026-10-24 16:40',
            contentPreview: `<?xml version="1.0"?>
<document type="freeswitch/xml">
  <section name="configuration" description="Anycast Media Core">
    <configuration name="switch.conf" description="Core Settings">
      <settings>
        <param name="max-sessions" value="1000"/>
        <param name="sessions-per-second" value="200"/>
        <param name="rtp-start-port" value="10000"/>
        <param name="rtp-end-port" value="20000"/>
      </settings>
    </configuration>
  </section>
</document>`
          },
          {
            id: 'f-ncco-json',
            name: 'ncco_agri_dialplan.json',
            path: '/etc/mandela/ncco_agri_dialplan.json',
            size: '1.9 KB',
            type: 'file',
            lastModified: '2026-10-26 14:02',
            contentPreview: `{
  "flowName": "Eldoret Agronomy Hotline",
  "entryNumber": "+254700000001",
  "actions": [
    { "action": "answer" },
    { "action": "talk", "text": "Karibu kwenye huduma ya kilimo", "voice": "sw-KE-Zawadi-Neural" },
    { "action": "connect", "endpoint": [{ "type": "sip", "uri": "sip:agri@nbo.mandela.cloud" }] }
  ]
}`
          }
        ]
      }
    ]
  },
  {
    id: 'f-var',
    name: 'var',
    path: '/var',
    size: '1.2 GB',
    type: 'folder',
    lastModified: '2026-10-26 20:00',
    children: [
      {
        id: 'f-log',
        name: 'log',
        path: '/var/log',
        size: '840 MB',
        type: 'folder',
        lastModified: '2026-10-26 20:00',
        children: [
          {
            id: 'f-cdr',
            name: 'cdr-2026-10-26.parquet',
            path: '/var/log/cdr-2026-10-26.parquet',
            size: '42.8 MB',
            type: 'file',
            lastModified: '2026-10-26 19:55',
            contentPreview: `[Apache Parquet Telecom Mediated Stream]
Columns: session_id, from_e164, to_e164, duration_sec, mos_score, ingress_carrier, egress_carrier, margin_usd
Row count: 184,920 records mediated via Kafka -> S3`
          },
          {
            id: 'f-sip-pcap',
            name: 'call-eld-90214.pcap',
            path: '/var/log/call-eld-90214.pcap',
            size: '8.4 MB',
            type: 'file',
            lastModified: '2026-10-26 19:40',
            contentPreview: `[Libpcap Packet Capture Header - RFC 3550 RTP Stream]
Magic: 0xa1b2c3d4 | Version: 2.4 | Snaplen: 65535
SIP INVITE, 100 Trying, 180 Ringing, 200 OK, ACK
30-second RTP Opus 48kHz audio payload (Eldoret Maize Farmer Advisory)`
          }
        ]
      }
    ]
  }
];

export const TelecomFileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/etc/mandela');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(
    FILE_SYSTEM_TREE[0].children![0].children![2] // ncco_agri_dialplan.json
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans text-xs select-text rounded-b-xl overflow-hidden border border-slate-800">
      {/* Top Address & Breadcrumb Bar (Windows Explorer Style) */}
      <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded flex-1 min-w-0 font-mono text-[11px] text-slate-300">
            <span className="text-slate-500">root@core:</span>
            <span className="text-emerald-400 truncate font-semibold">{currentPath}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-44 sm:w-56 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dialplans, pcap..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-white text-xs font-mono placeholder-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Dual-Pane Explorer View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Navigator */}
        <div className="w-48 sm:w-56 border-r border-slate-800 bg-slate-900/40 p-2 overflow-y-auto space-y-1 font-mono text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">File Tree</div>
          {FILE_SYSTEM_TREE.map((rootNode) => (
            <div key={rootNode.id} className="space-y-0.5">
              <div
                onClick={() => setCurrentPath(rootNode.path)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer text-slate-300 font-semibold"
              >
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>{rootNode.name}</span>
              </div>
              {rootNode.children?.map((subNode) => (
                <div key={subNode.id} className="pl-4 space-y-0.5">
                  <div
                    onClick={() => setCurrentPath(subNode.path)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer text-slate-400 font-medium"
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{subNode.name}</span>
                  </div>
                  {subNode.children?.map((leaf) => (
                    <div
                      key={leaf.id}
                      onClick={() => {
                        setSelectedFile(leaf);
                        setCurrentPath(leaf.path);
                      }}
                      className={`pl-4 flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors text-[11px] ${
                        selectedFile?.id === leaf.id
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{leaf.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right File Detail & Code Preview Pane */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3">
          {selectedFile ? (
            <div className="space-y-3 font-mono">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{selectedFile.name}</div>
                    <div className="text-slate-400 text-xs">
                      {selectedFile.path} · {selectedFile.size} · Modified {selectedFile.lastModified}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyPath(selectedFile.path)}
                    className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Path</span>
                  </button>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(selectedFile.contentPreview || '')}`}
                    download={selectedFile.name}
                    className="px-2.5 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Code Preview Viewer */}
              <div className="space-y-1">
                <div className="text-zinc-400 text-xs font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>File Content Inspector</span>
                </div>
                <pre className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-200 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                  {selectedFile.contentPreview}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono">
              Select a file on the left to preview configuration or packet capture.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
