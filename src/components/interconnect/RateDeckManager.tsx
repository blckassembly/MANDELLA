import React, { useState } from 'react';
import { CarrierRateDeck } from '../../types/interconnect';
import {
  FileText,
  Upload,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface RateDeckManagerProps {
  rateDecks: CarrierRateDeck[];
  onUploadRateDeck: (deck: CarrierRateDeck) => void;
}

export const RateDeckManager: React.FC<RateDeckManagerProps> = ({
  rateDecks,
  onUploadRateDeck
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string>(rateDecks[0]?.id || '');

  const selectedDeck = rateDecks.find((d) => d.id === selectedDeckId) || rateDecks[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Carrier Rate Deck Ingestion &amp; Diff Engine</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· 100+ Carrier Feeds</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Automated ingestion of rate sheets via CSV, Excel, XML, and live carrier APIs. Normalized prefixes, version history, and automated margin impact forecasting.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Rate Deck</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Ingested Decks (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Ingested Carrier Decks ({rateDecks.length})
            </span>
            <span className="text-emerald-400">≥ 99.5% Parsing Accuracy</span>
          </div>

          <div className="space-y-2">
            {rateDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  deck.id === selectedDeckId
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs">{deck.carrierName}</strong>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                    deck.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {deck.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans truncate">
                  File: {deck.sourceFile}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <div>
                    <span className="block">Format</span>
                    <span className="text-white font-bold">{deck.format}</span>
                  </div>
                  <div>
                    <span className="block">Destinations</span>
                    <span className="text-white font-bold">{deck.totalDestinations}</span>
                  </div>
                  <div>
                    <span className="block">Margin Impact</span>
                    <span className={deck.marginImpactPercent >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {deck.marginImpactPercent > 0 ? `+${deck.marginImpactPercent}%` : `${deck.marginImpactPercent}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Deck Diff & Analysis (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedDeck.carrierName}</h3>
              <span className="text-[10px] text-slate-500">Version: {selectedDeck.version} · Effective: {selectedDeck.effectiveDate}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Parsing Accuracy:</span>
              <span className="text-emerald-400 font-bold text-xs">{selectedDeck.parsedAccuracyPercent}%</span>
            </div>
          </div>

          {/* Diff Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Rate Increases</div>
              <div className="text-lg font-bold text-rose-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-4 h-4" />
                <span>{selectedDeck.increasedRatesCount} Prefixes</span>
              </div>
              <span className="text-[9px] text-slate-500">Higher Cost / Risk</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Rate Decreases</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-4 h-4" />
                <span>{selectedDeck.decreasedRatesCount} Prefixes</span>
              </div>
              <span className="text-[9px] text-slate-500">Margin Expansion</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase">Net Margin Impact</div>
              <div className={`text-lg font-bold flex items-center gap-1 mt-1 ${
                selectedDeck.marginImpactPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {selectedDeck.marginImpactPercent > 0 ? `+${selectedDeck.marginImpactPercent}%` : `${selectedDeck.marginImpactPercent}%`}
              </div>
              <span className="text-[9px] text-slate-500">Automated LCR Simulation</span>
            </div>
          </div>

          {/* Sample Diff Changes Table */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-900 text-[11px] text-slate-400">
              <span>Prefix Rate Diff Breakdown</span>
              <span className="text-amber-300">Auto-Detected by Rate Engine</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <strong className="text-white">+254 (Kenya Mobile)</strong>
                  <span className="text-[10px] text-slate-500 block">Safaricom Termination</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through">$0.0110</span>
                  <span className="text-rose-400 font-bold ml-2">→ $0.0142 (+29.1%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <strong className="text-white">+234 (Nigeria Mobile MTN)</strong>
                  <span className="text-[10px] text-slate-500 block">Lagos Fiber Breakout</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through">$0.0175</span>
                  <span className="text-emerald-400 font-bold ml-2">→ $0.0165 (-5.7%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <strong className="text-white">+27 (South Africa Vodacom)</strong>
                  <span className="text-[10px] text-slate-500 block">JNB Interconnect</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through">$0.0210</span>
                  <span className="text-emerald-400 font-bold ml-2">→ $0.0195 (-7.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
