import React from 'react';
import { ShieldCheck, MessageSquare, Phone, Mic, Server, Database } from 'lucide-react';
import { KycProfile } from '../types/nms';

export type ConnectSystem = 'mandela_dataverse' | 'system_4_sbc' | 'system_3_voice' | 'system_2_messaging' | 'system_1_nms';

// Dataverse Tabs
export type DataverseTab = 'overview' | 'schemas' | 'records' | 'query' | 'events' | 'governance' | 'ai_data';

// System 1 Tabs
export type System1Tab = 'command_control' | 'pan_africa_inventory' | 'inventory' | 'my_numbers' | 'porting' | 'compliance' | 'esim_attestation' | 'api';

// System 2 Tabs
export type System2Tab = 'noc_dashboard' | 'dispatcher' | 'phone_simulator' | 'smpp_binds' | 'routing_engine' | 'msg_api';

// System 3 Tabs
export type System3Tab = 'voice_noc' | 'ivr_builder' | 'call_simulator' | 'languages_matrix' | 'call_summaries';

// System 4 Tabs
export type System4Tab = 'sbc_noc' | 'pbx_connect' | 'ladder_traces' | 'header_rules' | 'security_ai';

export type UserPersona = 'novice' | 'developer' | 'enterprise' | 'ops';

interface HeaderProps {
  activeSystem: ConnectSystem;
  onSelectSystem: (system: ConnectSystem) => void;
  dataverseTab: DataverseTab;
  onSelectDataverseTab: (tab: DataverseTab) => void;
  system1Tab: System1Tab;
  onSelectSystem1Tab: (tab: System1Tab) => void;
  system2Tab: System2Tab;
  onSelectSystem2Tab: (tab: System2Tab) => void;
  system3Tab: System3Tab;
  onSelectSystem3Tab: (tab: System3Tab) => void;
  system4Tab: System4Tab;
  onSelectSystem4Tab: (tab: System4Tab) => void;
  activePersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  kycProfile: KycProfile;
  assignedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSystem,
  onSelectSystem,
  dataverseTab,
  onSelectDataverseTab,
  system1Tab,
  onSelectSystem1Tab,
  system2Tab,
  onSelectSystem2Tab,
  system3Tab,
  onSelectSystem3Tab,
  system4Tab,
  onSelectSystem4Tab,
  activePersona,
  onSelectPersona,
  kycProfile,
  assignedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav links) — Zone 3 (System & Persona) */}
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark + System Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectSystem('system_4_sbc')}
              className="text-left whitespace-nowrap shrink-0 group flex items-baseline gap-2"
            >
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Mandela Connect
              </span>
            </button>

            {/* System Segmented Switcher */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => onSelectSystem('mandela_dataverse')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  activeSystem === 'mandela_dataverse'
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3 h-3" />
                <span>MANDELA Dataverse</span>
              </button>
              <button
                onClick={() => onSelectSystem('system_4_sbc')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  activeSystem === 'system_4_sbc'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3 h-3" />
                <span>Sys 4: SBC Core</span>
              </button>
              <button
                onClick={() => onSelectSystem('system_3_voice')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  activeSystem === 'system_3_voice'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>Sys 3: Voice</span>
              </button>
              <button
                onClick={() => onSelectSystem('system_2_messaging')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  activeSystem === 'system_2_messaging'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Sys 2: SMS</span>
              </button>
              <button
                onClick={() => onSelectSystem('system_1_nms')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  activeSystem === 'system_1_nms'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3 h-3" />
                <span>Sys 1: Numbers</span>
              </button>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Dynamic based on selected System) */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {activeSystem === 'mandela_dataverse' ? (
              <>
                <button
                  onClick={() => onSelectDataverseTab('overview')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'overview'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Overview & Telemetry
                </button>

                <button
                  onClick={() => onSelectDataverseTab('schemas')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'schemas'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Entity Schemas & ERD
                </button>

                <button
                  onClick={() => onSelectDataverseTab('records')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'records'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Record Explorer & Audit
                </button>

                <button
                  onClick={() => onSelectDataverseTab('query')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'query'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  SQL Query Studio
                </button>

                <button
                  onClick={() => onSelectDataverseTab('events')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'events'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Event Pipelines (CDC)
                </button>

                <button
                  onClick={() => onSelectDataverseTab('governance')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'governance'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Governance & RBAC
                </button>

                <button
                  onClick={() => onSelectDataverseTab('ai_data')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    dataverseTab === 'ai_data'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  AI Data Services
                </button>
              </>
            ) : activeSystem === 'system_4_sbc' ? (
              <>
                <button
                  onClick={() => onSelectSystem4Tab('sbc_noc')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system4Tab === 'sbc_noc'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  SBC Anycast NOC
                </button>

                <button
                  onClick={() => onSelectSystem4Tab('pbx_connect')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system4Tab === 'pbx_connect'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Connect PBX
                </button>

                <button
                  onClick={() => onSelectSystem4Tab('ladder_traces')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system4Tab === 'ladder_traces'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  SIP Ladder Traces
                </button>

                <button
                  onClick={() => onSelectSystem4Tab('header_rules')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system4Tab === 'header_rules'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Header Rules
                </button>

                <button
                  onClick={() => onSelectSystem4Tab('security_ai')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system4Tab === 'security_ai'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  AI Fraud & ACL
                </button>
              </>
            ) : activeSystem === 'system_3_voice' ? (
              <>
                <button
                  onClick={() => onSelectSystem3Tab('voice_noc')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system3Tab === 'voice_noc'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Voice NOC
                </button>

                <button
                  onClick={() => onSelectSystem3Tab('ivr_builder')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system3Tab === 'ivr_builder'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  IVR Builder
                </button>

                <button
                  onClick={() => onSelectSystem3Tab('call_simulator')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system3Tab === 'call_simulator'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Call Tester
                </button>

                <button
                  onClick={() => onSelectSystem3Tab('languages_matrix')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system3Tab === 'languages_matrix'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  50 Languages
                </button>

                <button
                  onClick={() => onSelectSystem3Tab('call_summaries')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system3Tab === 'call_summaries'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Call Summaries
                </button>
              </>
            ) : activeSystem === 'system_2_messaging' ? (
              <>
                <button
                  onClick={() => onSelectSystem2Tab('noc_dashboard')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'noc_dashboard'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  NOC Command
                </button>

                <button
                  onClick={() => onSelectSystem2Tab('dispatcher')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'dispatcher'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Dispatch & AI Split
                </button>

                <button
                  onClick={() => onSelectSystem2Tab('phone_simulator')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'phone_simulator'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  2G USSD Phone
                </button>

                <button
                  onClick={() => onSelectSystem2Tab('smpp_binds')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'smpp_binds'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  SMPP Binds & PDU
                </button>

                <button
                  onClick={() => onSelectSystem2Tab('routing_engine')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'routing_engine'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Routing Engine
                </button>

                <button
                  onClick={() => onSelectSystem2Tab('msg_api')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system2Tab === 'msg_api'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Messaging API
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectSystem1Tab('command_control')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system1Tab === 'command_control'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Africa Map
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('inventory')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system1Tab === 'inventory'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Number Stock
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('my_numbers')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    system1Tab === 'my_numbers'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <span>My Numbers ({assignedCount})</span>
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('porting')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system1Tab === 'porting'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Porting (MNP)
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('compliance')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system1Tab === 'compliance'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Compliance
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('esim_attestation')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    system1Tab === 'esim_attestation'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <span>eSIM Attestation</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-mono border border-emerald-800">
                    SGP.22
                  </span>
                </button>

                <button
                  onClick={() => onSelectSystem1Tab('api')}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    system1Tab === 'api'
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Numbers API
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Persona Switcher & KYC */}
          <div className="flex items-center gap-3 shrink-0">
            <select
              value={activePersona}
              onChange={(e) => onSelectPersona(e.target.value as UserPersona)}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-amber-400 transition-colors"
              title="Target Persona"
            >
              <option value="novice">Persona: Novice / SMB</option>
              <option value="developer">Persona: Platform Engineer</option>
              <option value="enterprise">Persona: Enterprise Operator</option>
              <option value="ops">Persona: Internal Ops / NOC</option>
            </select>

            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                Tier {kycProfile.tier}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/80 text-xs font-medium">
          {activeSystem === 'mandela_dataverse' ? (
            <>
              <button
                onClick={() => onSelectDataverseTab('overview')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'overview' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => onSelectDataverseTab('schemas')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'schemas' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Schemas
              </button>
              <button
                onClick={() => onSelectDataverseTab('records')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'records' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Records
              </button>
              <button
                onClick={() => onSelectDataverseTab('query')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'query' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Query Studio
              </button>
              <button
                onClick={() => onSelectDataverseTab('events')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'events' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                CDC Events
              </button>
              <button
                onClick={() => onSelectDataverseTab('governance')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'governance' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Governance
              </button>
              <button
                onClick={() => onSelectDataverseTab('ai_data')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  dataverseTab === 'ai_data' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                AI Data
              </button>
            </>
          ) : activeSystem === 'system_4_sbc' ? (
            <>
              <button
                onClick={() => onSelectSystem4Tab('sbc_noc')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system4Tab === 'sbc_noc' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                SBC NOC
              </button>
              <button
                onClick={() => onSelectSystem4Tab('pbx_connect')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system4Tab === 'pbx_connect' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Connect PBX
              </button>
              <button
                onClick={() => onSelectSystem4Tab('ladder_traces')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system4Tab === 'ladder_traces' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Ladder Traces
              </button>
              <button
                onClick={() => onSelectSystem4Tab('header_rules')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system4Tab === 'header_rules' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Header Rules
              </button>
              <button
                onClick={() => onSelectSystem4Tab('security_ai')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system4Tab === 'security_ai' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                AI Fraud
              </button>
            </>
          ) : activeSystem === 'system_3_voice' ? (
            <>
              <button
                onClick={() => onSelectSystem3Tab('voice_noc')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system3Tab === 'voice_noc' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Voice NOC
              </button>
              <button
                onClick={() => onSelectSystem3Tab('ivr_builder')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system3Tab === 'ivr_builder' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                IVR Builder
              </button>
              <button
                onClick={() => onSelectSystem3Tab('call_simulator')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system3Tab === 'call_simulator' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Call Tester
              </button>
              <button
                onClick={() => onSelectSystem3Tab('languages_matrix')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system3Tab === 'languages_matrix' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                50 Langs
              </button>
              <button
                onClick={() => onSelectSystem3Tab('call_summaries')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system3Tab === 'call_summaries' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Summaries
              </button>
            </>
          ) : activeSystem === 'system_2_messaging' ? (
            <>
              <button
                onClick={() => onSelectSystem2Tab('noc_dashboard')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'noc_dashboard' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                NOC
              </button>
              <button
                onClick={() => onSelectSystem2Tab('dispatcher')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'dispatcher' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Dispatch
              </button>
              <button
                onClick={() => onSelectSystem2Tab('phone_simulator')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'phone_simulator' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                2G Phone
              </button>
              <button
                onClick={() => onSelectSystem2Tab('smpp_binds')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'smpp_binds' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Binds
              </button>
              <button
                onClick={() => onSelectSystem2Tab('routing_engine')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'routing_engine' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Routing
              </button>
              <button
                onClick={() => onSelectSystem2Tab('msg_api')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system2Tab === 'msg_api' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                API
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectSystem1Tab('command_control')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system1Tab === 'command_control' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => onSelectSystem1Tab('inventory')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system1Tab === 'inventory' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => onSelectSystem1Tab('my_numbers')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system1Tab === 'my_numbers' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                My Numbers
              </button>
              <button
                onClick={() => onSelectSystem1Tab('esim_attestation')}
                className={`whitespace-nowrap px-2.5 py-1 rounded ${
                  system1Tab === 'esim_attestation' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                eSIM Attest
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
