import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Data Sovereignty & Legal',
    question: 'How does Mandela Connect comply with the African Union Malabo Convention?',
    answer: 'All subscriber PII, call signaling records, CDRs, and voice biometrics remain strictly isolated within local in-country data nodes across 54 sovereign African jurisdictions. Zero signaling traffic is routed to offshore jurisdictions unless explicitly requested via sovereign bilateral carrier agreements. Tamper-evident SHA-256 audit logs provide verifiable proof of residency.'
  },
  {
    category: 'Engineering & SIP Core',
    question: 'How does the 30-Second Packet Diagnostic feature work on the System 4 SBC Core?',
    answer: 'The System 4 SBC Core features an integrated Kamailio + RTPEngine eBPF trace probe. When triggered from the console or API, the engine attaches a lightweight ring buffer to the specific SIP Call-ID and captures raw SIP signaling and RTP audio headers (including jitter, packet loss, and codec negotiation) for 30 seconds before generating a downloadable standard PCAP and interactive ladder diagram.'
  },
  {
    category: 'Interconnect & Protocols',
    question: 'What protocols and interconnect types are supported for enterprise onboarding?',
    answer: 'Mandela supports direct SMPP v5 binds over TLS, Anycast SIP RFC 3261 over UDP/TCP/TLS 1.3, SIGTRAN SS7 (M3UA/SCCP/TCAP) for native USSD, 3GPP Rel-17 NTN for satellite uplinks, and modern REST/WebSocket webhooks for fintech application dispatch.'
  },
  {
    category: 'Reliability & SLAs',
    question: 'What is your uptime SLA and how do you survive subsea fiber cuts?',
    answer: 'We provide a 99.999% carrier-grade core availability SLA with sub-15ms autonomous BGP rerouting across diverse subsea cable systems including Equiano, WACS, SAT-3, and 2Africa. In the event of a subsea cable break, Anycast route reflectors immediately shift traffic without terminating active voice dialogues.'
  },
  {
    category: 'African Languages & AI',
    question: 'How does the Voice IVR support 50 native African languages and dialects?',
    answer: 'Our neural speech engine runs custom localized acoustic and language models fine-tuned on 100,000+ hours of localized speech in Swahili, Yoruba, Amharic, Hausa, Zulu, Igbo, Wolof, and Arabic dialects. It supports real-time streaming speech-to-speech with sub-150ms roundtrip audio latency.'
  },
  {
    category: 'Migration & Onboarding',
    question: 'Can we migrate away from Twilio, Infobip, or legacy PBXs with zero downtime?',
    answer: 'Yes. Our dual-run migration engine allows you to route a 5% canary test stream through Mandela Connect while retaining your fallback provider. Once latency and delivery SLAs are verified, traffic can be seamlessly shifted using our real-time rate arbitrator.'
  }
];

export const EnterpriseFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ENTERPRISE SPECIFICATIONS & FAQS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            Clear technical answers regarding compliance, interconnect topology, and migration.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
