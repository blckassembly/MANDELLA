import React, { useState } from 'react';
import { Terminal, Copy, Play, Check, Globe, Webhook, Code, Key, ShieldCheck } from 'lucide-react';
import { EuiccAttestationMiddlewareView } from './edge/EuiccAttestationMiddlewareView';

export const ApiConsole: React.FC = () => {
  const [consoleMode, setConsoleMode] = useState<'rest_endpoints' | 'euicc_middleware'>('rest_endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<'inventory' | 'purchase' | 'get' | 'port' | 'release'>('inventory');
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'node' | 'python'>('curl');
  const [selectedWebhook, setSelectedWebhook] = useState<'provisioned' | 'porting' | 'recycling'>('provisioned');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [requireEuiccAttestation, setRequireEuiccAttestation] = useState(true);

  // Endpoint definitions
  const endpoints = {
    inventory: {
      method: 'GET',
      path: '/v1/numbers/inventory?country=GH&type=mobile&features=voice,sms',
      description: 'Search real-time sovereign number inventory across African markets',
      sampleBody: null,
      sampleResponse: {
        status: 200,
        data: {
          country: 'GH',
          dial_code: '+233',
          total_available: 2150,
          numbers: [
            {
              id: 'num_gh_9941',
              e164: '+233244123890',
              carrier: 'MTN Ghana',
              type: 'mobile',
              features: ['voice', 'sms', 'ussd'],
              monthly_rate_usd: 0.75,
              inbound_per_min_usd: 0.014
            },
            {
              id: 'num_gh_9942',
              e164: '+233200987111',
              carrier: 'Telecel Ghana',
              type: 'mobile',
              features: ['voice', 'sms'],
              monthly_rate_usd: 0.75,
              inbound_per_min_usd: 0.014
            }
          ],
          rate_limit_remaining: 998
        }
      }
    },
    purchase: {
      method: 'POST',
      path: '/v1/numbers',
      description: 'Purchase and sub-60s provision E.164 numbers into Mandela Kamailio routing fabric',
      sampleBody: JSON.stringify(
        {
          country: 'GH',
          type: 'mobile',
          count: 1,
          features: ['voice', 'sms'],
          sip_trunk_uri: 'sip:+233244123890@sbc.mandela.africa:5060;transport=tls',
          webhook_url: 'https://example.com/hooks/mandela-voice'
        },
        null,
        2
      ),
      sampleResponse: {
        status: 201,
        data: {
          order_id: 'ord_gh_849204',
          provisioning_status: 'ACTIVE',
          estimated_provisioning_ms: 18400,
          allocated_numbers: [
            {
              id: 'num_gh_8819',
              e164: '+233244123890',
              kamailio_dispatcher_id: 102,
              enum_record: '0.9.8.3.2.1.4.4.2.3.3.2.e164.arpa IN NAPTR 10 100 "u" "E2U+sip"',
              active: true
            }
          ],
          billing: {
            charged_usd: 0.75,
            recurring: 'monthly'
          }
        }
      }
    },
    get: {
      method: 'GET',
      path: '/v1/numbers/num-ng-01',
      description: 'Retrieve real-time status and ENUM record of an assigned number',
      sampleBody: null,
      sampleResponse: {
        status: 200,
        data: {
          id: 'num-ng-01',
          e164: '+2348039876543',
          country: 'NG',
          regulator: 'NCC (Nigeria)',
          status: 'assigned',
          sip_trunk_uri: 'sip:+2348039876543@sbc.mandela.africa:5060;transport=tls',
          dispatcher_id: 101,
          enum_record: '3.4.5.6.7.8.9.3.0.8.4.3.2.e164.arpa IN NAPTR',
          kyc_verified: true,
          last_activity: '2026-10-10T14:15:00Z'
        }
      }
    },
    port: {
      method: 'POST',
      path: '/v1/numbers/port',
      description: 'Initiate Mobile Number Portability (MNP) request from donor African carrier',
      sampleBody: JSON.stringify(
        {
          number: '+233244901822',
          country: 'GH',
          current_carrier: 'Telecel Ghana',
          subscriber_name: 'Accra Logistics Ltd',
          loa_document_id: 'doc_loa_9921',
          national_id: 'GH-ID-992019401'
        },
        null,
        2
      ),
      sampleResponse: {
        status: 202,
        data: {
          port_request_id: 'port-req-001',
          status: 'submitted',
          clearinghouse_ack: true,
          estimated_completion: '2026-10-11T11:20:00Z',
          sla_hours: 24
        }
      }
    },
    release: {
      method: 'POST',
      path: '/v1/numbers/num-ng-01/release',
      description: 'Release active number and initiate country-specific recycling quarantine',
      sampleBody: null,
      sampleResponse: {
        status: 200,
        data: {
          id: 'num-ng-01',
          status: 'recycling',
          recycling_period_days: 360,
          regulator_notice: 'NCC TIRMS compliance notice queued for subscriber.',
          de_provisioned_from_sip: true
        }
      }
    }
  };

  const webhookPayloads = {
    provisioned: {
      event: 'number.provisioned',
      timestamp: '2026-10-10T15:42:19.412Z',
      data: {
        id: 'num_gh_8819',
        e164: '+233244123890',
        country: 'GH',
        carrier: 'MTN Ghana',
        kamailio_dispatcher_id: 102,
        enum_naptr: '0.9.8.3.2.1.4.4.2.3.3.2.e164.arpa',
        status: 'active'
      }
    },
    porting: {
      event: 'number.porting.updated',
      timestamp: '2026-10-10T15:43:00.120Z',
      data: {
        port_request_id: 'port-req-001',
        e164: '+233244901822',
        status: 'completed',
        donor_carrier: 'Telecel Ghana',
        routing_updated: true
      }
    },
    recycling: {
      event: 'number.recycling.warning',
      timestamp: '2026-10-10T12:00:00.000Z',
      data: {
        e164: '+2348035559988',
        country: 'NG',
        days_inactive: 300,
        quarantine_due_days: 60,
        regulation: 'NCC TIRMS Framework'
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
    }, 450);
  };

  const getCodeSnippet = () => {
    const fullUrl = `https://api.mandela.africa${currentEp.path}`;
    if (codeLanguage === 'curl') {
      if (currentEp.method === 'GET') {
        return `curl -X GET "${fullUrl}" \\\n  -H "Authorization: Bearer mandela_sk_live_99482104" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X POST "${fullUrl}" \\\n  -H "Authorization: Bearer mandela_sk_live_99482104" \\\n  -H "Content-Type: application/json" \\\n  -d '${currentEp.sampleBody}'`;
    }
    if (codeLanguage === 'node') {
      return `const response = await fetch("${fullUrl}", {\n  method: "${currentEp.method}",\n  headers: {\n    "Authorization": "Bearer mandela_sk_live_99482104",\n    "Content-Type": "application/json"\n  }${currentEp.sampleBody ? `,\n  body: JSON.stringify(${currentEp.sampleBody})` : ''}\n});\nconst data = await response.json();\nconsole.log(data);`;
    }
    if (codeLanguage === 'python') {
      return `import requests\n\nheaders = {\n    "Authorization": "Bearer mandela_sk_live_99482104",\n    "Content-Type": "application/json"\n}\n\nresponse = requests.${currentEp.method.toLowerCase()}("${fullUrl}", headers=headers${currentEp.sampleBody ? `, json=${currentEp.sampleBody}` : ''})\nprint(response.json())`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Developer & Platform API Console</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· OpenAPI 3.1</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full REST API parity with the Mandela UI. Programmatically search, purchase, port, and bind sovereign African E.164 numbers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
            <Key className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setConsoleMode('rest_endpoints')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            consoleMode === 'rest_endpoints'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>REST API Endpoints &amp; Webhooks</span>
        </button>

        <button
          onClick={() => setConsoleMode('euicc_middleware')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            consoleMode === 'euicc_middleware'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>eUICC Attestation Middleware (Ed25519 JWS)</span>
          <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono border border-emerald-800">
            Active
          </span>
        </button>
      </div>

      {consoleMode === 'euicc_middleware' ? (
        <EuiccAttestationMiddlewareView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-slate-800">
            NMS Core Endpoints
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'inventory', method: 'GET', label: '/v1/numbers/inventory' },
              { id: 'purchase', method: 'POST', label: '/v1/numbers (Buy & Provision)' },
              { id: 'get', method: 'GET', label: '/v1/numbers/{id}' },
              { id: 'port', method: 'POST', label: '/v1/numbers/port (Initiate MNP)' },
              { id: 'release', method: 'POST', label: '/v1/numbers/{id}/release' }
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

          {/* Webhooks documentation shortcut */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Asynchronous Webhooks
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['provisioned', 'porting', 'recycling'] as const).map((hook) => (
                <button
                  key={hook}
                  onClick={() => setSelectedWebhook(hook)}
                  className={`text-xs px-2.5 py-1 rounded font-mono transition-colors border ${
                    selectedWebhook === hook
                      ? 'bg-slate-800 border-amber-400 text-amber-300 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  number.{hook}
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
                <div className="text-slate-500 text-[10px] mb-1">Payload: number.{selectedWebhook}</div>
                <pre className="overflow-x-auto max-h-36">
                  {JSON.stringify(webhookPayloads[selectedWebhook], null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Request & Live Runner (8 cols) */}
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
              <span>{isExecuting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>

          {/* Code snippet generator */}
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

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-40">
              <pre>{getCodeSnippet()}</pre>
            </div>
          </div>

          {/* Response Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Response Body (JSON)</span>
              {responseJson && (
                <span className="font-mono text-emerald-400 text-[11px]">HTTP 200 OK · 142ms</span>
              )}
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400/90 overflow-x-auto min-h-[140px] max-h-64">
              {responseJson ? (
                <pre>{responseJson}</pre>
              ) : (
                <span className="text-slate-600 font-sans text-xs">
                  Click &ldquo;Send Request&rdquo; to execute live call against Mandela NMS routing sandbox.
                </span>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
