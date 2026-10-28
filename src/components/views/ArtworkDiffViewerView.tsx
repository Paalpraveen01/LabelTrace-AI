import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Scan,
} from 'lucide-react';
import { mockArtworkDiffService, ArtworkDiffResult } from '../../services';
import { Badge } from '../common/Badge';
import { SymbolBadge } from '../common/SymbolBadge';
import { BarcodePreview } from '../common/BarcodePreview';
import { TabType } from '../common/Header';

interface ArtworkDiffViewerViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const ArtworkDiffViewerView: React.FC<ArtworkDiffViewerViewProps> = ({
  onNavigateTab,
}) => {
  const [diffData, setDiffData] = useState<ArtworkDiffResult | null>(null);
  const [activeChangeId, setActiveChangeId] = useState<string>('DIFF-01');
  const [overlayActive, setOverlayActive] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiff = async () => {
      setIsLoading(true);
      const data = await mockArtworkDiffService.getDiff();
      setDiffData(data);
      setIsLoading(false);
    };
    fetchDiff();
  }, []);

  if (!diffData) return null;

  const activeChange =
    diffData.changes.find((c) => c.id === activeChangeId) || diffData.changes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <GitCompare className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Artwork Diff Viewer (Vision QA)
            </h1>
            <Badge variant="blue" size="sm">
              Computer Vision Pixel & Semantic Diff
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Component: <strong>{diffData.labelName}</strong> ({diffData.labelId}) • Comparing {diffData.versionBefore} vs {diffData.versionAfter}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOverlayActive(!overlayActive)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              overlayActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            {overlayActive ? '✓ Bounding Overlays ON' : 'Bounding Overlays OFF'}
          </button>

          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
              className="p-1.5 text-slate-500 hover:text-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-600">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
              className="p-1.5 text-slate-500 hover:text-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Hardcoded Artwork Diff Changes Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {diffData.changes.map((change) => {
          const isSelected = change.id === activeChangeId;
          const isCritical = change.severity === 'CRITICAL';

          return (
            <button
              key={change.id}
              onClick={() => setActiveChangeId(change.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-white border-blue-600 ring-2 ring-blue-500 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-400">
                  {change.id}
                </span>
                <Badge variant={isCritical ? 'red' : 'amber'} size="sm">
                  {change.type.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                {change.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {change.validationNote}
              </div>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Production Artwork (Before) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-sm">
                Legacy Production Artwork
              </span>
              <div className="text-xs text-slate-500">
                {diffData.versionBefore} • Released State
              </div>
            </div>
            <Badge variant="gray" size="sm">
              BEFORE
            </Badge>
          </div>

          {/* Visual Artwork Container with simulated bounding box */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 bg-slate-50/50 relative min-h-[380px] flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="text-[10px] font-mono text-slate-400">CardioMed • Japan Edition</div>
              <div className="text-base font-extrabold text-slate-900">Cardiac Stent CS-100</div>
              <div className="text-xs text-slate-600">Secondary Carton Packaging Label</div>
            </div>

            {/* Symbol Box (STERILE EO Legacy) */}
            <div
              className={`p-3 bg-white rounded border transition-all ${
                activeChange.type === 'missing symbol' && overlayActive
                  ? 'border-rose-500 ring-4 ring-rose-400/40 bg-rose-50/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-mono mb-1">
                Sterilization & Safety Symbols:
              </div>
              <div className="flex items-center gap-2">
                <SymbolBadge symbol="STERILE EO" />
                <SymbolBadge symbol="DO NOT RE-USE" />
                <span className="text-xs font-mono text-rose-600 font-bold">
                  (Legacy EO Gas - Outdated)
                </span>
              </div>
            </div>

            {/* Layout Shift Area (Blank space where warning is missing) */}
            <div
              className={`p-3 rounded border text-xs transition-all ${
                activeChange.type === 'layout shift' && overlayActive
                  ? 'border-amber-500 ring-4 ring-amber-400/40 bg-amber-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                Japanese Caution Zone (7.5pt):
              </div>
              <div className="text-slate-400 italic font-mono text-[11px]">
                [ Empty Margin Space — Missing Mandatory Kanji Notice ]
              </div>
            </div>

            {/* Barcode Area (Discrepant AI 17 Expiry Date) */}
            <div
              className={`p-3 rounded border transition-all ${
                activeChange.type === 'changed barcode' && overlayActive
                  ? 'border-rose-500 ring-4 ring-rose-400/40 bg-rose-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <BarcodePreview
                di="(01)04987012345678"
                pi="(17)290930(10)LOT-2026A(21)SN-99412"
                hasMismatch={true}
              />
              <div className="text-[10px] text-rose-600 font-bold mt-1 font-mono">
                Mismatch: AI(17) enc: 290930 vs Human: 2029-09-30
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong>Before Specs:</strong> {activeChange.before.description}
          </div>
        </div>

        {/* Right: AI Staged Artwork (After) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-sm">
                AI Staged Corrected Artwork
              </span>
              <div className="text-xs text-slate-500">
                {diffData.versionAfter} • ECO-2026-089 Draft
              </div>
            </div>
            <Badge variant="green" size="sm">
              AFTER (CORRECTED)
            </Badge>
          </div>

          {/* Visual Artwork Container with simulated bounding box */}
          <div className="border-2 border-emerald-300 rounded-lg p-5 bg-emerald-50/10 relative min-h-[380px] flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="text-[10px] font-mono text-blue-600 font-bold">
                CardioMed • Japan Edition (PMDA Approved Spec)
              </div>
              <div className="text-base font-extrabold text-slate-900">Cardiac Stent CS-100</div>
              <div className="text-xs text-slate-600">Secondary Carton Packaging Label</div>
            </div>

            {/* Symbol Box (STERILE R Injected) */}
            <div
              className={`p-3 bg-white rounded border transition-all ${
                activeChange.type === 'missing symbol' && overlayActive
                  ? 'border-emerald-500 ring-4 ring-emerald-400/40 bg-emerald-50/40'
                  : 'border-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-mono mb-1">
                Sterilization & Safety Symbols:
              </div>
              <div className="flex items-center gap-2">
                <SymbolBadge symbol="STERILE R" highlight />
                <SymbolBadge symbol="DO NOT RE-USE" />
                <span className="text-xs font-mono text-emerald-700 font-bold">
                  (ISO 15223-1 #5.2.4 Gamma Radiation)
                </span>
              </div>
            </div>

            {/* Layout Shift Area (Kanji caution inserted) */}
            <div
              className={`p-3 rounded border text-xs transition-all ${
                activeChange.type === 'layout shift' && overlayActive
                  ? 'border-emerald-500 ring-4 ring-emerald-400/40 bg-emerald-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="text-[10px] font-mono text-blue-700 font-bold mb-0.5">
                【警告】Japanese Caution Injected (7.5pt Shift -8.4mm):
              </div>
              <div className="text-slate-900 font-bold text-[11px]">
                再滅菌禁止。本品は単回使用であり、再滅菌及び再使用は厳重に禁じられています。
              </div>
            </div>

            {/* Barcode Area (Synchronized Barcode) */}
            <div
              className={`p-3 rounded border transition-all ${
                activeChange.type === 'changed barcode' && overlayActive
                  ? 'border-emerald-500 ring-4 ring-emerald-400/40 bg-emerald-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <BarcodePreview
                di="(01)04987012345678"
                pi="(17)290831(10)LOT-2026A(21)SN-99412"
                hasMismatch={false}
              />
              <div className="text-[10px] text-emerald-700 font-bold mt-1 font-mono">
                ✓ AI(17) and human text aligned to 2029-08-31
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-emerald-50/60 p-2.5 rounded border border-emerald-200">
            <strong>After Specs:</strong> {activeChange.after.description}
          </div>
        </div>
      </div>

      {/* Selected Change Deep Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Diff Inspector: {activeChange.title}
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Coords: x:{activeChange.boundingBox.x}mm y:{activeChange.boundingBox.y}mm w:
            {activeChange.boundingBox.width}mm h:{activeChange.boundingBox.height}mm
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {activeChange.validationNote}
        </p>

        <div className="flex items-center justify-between pt-2 text-xs">
          <button
            onClick={() => onNavigateTab('workflow')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Advance to Approval Workflow →
          </button>
          <span className="text-slate-400 font-mono text-[11px]">
            Visual Inspection Pass: Automated Pixel Diff Grade A
          </span>
        </div>
      </div>
    </div>
  );
};

