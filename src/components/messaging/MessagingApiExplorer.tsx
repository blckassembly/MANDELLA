import React, { useState } from 'react';
import { Terminal, Copy, Play, Check, Key, Webhook } from 'lucide-react';

export const MessagingApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'send' | 'get' | 'ussd_session'>('send');
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'node' | 'python'>('curl');
  const [selectedWebhook, setSelectedWebhook] = useState<'delivered' | 'converted_ussd' | 'retry_queued'>('delivered');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const endpoints = {
    send: {
      method: 'POST',
      path: '/v1/messages',
      description: 'Submit transactional SMS, OTP, or USSD message with intelligent routing and retry schedule',
      sampleBody: JSON.stringify(
        {
          to: '+233244123890',
          body: 'Your Mandela One-Time Passcode is 849204. Valid 5 minutes.',
          sender_id: 'BANK_OTP',
          route_profile: {
            ghana: {
              primary: 'mtn_gh_smpp',
              fallback: 'vodafone_gh_ss7'
            }
          },
          retry: [0, 5, 30],
          ttl_minutes: 1440,
          idempotency_key: 'idemp_849204_gh_991'
        },
        null,
        2
      ),
      sampleResponse: {
        status: 202,
        data: {
          message_id: 'msg_gh_8849201',
          status: 'ACCEPTED_INTO_SMPP_QUEUE',
          routing_decision: {
            channel: 'sms',
            carrier_bind: 'bind-mtn-gh-01',
            ai_predicted_failure: false,
            ai_delivery_confidence: 0.984
          },
          smpp_sequence_number: 104829,
          cost_usd: 0.0071,
          created_at: '2026-10-10T15:52:10.120Z'
        }
      }
    },
    get: {
      method: 'GET',
      path: '/v1/messages/msg_gh_8849201',
      description: 'Retrieve real-time message status, DLR receipt, and SMPP latency trace',
      sampleBody: null,
      sampleResponse: {
        status: 200,
        data: {
          message_id: 'msg_gh_8849201',
          to: '+233244123890',
          status: 'DELIVERED',
          dlr_receipt: {
            stat: 'DELIVRD',
            err_code: '000',
            submit_date: '2026-10-10T15:52:10Z',
            done_date: '2026-10-10T15:52:13Z',
            latency_ms: 3200
          },
          carrier: 'MTN Ghana',
          protocol: 'SMPP v5.0'
        }
      }
    },
    ussd_session: {
      method: 'POST',
      path: '/v1/ussd/sessions',
      description: 'Initiate or reply to session-based USSD dialog (*384*123#) over SIGTRAN MAP link',
      sampleBody: JSON.stringify(
        {
          session_id: 'ussd_ses_99104',
          msisdn: '+2348039876543',
          service_code: '*384*123#',
          user_input: '1',
          action: 'CONTINUE'
        },
        null,
        2
      ),
      sampleResponse: {
        status: 200,
        data: {
          session_id: 'ussd_ses_99104',
          action: 'CONTINUE',
          prompt_text: 'Ashanti Region Weather:\nHeavy rainfall expected Wednesday afternoon.\n\n0. Back',
          sigtran_map_turnaround_ms: 1420
        }
      }
    }
  };

  const webhookPayloads = {
    delivered: {
      event: 'message.delivered',
      timestamp: '2026-10-10T15:52:13.220Z',
      data: {
        message_id: 'msg_gh_8849201',
        to: '+233244123890',
        sender_id: 'BANK_OTP',
        dlr_status: 'DELIVRD',
        latency_ms: 3200,
        carrier: 'MTN Ghana'
      }
    },
    converted_ussd: {
      event: 'message.converted_to_ussd',
      timestamp: '2026-10-10T15:48:22.180Z',
      data: {
        message_id: 'msg_ke_7748192',
        to: '+254722550119',
        reason: 'Handset 2G feature phone on weak cell edge; converted to USSD push to guarantee delivery.',
        ussd_delivery_confirmed: true
      }
    },
    retry_queued: {
      event: 'message.retry_queued',
      timestamp: '2026-10-10T15:45:00.000Z',
      data: {
        message_id: 'msg_cd_994821',
        to: '+243818900456',
        attempt: 2,
        next_retry_at: '2026-10-10T16:15:00Z',
        carrier: 'Orange DR Congo'
      }
    }
  };

  const currentEp = endpoints[selectedEndpoint];

  const handleExecute = () => {
    setIsExecuting(true);
    setResponseJson(null);
    setTimeout(() => {
      setIsExecuting(false);
      setResponseJson(JSON.stringify(currentEp.sampleResponse, null, 2));
    }, 400);
  };

  const getCodeSnippet = () => {
    const fullUrl = `https://api.mandela.africa${currentEp.path}`;
    if (codeLanguage === 'curl') {
      if (currentEp.method === 'GET') {
        return `curl -X GET "${fullUrl}" \\\n  -H "Authorization: Bearer mandela_msg_sk_live_8492" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X POST "${fullUrl}" \\\n  -H "Authorization: Bearer mandela_msg_sk_live_8492" \\\n  -H "Content-Type: application/json" \\\n  -d '${currentEp.sampleBody}'`;
    }
    if (codeLanguage === 'node') {
      return `const response = await fetch("${fullUrl}", {\n  method: "${currentEp.method}",\n  headers: {\n    "Authorization": "Bearer mandela_msg_sk_live_8492",\n    "Content-Type": "application/json"\n  }${currentEp.sampleBody ? `,\n  body: JSON.stringify(${currentEp.sampleBody})` : ''}\n});\nconst data = await response.json();\nconsole.log(data);`;
    }
    if (codeLanguage === 'python') {
      return `import requests\n\nheaders = {\n    "Authorization": "Bearer mandela_msg_sk_live_8492",\n    "Content-Type": "application/json"\n}\n\nresponse = requests.${currentEp.method.toLowerCase()}("${fullUrl}", headers=headers${currentEp.sampleBody ? `, json=${currentEp.sampleBody}` : ''})\nprint(response.json())`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">System 2 Messaging Gateway REST API</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· Section 15.1 OpenAPI Specification</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit SMS, OTPs, and initiate USSD sessions with multi-factor routing profiles and DLR webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">mandela_msg_sk_live_8492••••</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            System 2 Endpoints
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'send', method: 'POST', label: '/v1/messages (Send / Route)' },
              { id: 'get', method: 'GET', label: '/v1/messages/{id} (DLR Status)' },
              { id: 'ussd_session', method: 'POST', label: '/v1/ussd/sessions (SIGTRAN MAP)' }
            ].map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep.id as any);
                  setResponseJson(null);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between border ${
                  selectedEndpoint === ep.id
                    ? 'bg-amber-400/10 border-amber-400/50 text-amber-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{ep.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                    ep.method === 'GET' ? 'bg-sky-950 text-sky-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {ep.method}
                </span>
              </button>
            ))}
          </div>

          {/* Webhook Events */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Asynchronous DLR Webhooks
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['delivered', 'converted_ussd', 'retry_queued'] as const).map((hook) => (
                <button
                  key={hook}
                  onClick={() => setSelectedWebhook(hook)}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors border ${
                    selectedWebhook === hook
                      ? 'bg-slate-800 border-amber-400 text-amber-300 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  message.{hook}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300 relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(webhookPayloads[selectedWebhook], null, 2));
                    setCopiedWebhook(true);
                    setTimeout(() => setCopiedWebhook(false), 2000);
                  }}
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <div className="text-slate-500 text-[10px] mb-1">Payload: message.{selectedWebhook}</div>
                <pre className="overflow-x-auto max-h-36">
                  {JSON.stringify(webhookPayloads[selectedWebhook], null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code & Runner (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                  {currentEp.method}
                </span>
                <span className="font-mono text-xs text-white font-medium">{currentEp.path}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentEp.description}</p>
            </div>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Transmitting...' : 'Send API Call'}</span>
            </button>
          </div>

          {/* Code snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                {(['curl', 'node', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors ${
                      codeLanguage === lang
                        ? 'bg-slate-800 text-amber-300 font-semibold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCodeSnippet());
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-44">
              <pre>{getCodeSnippet()}</pre>
            </div>
          </div>

          {/* Response */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Response Body (JSON)</span>
              {responseJson && (
                <span className="font-mono text-emerald-400 text-[11px]">HTTP 202 ACCEPTED · 42ms SMPP Ack</span>
              )}
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400/90 overflow-x-auto min-h-[140px] max-h-64">
              {responseJson ? (
                <pre>{responseJson}</pre>
              ) : (
                <span className="text-slate-600 font-sans text-xs">
                  Click &ldquo;Send API Call&rdquo; to simulate live dispatch through Mandela SMPP v5 & SIGTRAN gateway.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
