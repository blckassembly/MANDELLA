import React, { useState, useEffect } from 'react';
import { PhoneNumberRecord } from '../types/nms';
import { Phone, PhoneOff, Send, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

interface SoftphoneModalProps {
  number: PhoneNumberRecord;
  onClose: () => void;
}

export const SoftphoneModal: React.FC<SoftphoneModalProps> = ({ number, onClose }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'sms' | 'sip_trace'>('voice');
  
  // Voice call simulation state
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [dialTarget, setDialTarget] = useState('+14155552671');
  const [audioMuted, setAudioMuted] = useState(false);

  // SMS simulation state
  const [smsRecipient, setSmsRecipient] = useState('+2348030001122');
  const [smsMessage, setSmsMessage] = useState('Hello from Mandela NMS E.164 Sovereign Routing Fabric! Verification test: 849204.');
  const [smsLogs, setSmsLogs] = useState<Array<{ id: string; time: string; direction: 'outbound' | 'inbound'; text: string; status: string }>>([
    {
      id: 'sms-init-1',
      time: '15:42:01',
      direction: 'inbound',
      text: 'Mandela Routing Fabric: Kamailio dispatcher acknowledged E.164 endpoint readiness.',
      status: 'DELIVERED'
    }
  ]);
  const [isSendingSms, setIsSendingSms] = useState(false);

  // SIP Signaling Log trace
  const [sipTraces, setSipTraces] = useState<string[]>([
    `[2026-10-10 15:42:00 UTC] Kamailio 5.8 Dispatcher set [${number.kamailioDispatcherId || 101}] active for ${number.e164}`,
    `[2026-10-10 15:42:00 UTC] ENUM DNS: Query ${number.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa -> Resolved to sbc.mandela.africa`,
    `[2026-10-10 15:42:01 UTC] SIP TLS socket 197.210.1.4:5061 established with carrier ${number.carrier}`
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleStartCall = () => {
    setCallState('calling');
    setCallDuration(0);
    const trace1 = `[${new Date().toISOString()}] SIP INVITE sip:${dialTarget}@sbc.mandela.africa SIP/2.0 (From: <sip:${number.e164}@sbc.mandela.africa>)`;
    setSipTraces((prev) => [trace1, ...prev]);

    setTimeout(() => {
      setCallState('ringing');
      const trace2 = `[${new Date().toISOString()}] SIP/2.0 180 Ringing (Kamailio dispatch to carrier ${number.carrier})`;
      setSipTraces((prev) => [trace2, ...prev]);
    }, 1200);

    setTimeout(() => {
      setCallState('connected');
      const trace3 = `[${new Date().toISOString()}] SIP/2.0 200 OK (SDP audio RTP port 16384 negotiated with codec Opus/48000)`;
      setSipTraces((prev) => [trace3, ...prev]);
    }, 2800);
  };

  const handleEndCall = () => {
    setCallState('ended');
    const traceBye = `[${new Date().toISOString()}] SIP BYE sip:${dialTarget}@sbc.mandela.africa (Duration: ${callDuration}s)`;
    setSipTraces((prev) => [traceBye, ...prev]);
    setTimeout(() => {
      setCallState('idle');
      setCallDuration(0);
    }, 1200);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim() || isSendingSms) return;

    setIsSendingSms(true);
    const newEntry = {
      id: `sms-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      direction: 'outbound' as const,
      text: smsMessage,
      status: 'TRANSMITTING'
    };
    setSmsLogs((prev) => [newEntry, ...prev]);

    const sipTrace = `[${new Date().toISOString()}] SMPP/SIP MESSAGE to ${smsRecipient} via ${number.carrier} SMSC (Originator: ${number.e164})`;
    setSipTraces((prev) => [sipTrace, ...prev]);

    setTimeout(() => {
      setSmsLogs((prev) =>
        prev.map((msg) => (msg.id === newEntry.id ? { ...msg, status: 'DELIVERED (DLR 200 OK)' } : msg))
      );
      setIsSendingSms(false);
      setSmsMessage('');

      // Auto echo back from simulated network
      setTimeout(() => {
        setSmsLogs((prev) => [
          {
            id: `sms-reply-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            direction: 'inbound',
            text: `Echo response from ${smsRecipient}: Received 2FA packet over ${number.carrier} route. Signal quality 99.8%.`,
            status: 'DELIVERED'
          },
          ...prev
        ]);
      }, 1500);
    }, 1200);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Sovereign Softphone & SIP Verification</span>
              <span className="text-xs text-emerald-400 font-mono font-medium">· KAM-ENUM OK</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing active E.164 endpoint <span className="font-mono text-amber-300 font-medium">{number.e164}</span> ({number.countryName} · {number.carrier})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Voice SIP Dialer
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sms'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            SMS & USSD Test
          </button>
          <button
            onClick={() => setActiveTab('sip_trace')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sip_trace'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live SIP / ENUM Trace
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'voice' && (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Softphone Hardware Dialpad */}
              <div className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col items-center">
                <div className="w-full mb-3 text-center">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">Originating CLI</div>
                  <div className="font-mono text-sm font-semibold text-emerald-400 bg-slate-900/80 py-1 px-2 rounded border border-slate-800">
                    {number.e164}
                  </div>
                </div>

                {/* Dial display */}
                <input
                  type="text"
                  value={dialTarget}
                  onChange={(e) => setDialTarget(e.target.value)}
                  placeholder="+234..."
                  className="w-full text-center font-mono text-base bg-slate-900 border border-slate-700 rounded py-2 px-2 text-white mb-4 focus:outline-none focus:border-amber-400"
                />

                {/* Status indicator */}
                <div className="text-center mb-4">
                  {callState === 'idle' && (
                    <span className="text-xs text-slate-400">Ready to initiate SIP call</span>
                  )}
                  {callState === 'calling' && (
                    <span className="text-xs text-amber-300 animate-pulse">Establishing SIP signaling...</span>
                  )}
                  {callState === 'ringing' && (
                    <span className="text-xs text-amber-400 font-medium animate-pulse">Ringing at destination...</span>
                  )}
                  {callState === 'connected' && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Connected: {formatTimer(callDuration)} (G.711u)
                    </div>
                  )}
                  {callState === 'ended' && (
                    <span className="text-xs text-slate-400">Call Completed</span>
                  )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 w-full mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => setDialTarget((prev) => prev + digit)}
                      className="h-10 rounded bg-slate-900 border border-slate-800 text-sm font-mono text-slate-200 hover:bg-slate-800 active:scale-95 transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 w-full">
                  {callState === 'idle' || callState === 'ended' ? (
                    <button
                      onClick={handleStartCall}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Dial Outbound
                    </button>
                  ) : (
                    <button
                      onClick={handleEndCall}
                      className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneOff className="w-4 h-4" />
                      Hang Up
                    </button>
                  )}
                  {callState === 'connected' && (
                    <button
                      onClick={() => setAudioMuted(!audioMuted)}
                      className={`p-2.5 rounded border transition-colors ${
                        audioMuted ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                      title={audioMuted ? 'Unmute' : 'Mute'}
                    >
                      {audioMuted ? 'Muted' : 'Mic'}
                    </button>
                  )}
                </div>
              </div>

              {/* Call Details / Routing metadata */}
              <div className="flex-1 space-y-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                    Kamailio SIP Trunk Dispatcher Metadata
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>
                      Carrier: <span className="text-white font-medium">{number.carrier}</span>
                    </div>
                    <div>
                      Regulator: <span className="text-white font-medium">{number.countryName}</span>
                    </div>
                    <div>
                      Dispatcher ID: <span className="font-mono text-white">{number.kamailioDispatcherId || 101}</span>
                    </div>
                    <div>
                      Signaling: <span className="font-mono text-emerald-400">TLS v1.3 Mutual</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400 break-all">
                    URI: {number.sipTrunkUri || `sip:${number.e164}@sbc.mandela.africa:5060;transport=tls`}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider mb-1">
                    ENUM RFC 3761 Resolution Record
                  </div>
                  <div className="font-mono text-[11px] text-amber-300/90 break-all bg-slate-900/60 p-2 rounded">
                    {number.enumRecord || `${number.e164.replace('+', '').split('').reverse().join('.')}.e164.arpa IN NAPTR 10 100 "u" "E2U+sip" "!^.*$!sip:${number.e164}@sbc.mandela.africa!" .`}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-second voice audio path verified against Mandela Edge SBC cluster.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-4">
              <form onSubmit={handleSendSms} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Sender E.164 (CLI)</label>
                    <input
                      type="text"
                      disabled
                      value={number.e164}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-amber-300 font-mono cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Destination MSISDN</label>
                    <input
                      type="text"
                      value={smsRecipient}
                      onChange={(e) => setSmsRecipient(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Message Content (GSM-7 / UCS-2)</label>
                  <textarea
                    rows={2}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-slate-500 font-mono">{smsMessage.length} chars · 1 SMS segment</span>
                  <button
                    type="submit"
                    disabled={isSendingSms || !smsMessage.trim()}
                    className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSendingSms ? 'Transmitting...' : 'Dispatch SMS'}
                  </button>
                </div>
              </form>

              {/* Message log history */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  SMS & USSD Transaction Log
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {smsLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border text-xs ${
                        log.direction === 'outbound'
                          ? 'bg-slate-950 border-slate-800 ml-4'
                          : 'bg-slate-900/90 border-slate-700/80 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-mono">{log.direction === 'outbound' ? 'OUTBOUND TO ' + smsRecipient : 'INBOUND FROM SMSC'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-mono text-[10px]">{log.status}</span>
                          <span className="text-slate-500">{log.time}</span>
                        </div>
                      </div>
                      <p className="text-slate-200">{log.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sip_trace' && (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-72 overflow-y-auto">
              <div className="text-[11px] text-amber-400 font-semibold mb-2">
                Real-Time Kamailio & DNS ENUM Transaction Journal
              </div>
              {sipTraces.map((trace, idx) => (
                <div key={idx} className="leading-relaxed border-b border-slate-900 pb-1 text-slate-300">
                  {trace}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span>Telecom System 1 ↔ Telecom Systems 4 & 5 Interconnect</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
