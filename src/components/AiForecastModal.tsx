import React, { useState, useEffect } from 'react';
import { AfricanCountry } from '../types/nms';
import { generateNmsForecast, AiForecastResult } from '../services/aiService';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Zap, Loader2, ArrowRight } from 'lucide-react';

interface AiForecastModalProps {
  country: AfricanCountry;
  onClose: () => void;
  onApplyReorder: (countryCode: string, batchSize: number) => void;
}

export const AiForecastModal: React.FC<AiForecastModalProps> = ({
  country,
  onClose,
  onApplyReorder,
}) => {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<AiForecastResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    generateNmsForecast(country).then((res) => {
      if (isMounted) {
        setForecast(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [country]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Mandela Predictive Engine — {country.name} ({country.dialCode})
              </h3>
              <p className="text-xs text-slate-400">
                PRD Section 9: Demand forecasting, connector telemetry & stockout prevention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {loading || !forecast ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <div className="text-slate-300 font-medium">Synthesizing African Telecom Telemetry...</div>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Correlating historical provisioning cycles, {country.regulatorAcronym} regulatory directives, and current buffer velocity.
              </p>
            </div>
          ) : (
            <>
              {/* Top Summary Metric Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Mobile Demand (30d)</div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums mt-1">
                    +{forecast.projectedDemandMobile.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Projected E.164 orders</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Stockout Risk</div>
                  <div className={`text-lg font-bold font-mono tabular-nums mt-1 ${forecast.stockoutRiskPercent > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {forecast.stockoutRiskPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {forecast.stockoutRiskPercent > 50 ? 'Immediate action advised' : 'Buffer safe'}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Connector Risk</div>
                  <div className={`text-lg font-bold font-mono mt-1 ${forecast.connectorDowntimeRisk === 'High' ? 'text-rose-400' : 'text-slate-200'}`}>
                    {forecast.connectorDowntimeRisk}
                  </div>
                  <div className="text-[10px] text-slate-400">{country.connectorType.replace('_', ' ')}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Suggested Re-order</div>
                  <div className="text-lg font-bold font-mono text-amber-300 tabular-nums mt-1">
                    {forecast.recommendedReorderBatch.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">To maintain {forecast.recommendedBufferDays}d buffer</div>
                </div>
              </div>

              {/* Demand breakdown by type */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <span>Demand Projection By Sovereign Asset Type</span>
                  <span className="font-mono text-slate-500">{forecast.forecastPeriod}</span>
                </div>
                <div className="space-y-2 pt-1 font-mono">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Mobile (MSISDN - Voice/SMS/USSD)</span>
                      <span className="text-white font-bold">{forecast.projectedDemandMobile.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-full w-[75%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Fixed DID (Major Metros & PBX)</span>
                      <span className="text-white font-bold">{forecast.projectedDemandFixed.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-sky-400 h-full w-[18%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Toll-Free & National 0800</span>
                      <span className="text-white font-bold">{forecast.projectedDemandTollFree.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[7%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Optimization */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  Autonomous Pricing Optimization Recommendation
                </div>
                <p className="text-slate-200 leading-relaxed pt-1">
                  {forecast.priceOptimizationRecommendation}
                </p>
              </div>

              {/* Drivers & Observations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                    Key Market Drivers
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {forecast.keyDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                    Telemetry Observations
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {forecast.anomaliesDetected.map((anomaly, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{anomaly}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">
            Mandela AI Connect Intelligence
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-white rounded"
            >
              Close
            </button>
            {forecast && (
              <button
                onClick={() => {
                  onApplyReorder(country.code, forecast.recommendedReorderBatch);
                  onClose();
                }}
                className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Execute +{forecast.recommendedReorderBatch.toLocaleString()} Re-order Batch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
