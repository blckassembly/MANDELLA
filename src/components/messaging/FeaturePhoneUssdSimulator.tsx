import React, { useState } from 'react';
import { Phone, PhoneOff, ArrowLeft, Send, Sparkles, Radio, MessageSquare } from 'lucide-react';

interface FeaturePhoneUssdSimulatorProps {
  initialMsisdn?: string;
  onClose?: () => void;
}

export const FeaturePhoneUssdSimulator: React.FC<FeaturePhoneUssdSimulatorProps> = ({
  initialMsisdn = '+233244123890',
  onClose
}) => {
  // Screen mode: 'idle' | 'dialing' | 'ussd_session' | 'sms_inbox' | 'sms_view' | 'ussd_push_popup'
  const [screenMode, setScreenMode] = useState<'idle' | 'dialing' | 'ussd_session' | 'sms_inbox' | 'ussd_push_popup'>('ussd_session');
  
  const [dialInput, setDialInput] = useState('*384*123#');
  const [ussdInput, setUssdInput] = useState('');
  const [sessionStep, setSessionStep] = useState(1);
  const [ussdPrompt, setUssdPrompt] = useState(
    'Mandela Agri-Connect:\n1. Weather Forecast\n2. Market Prices\n3. Instant OTP Verify\n4. Exit'
  );
  const [signalBars, setSignalBars] = useState(4);
  const [carrierBanner, setCarrierBanner] = useState('MTN GH 2G');

  // Push / SMS storage in phone
  const [receivedSmsList, setReceivedSmsList] = useState<Array<{ sender: string; time: string; text: string }>>([
    {
      sender: 'MANDELA_AGRI',
      time: '15:50',
      text: 'Ashanti Maize Market: Wholesale bag selling at GHc 420. High rainfall expected Wednesday.'
    },
    {
      sender: 'BANK_OTP',
      time: '15:42',
      text: 'Your authorization OTP is 772910. Expires in 5 minutes.'
    }
  ]);
  const [pushText, setPushText] = useState('Flash USSD Alert: Verification code 849204 received over SIGTRAN MAP link.');

  // Handle USSD replies
  const handleSendUssdReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const reply = ussdInput.trim();
    setUssdInput('');

    if (sessionStep === 1) {
      if (reply === '1') {
        setSessionStep(2);
        setUssdPrompt('Ashanti Region Weather:\nHeavy rainfall Wednesday afternoon. Winds 14km/h. Secure open crop storage.\n\n0. Back');
      } else if (reply === '2') {
        setSessionStep(2);
        setUssdPrompt('Market Commodity Prices:\n• White Maize: GHc 420/bag\n• Cassava: GHc 180/crate\n• Sorghum: GHc 310/bag\n\n0. Back');
      } else if (reply === '3') {
        setSessionStep(3);
        setUssdPrompt('Mandela Security:\nConfirm transfer of GHc 850 to Kumasi Seed Co?\n1. Approve\n2. Cancel');
      } else if (reply === '4') {
        setUssdPrompt('Session ended. Thank you for using Mandela Connect.');
        setTimeout(() => setScreenMode('idle'), 2000);
      } else {
        setUssdPrompt('Invalid option.\n1. Weather\n2. Market Prices\n3. OTP Verify\n4. Exit');
      }
    } else if (sessionStep === 2) {
      // Back
      setSessionStep(1);
      setUssdPrompt('Mandela Agri-Connect:\n1. Weather Forecast\n2. Market Prices\n3. Instant OTP Verify\n4. Exit');
    } else if (sessionStep === 3) {
      if (reply === '1') {
        setUssdPrompt('Transaction #99104 APPROVED.\nRef: TX-GH-88492. Receipt sent via SMS.\n\nPress Exit.');
        setTimeout(() => setScreenMode('idle'), 3000);
      } else {
        setUssdPrompt('Transaction cancelled.\n\nPress Exit.');
        setTimeout(() => setScreenMode('idle'), 2000);
      }
    }
  };

  const handleDialUssd = () => {
    if (dialInput.includes('*') && dialInput.includes('#')) {
      setScreenMode('ussd_session');
      setSessionStep(1);
      setUssdPrompt('Mandela Agri-Connect:\n1. Weather Forecast\n2. Market Prices\n3. Instant OTP Verify\n4. Exit');
    } else {
      alert(`Dialing voice calls not supported on USSD gateway simulator.`);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (screenMode === 'dialing' || screenMode === 'idle') {
      setScreenMode('dialing');
      setDialInput((prev) => prev + val);
    } else if (screenMode === 'ussd_session') {
      setUssdInput((prev) => prev + val);
    }
  };

  const handleTriggerSimulatedPush = () => {
    setPushText('M-PESA Flash USSD: Payment of KES 1,400 confirmed. New Balance KES 14,820.');
    setScreenMode('ussd_push_popup');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">2G Feature Phone & USSD Gateway Simulator</h2>
            <span className="text-xs text-emerald-400 font-mono font-medium">· SIGTRAN MAP over SS7</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates why System 2 reaches 100% of African feature phones with zero internet or data connectivity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSimulatedPush}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs rounded transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trigger Incoming USSD Push</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="py-1.5 px-3 bg-slate-800 text-slate-400 hover:text-white text-xs rounded"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-4">
        {/* Retro Nokia Hardware Chassis */}
        <div className="w-[320px] bg-slate-950 rounded-[40px] p-5 border-4 border-slate-700 shadow-2xl flex flex-col items-center select-none ring-1 ring-slate-800">
          {/* Earpiece slit */}
          <div className="w-14 h-1.5 bg-slate-800 rounded-full mb-4" />

          {/* Retro Green-Lit Monochrome LCD Screen */}
          <div className="w-full h-[220px] bg-[#9bb084] text-[#14230d] p-3 rounded-lg font-mono text-xs flex flex-col justify-between border-2 border-[#768b5f] shadow-inner relative overflow-hidden">
            {/* Top LCD Status Bar */}
            <div className="flex justify-between items-center text-[10px] font-bold border-b border-[#768b5f]/50 pb-1">
              <span className="flex items-center gap-1">
                {'▮'.repeat(signalBars)} <span className="tracking-tighter">{carrierBanner}</span>
              </span>
              <span>15:52</span>
              <span>🔋 94%</span>
            </div>

            {/* Screen Content */}
            <div className="flex-1 py-1.5 overflow-hidden flex flex-col justify-center">
              {screenMode === 'idle' && (
                <div className="text-center space-y-1">
                  <div className="text-[14px] font-extrabold tracking-wider mt-2">MANDELA CONNECT</div>
                  <div className="text-[10px] text-[#24351a]">2G Network · No IP Data</div>
                  <div className="text-[10px] pt-4">Press *384*123# to dial USSD</div>
                </div>
              )}

              {screenMode === 'dialing' && (
                <div className="space-y-2 text-center">
                  <div className="text-[10px] uppercase font-bold text-[#2e4023]">Dialing USSD Service:</div>
                  <div className="text-lg font-bold tracking-wider">{dialInput || '_'}</div>
                  <div className="text-[9px] text-[#24351a]">Press CALL to connect</div>
                </div>
              )}

              {screenMode === 'ussd_session' && (
                <div className="space-y-1.5 flex flex-col justify-between h-full">
                  <div className="text-[11px] leading-tight font-bold whitespace-pre-wrap overflow-y-auto max-h-[120px]">
                    {ussdPrompt}
                  </div>
                  <div className="pt-1 border-t border-[#768b5f]/60 flex items-center justify-between text-[11px]">
                    <span>Reply: <strong>{ussdInput || '_'}</strong></span>
                    <span className="text-[9px] bg-[#768b5f]/40 px-1 rounded">OK</span>
                  </div>
                </div>
              )}

              {screenMode === 'ussd_push_popup' && (
                <div className="space-y-2 text-center p-1 bg-[#8fa477] rounded border border-[#768b5f]">
                  <div className="text-[10px] uppercase font-bold text-[#213117]">★ FLASH USSD MESSAGE ★</div>
                  <div className="text-[11px] leading-tight font-bold text-left">{pushText}</div>
                  <button
                    onClick={() => setScreenMode('idle')}
                    className="text-[9px] font-bold bg-[#14230d] text-[#9bb084] px-2 py-0.5 rounded mt-1"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {screenMode === 'sms_inbox' && (
                <div className="space-y-1 overflow-y-auto max-h-[140px] text-[10px]">
                  <div className="font-bold border-b border-[#768b5f]/50 pb-0.5">INBOX (2 messages)</div>
                  {receivedSmsList.map((sms, i) => (
                    <div key={i} className="p-1 border-b border-[#768b5f]/40 leading-tight">
                      <span className="font-bold">{sms.sender}</span>: {sms.text.slice(0, 40)}...
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom LCD Function Bar */}
            <div className="flex justify-between items-center text-[10px] font-bold border-t border-[#768b5f]/50 pt-0.5">
              <span
                onClick={() => setScreenMode(screenMode === 'sms_inbox' ? 'idle' : 'sms_inbox')}
                className="cursor-pointer"
              >
                {screenMode === 'sms_inbox' ? 'Back' : 'Menu'}
              </span>
              <span
                onClick={() => {
                  if (screenMode === 'ussd_session') handleSendUssdReply();
                  else if (screenMode === 'dialing') handleDialUssd();
                }}
                className="cursor-pointer font-extrabold"
              >
                Select
              </span>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="grid grid-cols-3 gap-2 w-full my-4 px-2">
            <button
              onClick={() => {
                if (screenMode === 'dialing') handleDialUssd();
                else if (screenMode === 'ussd_session') handleSendUssdReply();
                else setScreenMode('dialing');
              }}
              className="py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Call / Send"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (screenMode === 'ussd_session') handleSendUssdReply();
                else if (screenMode === 'dialing') handleDialUssd();
              }}
              className="py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              OK
            </button>

            <button
              onClick={() => {
                setScreenMode('idle');
                setDialInput('');
                setUssdInput('');
              }}
              className="py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="End / Clear"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>

          {/* Nokia Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 w-full px-2">
            {[
              { num: '1', sub: '.,-' },
              { num: '2', sub: 'abc' },
              { num: '3', sub: 'def' },
              { num: '4', sub: 'ghi' },
              { num: '5', sub: 'jkl' },
              { num: '6', sub: 'mno' },
              { num: '7', sub: 'pqrs' },
              { num: '8', sub: 'tuv' },
              { num: '9', sub: 'wxyz' },
              { num: '*', sub: 'USSD' },
              { num: '0', sub: ' ' },
              { num: '#', sub: '⌗' }
            ].map((k) => (
              <button
                key={k.num}
                onClick={() => handleKeypadPress(k.num)}
                className="h-11 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 active:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center shadow-sm"
              >
                <span className="font-mono text-sm font-bold leading-none">{k.num}</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase leading-none mt-0.5">{k.sub}</span>
              </button>
            ))}
          </div>

          <div className="text-[10px] text-slate-600 font-mono mt-3">
            Nokia 3310 Emulation · MSISDN: {initialMsisdn}
          </div>
        </div>

        {/* Technical SIGTRAN Protocol & MAP Session Inspection Details */}
        <div className="flex-1 max-w-lg space-y-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Under-The-Hood: MAP over SIGTRAN Dialog
              </span>
              <span className="font-mono text-emerald-400 font-bold">100% Reachability</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">Service Code:</span>
                <span className="text-amber-300 font-bold">*384*123# (Assigned in System 1)</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">Protocol Stack:</span>
                <span className="text-white">MAP v3 / TCAP / SCCP / M3UA / SCTP</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">HLR/VLR Interconnect:</span>
                <span className="text-white">Direct SS7 SIGTRAN link (No aggregator IP)</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-500">Session Latency:</span>
                <span className="text-emerald-400 font-bold">1.4s turnaround</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Why USSD Never Fails on Feature Phones
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Unlike OTT messaging (WhatsApp/Signal) or IP-based apps, USSD utilizes the mobile network&apos;s signaling channel (Fast Associate Control Channel - FACCH) on GSM 2G. It does not require packet data, APN configuration, airtime balance, or smartphone operating systems.
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-900">
              When System 2&apos;s AI detects an intermittent cell edge or weak packet connectivity, it auto-converts doomed SMS messages to USSD Push, guaranteeing delivery to 100% of subscribers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
