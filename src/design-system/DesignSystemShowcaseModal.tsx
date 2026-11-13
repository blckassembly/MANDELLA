import React, { useState } from 'react';
import {
  Palette,
  Layers,
  Code,
  ShieldCheck,
  BarChart3,
  Crown
} from 'lucide-react';
import {
  ModalShell,
  Card,
  Badge,
  Button,
  StatCard,
  CodeBlock,
  SectionHeader,
  Input,
  SearchInput,
  Select,
  Tabs,
  AlertBanner,
  KpiProgressBar,
  TelemetryPill,
  TableShell,
  KeyValueTable,
  CalloutBanner,
  ModeSegmentedToggle
} from './index';

interface DesignSystemShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemShowcaseModal: React.FC<DesignSystemShowcaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'components' | 'zeropill' | 'tokens'>('architecture');
  const [demoInput, setDemoInput] = useState('+243 81 234 5678');
  const [demoSearch, setDemoSearch] = useState('System 04 — SIP Core & SBC');
  const [demoSelect, setDemoSelect] = useState('drc');
  const [demoMode, setDemoMode] = useState<'guided' | 'expert'>('guided');
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="MANDELA OS — Architectural Blueprint Design System"
      subtitle="Unified monochrome black-on-white workspace constitution (#FFFFFF canvas, #000000 ink & solid CTAs, 1px hairline structure)"
      icon={<Palette className="w-5 h-5" />}
      badge={<Badge variant="live">Blueprint v2.0</Badge>}
      maxWidth="6xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-xs text-zinc-600 font-mono">
            <span>Canvas #FFFFFF · Ink #000000 · Hairline Borders · Tabular Numerals</span>
          </div>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Specification
          </Button>
        </div>
      }
    >
      <Tabs
        tabs={[
          { id: 'architecture', label: '1. Blueprint Constitution', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'components', label: '2. UI Primitives', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'zeropill', label: '3. Sharp Geometry Rules', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: 'tokens', label: '4. Token Reference', icon: <Code className="w-3.5 h-3.5" /> }
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {activeTab === 'architecture' && (
        <div className="space-y-5">
          <CalloutBanner
            symbol="i"
            text="All 18 systems, 7 OS sections, Customer Self-Service flows, and Operator Provisioning share this single monochrome design language."
            rightText="UNIFIED UI SYSTEM"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="font-mono text-xs font-bold uppercase">Color Surface Architecture</span>
                <span className="font-mono text-[11px] font-bold">HIGH CONTRAST</span>
              </div>

              <div className="p-3 border border-black bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-white border border-black" />
                    <span className="font-bold text-sm">1. Pure Workspace Canvas</span>
                  </div>
                  <span className="font-mono text-xs">#FFFFFF</span>
                </div>
                <p className="text-xs text-zinc-600">Primary background for Desktop, Mission Control, Inspectors, Tables, and Documentation.</p>
              </div>

              <div className="p-3 border border-black bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-black border border-black" />
                    <span className="font-bold text-sm">2. Solid Ink & Primary Actions</span>
                  </div>
                  <span className="font-mono text-xs">#000000</span>
                </div>
                <p className="text-xs text-zinc-600">Primary CTA buttons, active dock tiles, selected rows, and structural 1px borders.</p>
              </div>

              <div className="p-3 border border-black bg-zinc-50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-zinc-100 border border-black" />
                    <span className="font-bold text-sm">3. Blueprint Zebra & Key Cells</span>
                  </div>
                  <span className="font-mono text-xs">#F4F4F5 / #FAFAFA</span>
                </div>
                <p className="text-xs text-zinc-600">Muted key columns in key-value inspectors, table headers, and subtle disabled regions.</p>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="font-mono text-xs font-bold uppercase">Layout Anatomy</span>
                <Crown className="w-4 h-4" />
              </div>

              <KeyValueTable
                rows={[
                  { key: 'Top Chrome', value: 'MANDELA OS wordmark | 7 Section Links | DEMO badge | Org Selector | Bell | Profile' },
                  { key: 'Sub-Context', value: 'Organization / Project breadcrumb left | Guided/Expert mode indicator right' },
                  { key: 'Left Rail', value: '280px–300px Contextual Inspector (key-value tables, filters, quick actions)' },
                  { key: 'Workspace', value: 'Bold heading, underline/boxed tabs, structured data tables, action strip' },
                  { key: 'Bottom Dock', value: 'Centered 7-icon quick dock + workflow code footer (WF-XX)' }
                ]}
              />
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-5">
          <SectionHeader
            title="Live Interactive Primitives"
            subtitle="Every button, input, tab strip, and inspector component obeys crisp 1px contrast"
            badge={<Badge variant="live">INTERACTIVE</Badge>}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label="ACTIVE SYSTEMS" value="18" subtext="12 MVP · 6 Planned" />
            <StatCard label="DEPLOYMENT STAGES" value="8" trend={{ value: '7 simulated', positive: true }} />
            <StatCard label="ITU REGISTRIES" value="54" subtext="Pan-African coverage" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-3">
              <div className="font-mono text-xs font-bold uppercase">Buttons & Mode Switcher</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" onClick={() => setButtonLoading((p) => !p)} loading={buttonLoading}>
                  Primary Action
                </Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="outline" size="sm">Outline</Button>
                <Button variant="danger" size="sm">Blocked / Alert</Button>
              </div>
              <ModeSegmentedToggle mode={demoMode} onChange={setDemoMode} />
              <div className="flex flex-wrap gap-2">
                <TelemetryPill label="MODE" value={demoMode.toUpperCase()} />
                <Badge variant="neutral">SAMPLE ONLY</Badge>
                <Badge variant="live">APPROVED</Badge>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <SearchInput value={demoSearch} onChange={(e) => setDemoSearch(e.target.value)} label="Search Systems" />
              <Input value={demoInput} onChange={(e) => setDemoInput(e.target.value)} label="Business Number" />
              <Select
                label="Target Country"
                value={demoSelect}
                onChange={(e) => setDemoSelect(e.target.value)}
                options={[
                  { label: 'DRC (Democratic Republic of Congo)', value: 'drc' },
                  { label: 'Kenya (+254)', value: 'ke' },
                  { label: 'Nigeria (+234)', value: 'ng' },
                  { label: 'South Africa (+27)', value: 'za' }
                ]}
              />
            </Card>
          </div>

          <AlertBanner
            type="info"
            title="Verification Gate Active"
            description="All production infrastructure changes require explicit validation and verified carrier telemetry."
            action={{ label: 'Inspect Rules', onClick: () => setActiveTab('tokens') }}
          />
          <KpiProgressBar label="SIMULATION READINESS" value={87.5} />
        </div>
      )}

      {activeTab === 'zeropill' && (
        <div className="space-y-4">
          <TableShell headers={['Design Element', 'Blueprint Standard', 'Rationale']}>
            <tr>
              <td className="py-2.5 px-3.5 font-bold">Buttons & Badges</td>
              <td className="py-2.5 px-3.5 font-mono text-xs">rounded-[2px] · 1px solid #000</td>
              <td className="py-2.5 px-3.5 text-zinc-600">Zero rounded-full pill bubbles; disciplined engineering authority</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-bold">Numeric Columns</td>
              <td className="py-2.5 px-3.5 font-mono text-xs">tabular-nums · JetBrains Mono</td>
              <td className="py-2.5 px-3.5 text-zinc-600">Vertical digit alignment across E.164 numbers, timestamps, and metrics</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3.5 font-bold">Active Selection</td>
              <td className="py-2.5 px-3.5 font-mono text-xs">bg-black text-white</td>
              <td className="py-2.5 px-3.5 text-zinc-600">Unambiguous binary state contrast on any display or print surface</td>
            </tr>
          </TableShell>
        </div>
      )}

      {activeTab === 'tokens' && (
        <CodeBlock
          fileName="src/design-system/tokens.ts"
          language="typescript"
          code={`export const MANDELA_BLUEPRINT_TOKENS = {
  canvas: '#FFFFFF',
  ink: '#000000',
  hairline: '1px solid #000000',
  subtleDivider: 'rgba(0, 0, 0, 0.18)',
  radius: '2px',
  fontSans: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  numbers: 'tabular-nums',
};`}
        />
      )}
    </ModalShell>
  );
};
