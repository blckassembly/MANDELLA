import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { WorkspaceKpiMetric } from '../../types/mandelaOS';

export interface OperationalKpiCardsProps {
  metrics: WorkspaceKpiMetric[];
}

export const OperationalKpiCards: React.FC<OperationalKpiCardsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {metrics.map((metric) => {
        const hasChange = metric.changePercent !== undefined;
        const isUp = hasChange && (metric.changePercent || 0) > 0;
        const isDown = hasChange && (metric.changePercent || 0) < 0;

        return (
          <div
            key={metric.id}
            className="p-3.5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wide truncate">
                {metric.label}
              </div>

              <div className="text-xl font-bold font-mono text-neutral-900 tracking-tight mt-1 tabular-nums flex items-baseline gap-1">
                <span>{metric.value}</span>
                {metric.unit && (
                  <span className="text-xs font-normal text-neutral-500 font-mono">
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Subtitle / Trend Line */}
            <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono">
              {hasChange ? (
                <div
                  className={`flex items-center gap-0.5 font-bold ${
                    metric.isPositiveChange !== undefined
                      ? metric.isPositiveChange
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                      : isUp
                      ? 'text-emerald-700'
                      : 'text-neutral-500'
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : isDown ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span>
                    {isUp ? '+' : ''}
                    {metric.changePercent}%
                  </span>
                </div>
              ) : (
                <span className="text-neutral-500">Nominal</span>
              )}

              {metric.caption && (
                <span className="text-neutral-500 truncate max-w-[90px]" title={metric.caption}>
                  {metric.caption}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
