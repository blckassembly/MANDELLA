import React, { useState, createContext, useContext } from 'react';
import {
  Check,
  Copy,
  X,
  Search,
  ChevronDown,
  AlertTriangle,
  Info,
  ShieldAlert
} from 'lucide-react';
import {
  DS_BADGE_VARIANTS,
  BadgeVariant,
  DS_COLORS,
  DS_RADIUS,
  DS_BORDERS,
  DS_TRANSITIONS,
  ATELIER_TYPOGRAPHY,
  DS_TYPOGRAPHY,
  TELECOM_THRESHOLDS
} from './tokens';

// =========================================================================
// 1. CARD & SURFACE PRIMITIVES
// =========================================================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'workspace' | 'interactive' | 'goldOutline' | 'neonAmber' | 'neonSky';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-black rounded-[2px] text-black',
    elevated: 'bg-white border-2 border-black rounded-[2px] text-black',
    glass: 'bg-white border border-black rounded-[2px] text-black',
    workspace: 'bg-white border border-black rounded-[2px] text-black',
    goldOutline: 'bg-white border border-black rounded-[2px] text-black',
    neonAmber: 'bg-zinc-50 border border-black rounded-[2px] text-black',
    neonSky: 'bg-white border border-black rounded-[2px] text-black',
    interactive:
      'bg-white border border-black hover:bg-zinc-50 rounded-[2px] transition-colors duration-100 cursor-pointer text-black',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Panel = Card;
export const Surface: React.FC<CardProps> = ({ variant = 'workspace', ...props }) => (
  <Card variant={variant} {...props} />
);

// =========================================================================
// 2. BADGE & TAG PRIMITIVES (Strict Sharp Rectangular Discipline)
// =========================================================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  dot = false,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[11px] font-bold uppercase tracking-wider font-mono transition-colors shrink-0 ${DS_BADGE_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 shrink-0 ${
            variant === 'critical'
              ? 'bg-red-600'
              : variant === 'warning'
              ? 'bg-amber-600'
              : variant === 'live' || variant === 'enterprise'
              ? 'bg-white'
              : 'bg-black'
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export const StatusBadge = Badge;

// =========================================================================
// 3. BUTTON PRIMITIVES
// =========================================================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost' | 'outline' | 'satellite';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-[2px]',
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[2px] tracking-wide font-bold uppercase font-mono',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2 rounded-[2px] tracking-wide font-bold min-h-[38px]',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 rounded-[2px] tracking-wide font-bold min-h-[44px]',
  };

  const variantStyles = {
    primary:
      'bg-black hover:bg-zinc-800 text-white font-bold border border-black transition-colors cursor-pointer',
    gold:
      'bg-black hover:bg-zinc-800 text-white font-bold border border-black transition-colors cursor-pointer',
    secondary:
      'bg-white hover:bg-zinc-100 text-black border border-black font-semibold transition-colors cursor-pointer',
    satellite:
      'bg-white hover:bg-zinc-100 text-black border border-black font-semibold transition-colors cursor-pointer',
    danger:
      'bg-white text-red-700 border border-red-700 hover:bg-red-50 font-semibold transition-colors cursor-pointer',
    ghost:
      'bg-transparent hover:bg-zinc-100 text-zinc-700 hover:text-black border border-transparent transition-colors cursor-pointer',
    outline:
      'bg-white hover:bg-zinc-100 text-black border border-black transition-colors cursor-pointer',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-sans disabled:opacity-40 disabled:cursor-not-allowed select-none whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

// =========================================================================
// 4. STATUS INDICATOR
// =========================================================================
export interface StatusDotProps {
  status: 'live' | 'gold' | 'warning' | 'critical' | 'idle' | 'satellite';
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  className = '',
}) => {
  const colorMap = {
    live: 'bg-emerald-600',
    gold: 'bg-black',
    warning: 'bg-amber-600',
    critical: 'bg-red-600',
    idle: 'bg-zinc-400',
    satellite: 'bg-black',
  };

  return (
    <span className={`inline-flex items-center shrink-0 ${className}`}>
      <span className={`inline-block h-2 w-2 ${colorMap[status]}`} />
    </span>
  );
};

// =========================================================================
// 5. STAT CARD & METRIC DISPLAY
// =========================================================================
export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  status?: 'live' | 'warning' | 'critical' | 'neutral' | 'satellite';
  className?: string;
  variant?: 'default' | 'tactical' | 'workspace';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`p-4 bg-white border border-black rounded-[2px] ${className}`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="font-mono text-[11px] font-bold text-zinc-600 uppercase tracking-wider truncate">
          {label}
        </span>
        {icon && <span className="text-black shrink-0">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-sans text-2xl sm:text-3xl font-extrabold text-black tracking-tight tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`font-mono text-xs shrink-0 tabular-nums ${
              trend.positive ? 'text-emerald-700 font-bold' : 'text-zinc-600'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtext && (
        <p className="font-sans text-xs text-zinc-600 leading-relaxed mt-1.5 line-clamp-2">
          {subtext}
        </p>
      )}
    </div>
  );
};

// =========================================================================
// 6. TYPOGRAPHY PRIMITIVES
// =========================================================================
export const Heading1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h1
    className={`font-sans text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-tight ${className}`}
    {...props}
  >
    {children}
  </h1>
);

export const Heading2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h2
    className={`font-sans text-xl sm:text-2xl font-bold text-black tracking-tight leading-snug ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const Heading3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`font-sans text-base sm:text-lg font-bold text-black tracking-tight leading-snug ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const Heading4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h4
    className={`font-mono text-xs uppercase tracking-wider font-bold text-black leading-normal ${className}`}
    {...props}
  >
    {children}
  </h4>
);

export const BodyLargeMetric: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <span
    className={`font-sans text-2xl sm:text-3xl font-extrabold text-black tabular-nums ${className}`}
    {...props}
  >
    {children}
  </span>
);

export const BodyMediumLabel: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <span
    className={`font-sans text-sm font-semibold text-black leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </span>
);

export const BodySmallStatus: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <span
    className={`font-sans text-xs text-zinc-600 leading-normal ${className}`}
    {...props}
  >
    {children}
  </span>
);

// =========================================================================
// 7. CODE BLOCK (Monochrome Blueprint Inspector)
// =========================================================================
export interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'json',
  fileName,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-[2px] overflow-hidden border border-black bg-white font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-50 border-b border-black text-black">
        <div className="flex items-center gap-2">
          {fileName && <span className="font-mono text-xs font-bold text-black">{fileName}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-600">{language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer text-[10px] font-mono font-bold uppercase"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-black leading-relaxed font-mono bg-white tabular-nums">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// =========================================================================
// 8. SECTION & PAGE HEADERS
// =========================================================================
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black ${className}`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          <h3 className="font-sans text-lg font-bold text-black tracking-tight">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="font-sans text-xs sm:text-sm text-zinc-600">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// =========================================================================
// 9. FORM INPUTS & SELECTS
// =========================================================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1 text-left">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-wider text-black font-bold">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-[2px] bg-white border text-black placeholder-zinc-400 text-sm px-3 py-2 font-sans transition-colors focus:outline-none focus:ring-1 focus:ring-black ${
            icon ? 'pl-9' : ''
          } ${error ? 'border-red-600' : 'border-black'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-700 font-mono">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-600">{helperText}</p>}
    </div>
  );
};

export const SearchInput: React.FC<InputProps> = (props) => (
  <Input icon={<Search className="w-4 h-4 text-zinc-500" />} {...props} />
);

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1 text-left">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-wider text-black font-bold">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full rounded-[2px] bg-white border border-black text-black text-sm px-3 py-2 pr-9 font-sans appearance-none transition-colors focus:outline-none focus:ring-1 focus:ring-black ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-black">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-black">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-700 font-mono">{error}</p>}
    </div>
  );
};

// =========================================================================
// 10. TABS NAVIGATION (Underline & Boxed)
// =========================================================================
export interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'boxed';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeId,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  if (variant === 'boxed') {
    return (
      <div className={`inline-flex border border-black bg-white overflow-x-auto max-w-full ${className}`}>
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                idx > 0 ? 'border-l border-black' : ''
              } ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 text-[10px] font-mono ${isActive ? 'bg-white text-black' : 'bg-zinc-200 text-black'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-black/20 gap-6 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`pb-2.5 pt-1 text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              isActive
                ? 'border-black text-black'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 text-black border border-black/20">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// =========================================================================
// 11. ALERT & CALLOUT BANNERS
// =========================================================================
export interface AlertBannerProps {
  type?: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  description,
  action,
  onDismiss,
  className = '',
}) => {
  return (
    <div
      className={`border rounded-[2px] p-3.5 flex items-start justify-between gap-3 bg-white text-black ${
        type === 'critical'
          ? 'border-red-700 bg-red-50/40'
          : type === 'warning'
          ? 'border-black bg-zinc-50'
          : 'border-black bg-white'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {type === 'critical' ? (
            <ShieldAlert className="w-4 h-4 text-red-700" />
          ) : type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-black" />
          ) : (
            <Info className="w-4 h-4 text-black" />
          )}
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-wider uppercase font-mono text-black">{title}</h4>
          {description && <p className="text-xs sm:text-sm text-zinc-700 mt-0.5 leading-relaxed font-sans">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="px-3 py-1.5 rounded-[2px] text-xs bg-black hover:bg-zinc-800 text-white font-bold uppercase tracking-wider font-mono transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 12. KPI PROGRESS GAUGE & TELEMETRY INDICATOR
// =========================================================================
export interface KpiProgressBarProps {
  label: string;
  value: number;
  thresholds?: { warn: number; crit: number };
  formatter?: (val: number) => string;
  className?: string;
}

export const KpiProgressBar: React.FC<KpiProgressBarProps> = ({
  label,
  value,
  formatter = (v) => `${v.toFixed(1)}%`,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-600 uppercase tracking-wider font-semibold">{label}</span>
        <span className="font-bold text-black tabular-nums">
          {formatter(value)}
        </span>
      </div>
      <div className="w-full bg-zinc-200 border border-black/30 h-2 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export interface TelemetryPillProps {
  label: string;
  value: string | number;
  status?: 'live' | 'warning' | 'critical' | 'satellite';
  className?: string;
}

export const TelemetryPill: React.FC<TelemetryPillProps> = ({
  label,
  value,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-white border border-black text-xs font-mono text-black tabular-nums ${className}`}
    >
      <span className="text-zinc-600 uppercase font-semibold">{label}:</span>
      <span className="text-black font-bold">{value}</span>
    </span>
  );
};

// =========================================================================
// 13. TABLE SHELL
// =========================================================================
export interface TableShellProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const TableShell: React.FC<TableShellProps> = ({
  headers,
  children,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-[2px] border border-black bg-white ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
        <thead>
          <tr className="border-b border-black bg-zinc-50 text-black font-mono text-[11px] uppercase tracking-wider">
            {headers.map((h, i) => (
              <th key={i} className="py-2.5 px-3.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/15 text-black">{children}</tbody>
      </table>
    </div>
  );
};

// =========================================================================
// 14. EMPTY STATE
// =========================================================================
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-10 text-center bg-white rounded-[2px] border border-black flex flex-col items-center justify-center space-y-3 ${className}`}>
      {icon && <div className="text-black">{icon}</div>}
      <h4 className="font-sans text-base font-bold text-black">{title}</h4>
      <p className="font-sans text-xs sm:text-sm text-zinc-600 max-w-md leading-relaxed">{description}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
};

// =========================================================================
// 15. MODAL SHELL
// =========================================================================
export interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '6xl';
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  badge,
  children,
  footer,
  maxWidth = '2xl',
}) => {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthStyles[maxWidth]} rounded-[2px] bg-white border-2 border-black shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-black font-sans`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black shrink-0 bg-white">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-[2px] bg-black text-white flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-black tracking-tight">{title}</h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-transparent hover:border-black text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-white">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-3.5 sm:p-4 bg-zinc-50 border-t border-black shrink-0 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 16. WIREFRAME ARCHITECTURAL PRIMITIVES (Used across WF-01 .. WF-45)
// =========================================================================
export interface KeyValueRow {
  key: string;
  value: React.ReactNode;
}

export const KeyValueTable: React.FC<{
  title?: string;
  rows: KeyValueRow[];
  className?: string;
}> = ({ title, rows, className = '' }) => (
  <div className={`space-y-1.5 ${className}`}>
    {title && (
      <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
        {title}
      </div>
    )}
    <div className="border border-black bg-white divide-y divide-black/15">
      {rows.map((r, idx) => (
        <div key={idx} className="grid grid-cols-12 text-xs">
          <div className="col-span-5 px-3 py-2 font-mono font-bold uppercase text-[11px] text-black border-r border-black/15 bg-zinc-50/70">
            {r.key}
          </div>
          <div className="col-span-7 px-3 py-2 font-sans text-black tabular-nums break-words">
            {r.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CalloutBanner: React.FC<{
  symbol?: '!' | 'i';
  text: string;
  rightText?: string;
  className?: string;
}> = ({ symbol = '!', text, rightText, className = '' }) => (
  <div className={`border border-black bg-white px-4 py-3 flex items-center justify-between gap-4 ${className}`}>
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 border border-black rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0">
        {symbol}
      </span>
      <span className="text-sm font-semibold text-black">{text}</span>
    </div>
    {rightText && (
      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 border-l border-black/25 pl-3 shrink-0">
        {rightText}
      </span>
    )}
  </div>
);

export const ModeSegmentedToggle: React.FC<{
  mode: 'guided' | 'expert';
  onChange: (mode: 'guided' | 'expert') => void;
  className?: string;
}> = ({ mode, onChange, className = '' }) => (
  <div className={`grid grid-cols-2 border border-black bg-white ${className}`}>
    <button
      type="button"
      onClick={() => onChange('guided')}
      className={`py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
        mode === 'guided' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
      }`}
    >
      GUIDED
    </button>
    <button
      type="button"
      onClick={() => onChange('expert')}
      className={`py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider border-l border-black transition-colors cursor-pointer ${
        mode === 'expert' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
      }`}
    >
      EXPERT
    </button>
  </div>
);

// =========================================================================
// 17. CENTRALIZED DESIGN SYSTEM CONTEXT & HOOK
// =========================================================================
export interface DesignSystemContextType {
  density: 'compact' | 'standard' | 'spacious';
  setDensity: (d: 'compact' | 'standard' | 'spacious') => void;
  tokens: typeof DS_COLORS;
  typography: typeof DS_TYPOGRAPHY;
}

export const DesignSystemContext = createContext<DesignSystemContextType>({
  density: 'standard',
  setDensity: () => {},
  tokens: DS_COLORS,
  typography: DS_TYPOGRAPHY,
});

export const useDesignSystem = () => useContext(DesignSystemContext);

export { DS_COLORS, DS_RADIUS, DS_BORDERS, DS_TRANSITIONS, ATELIER_TYPOGRAPHY, DS_TYPOGRAPHY, DS_BADGE_VARIANTS, TELECOM_THRESHOLDS };
export type { BadgeVariant };
export { DesignSystemShowcaseModal } from './DesignSystemShowcaseModal';
