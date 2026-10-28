import React from 'react';

interface BarcodePreviewProps {
  type?: 'datamatrix' | 'linear';
  di: string;
  pi: string;
  hasMismatch?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BarcodePreview: React.FC<BarcodePreviewProps> = ({
  type = 'datamatrix',
  di,
  pi,
  hasMismatch = false,
  size = 'md',
}) => {
  return (
    <div
      className={`border rounded p-2.5 bg-white font-mono text-xs flex items-center gap-3 shadow-inner ${
        hasMismatch ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400' : 'border-slate-300'
      }`}
    >
      {/* Visual Simulated 2D DataMatrix SVG */}
      <div className="shrink-0 bg-white p-1 rounded border border-slate-200">
        <svg
          viewBox="0 0 40 40"
          className={size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* L-finder pattern (solid left and bottom lines) */}
          <rect x="2" y="2" width="4" height="36" fill="#0f172a" />
          <rect x="2" y="34" width="36" height="4" fill="#0f172a" />
          {/* Clocking pattern (alternating top and right dots) */}
          <rect x="8" y="2" width="4" height="4" fill="#0f172a" />
          <rect x="16" y="2" width="4" height="4" fill="#0f172a" />
          <rect x="24" y="2" width="4" height="4" fill="#0f172a" />
          <rect x="32" y="2" width="4" height="4" fill="#0f172a" />
          <rect x="34" y="8" width="4" height="4" fill="#0f172a" />
          <rect x="34" y="16" width="4" height="4" fill="#0f172a" />
          <rect x="34" y="24" width="4" height="4" fill="#0f172a" />
          {/* Data Payload Matrix Cells */}
          <rect x="10" y="10" width="4" height="4" fill={hasMismatch ? '#e11d48' : '#0f172a'} />
          <rect x="18" y="10" width="4" height="4" fill="#0f172a" />
          <rect x="26" y="10" width="4" height="4" fill="#0f172a" />
          <rect x="14" y="16" width="4" height="4" fill="#0f172a" />
          <rect x="22" y="16" width="4" height="4" fill={hasMismatch ? '#e11d48' : '#0f172a'} />
          <rect x="10" y="22" width="4" height="4" fill="#0f172a" />
          <rect x="18" y="22" width="4" height="4" fill="#0f172a" />
          <rect x="26" y="22" width="4" height="4" fill="#0f172a" />
          <rect x="14" y="28" width="4" height="4" fill="#0f172a" />
          <rect x="22" y="28" width="4" height="4" fill="#0f172a" />
        </svg>
      </div>

      {/* Human Readable Interpretation (HRI) */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider mb-0.5">
          <span>GS1 DataMatrix (2D)</span>
          {hasMismatch ? (
            <span className="text-rose-600 font-bold flex items-center gap-1">
              ⚠️ PARITY ERROR
            </span>
          ) : (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              ✓ ISO 15415 Grade A
            </span>
          )}
        </div>
        <div className="truncate text-slate-800 font-medium text-[11px]">{di}</div>
        <div className={`truncate text-[11px] ${hasMismatch ? 'text-rose-700 font-bold bg-rose-100/60 px-1 rounded' : 'text-slate-600'}`}>
          {pi}
        </div>
      </div>
    </div>
  );
};

