import React from 'react';

interface SymbolBadgeProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

export const SymbolBadge: React.FC<SymbolBadgeProps> = ({
  symbol,
  size = 'md',
  highlight = false,
}) => {
  const getSymbolDisplay = () => {
    switch (symbol.toUpperCase()) {
      case 'STERILE EO':
        return {
          icon: '⬛ EO',
          label: 'STERILE EO',
          sub: 'ISO 15223 5.2.3',
          border: 'border-slate-300 bg-slate-50 text-slate-700',
        };
      case 'STERILE R':
        return {
          icon: '☢️ R',
          label: 'STERILE R',
          sub: 'ISO 15223 5.2.4',
          border: 'border-blue-300 bg-blue-50 text-blue-800 font-semibold',
        };
      case 'DO NOT RE-USE':
        return {
          icon: '②̸',
          label: 'DO NOT RE-USE',
          sub: 'ISO 15223 5.4.2',
          border: 'border-amber-300 bg-amber-50 text-amber-900',
        };
      case 'CONSULT IFU':
        return {
          icon: '📖 ℹ️',
          label: 'CONSULT IFU',
          sub: 'ISO 15223 5.4.3',
          border: 'border-slate-300 bg-slate-50 text-slate-700',
        };
      case 'CE 0123':
        return {
          icon: '🇪🇺 CE',
          label: 'CE 0123',
          sub: 'TÜV SÜD',
          border: 'border-blue-400 bg-blue-50 text-blue-900 font-bold',
        };
      case 'RX ONLY':
        return {
          icon: '℞',
          label: 'Rx Only',
          sub: 'FDA 21 CFR',
          border: 'border-slate-400 bg-slate-100 text-slate-800 font-bold',
        };
      case 'MD':
        return {
          icon: 'MD',
          label: 'Medical Device',
          sub: 'ISO 15223 5.7.7',
          border: 'border-slate-300 bg-white text-slate-700',
        };
      default:
        return {
          icon: '🏷️',
          label: symbol,
          sub: 'Standard',
          border: 'border-slate-200 bg-slate-50 text-slate-600',
        };
    }
  };

  const item = getSymbolDisplay();

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded border ${item.border} ${sizeClass} ${
        highlight ? 'ring-2 ring-blue-500 shadow-sm' : ''
      }`}
      title={`${item.label} (${item.sub})`}
    >
      <span className="font-mono text-xs">{item.icon}</span>
      <span className="font-semibold tracking-wide">{item.label}</span>
    </div>
  );
};

