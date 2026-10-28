import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import { mockLabelDraftService, LabelDraft } from '../../services';
import { labelsData } from '../../mocks';
import { Badge } from '../common/Badge';
import { SymbolBadge } from '../common/SymbolBadge';
import { BarcodePreview } from '../common/BarcodePreview';
import { TabType } from '../common/Header';

interface LabelDraftGeneratorViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const LabelDraftGeneratorView: React.FC<LabelDraftGeneratorViewProps> = ({
  onNavigateTab,
}) => {
  const [drafts, setDrafts] = useState<LabelDraft[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState('LBL-CS100-JP-C10');
  const [previewMode, setPreviewMode] = useState<'after' | 'before'>('after');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<{ [key: string]: boolean }>({
    'LBL-CS100-JP-C10': true,
    'LBL-CS100-JP-P09': true,
  });
  const [fixSuccessMsg, setFixSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      setIsLoading(true);
      const data = await mockLabelDraftService.getDrafts();
      setDrafts(data);
      setIsLoading(false);
    };
    fetchDrafts();
  }, []);

  const activeDraft = drafts.find((d) => d.labelId === selectedLabelId) || drafts[0];
  const activeLabelData = labelsData.find((l) => l.id === selectedLabelId);

  const handleApplySingleFix = async (fixType: 'japanese_warning' | 'barcode_sync' | 'symbol_update') => {
    setIsLoading(true);
    const res = await mockLabelDraftService.applyAutoFix(selectedLabelId, fixType);
    setAppliedFixes((prev) => ({ ...prev, [selectedLabelId]: true }));
    setFixSuccessMsg(res.message);
    setIsLoading(false);
    setTimeout(() => setFixSuccessMsg(null), 3500);
  };

  const isJP = activeDraft?.market === 'Japan';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Label Draft Generator
            </h1>
            <Badge variant="blue" size="sm">
              Artwork Synthesis Engine
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Automated artwork drafting for ECO-2026-089. Live preview of symbols, UDI barcodes, and localized warning blocks.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setPreviewMode('before')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              previewMode === 'before'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Legacy Artwork (v1.0 EO)
          </button>
          <button
            onClick={() => setPreviewMode('after')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              previewMode === 'after'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Staged Draft (v2.0 Gamma)</span>
          </button>
        </div>
      </div>

      {fixSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{fixSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Label Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Staged Labels ({drafts.length})
            </span>
            <span className="text-[11px] text-slate-400">Click to preview</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {drafts.map((draft) => {
              const isSelected = draft.labelId === selectedLabelId;
              const hasAlert = draft.labelId.includes('JP');

              return (
                <button
                  key={draft.labelId}
                  onClick={() => setSelectedLabelId(draft.labelId)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {draft.labelId}
                    </span>
                    <Badge
                      variant={
                        draft.market === 'Japan'
                          ? 'red'
                          : draft.market === 'EU'
                          ? 'blue'
                          : 'purple'
                      }
                      size="sm"
                    >
                      {draft.market}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{draft.packageLevel}</div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400">
                      {draft.versionBefore} → <strong className="text-blue-700">{draft.versionAfter}</strong>
                    </span>
                    {hasAlert && (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        ⚠️ PMDA Caution
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Artwork Canvas & Quick Fix Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick AI Remediation Actions Banner */}
          {isJP && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Autonomous Compliance Assistant</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Automate compliance injection for Japanese carton & pouch (Kanji notice + AI-17 sync).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleApplySingleFix('japanese_warning')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto-Inject Japanese Caution</span>
                </button>
                <button
                  onClick={() => handleApplySingleFix('barcode_sync')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Sync Barcode AI(17)</span>
                </button>
              </div>
            </div>
          )}

          {/* High-Fidelity Medical Device Artwork Rendering Card */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-md relative overflow-hidden font-sans">
            {/* Visual Die-Cut Outline and Registration Corner Marks */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400">
              ┌ DIE-CUT BLEED 3.0mm
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-400">
              REGISTRATION: PASS ┐
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400">
              └ SPEC-LBL-CS100-REV2
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400">
              ISO 15378 CERTIFIED ┘
            </div>

            {/* Label Canvas Container */}
            <div className="border border-slate-400 p-6 rounded bg-slate-50/30 space-y-5 my-2">
              {/* Top Row: Device Name & Model */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b-2 border-slate-900 gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                    CardioMed Technologies Inc. • Minneapolis, MN USA
                  </div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">
                    Cardiac Stent CS-100™
                  </h2>
                  <div className="text-xs text-slate-700 font-medium">
                    Rapid Exchange Coronary Stent System | Cobalt-Chromium (L605)
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    Dimensions: 3.0mm × 18mm | Nominal: 9 atm | RBP: 16 atm
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block px-2 py-0.5 border-2 border-slate-900 text-xs font-extrabold text-slate-900 uppercase">
                    {previewMode === 'after' ? 'DRAFT v2.0' : 'RELEASED v1.0'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {activeLabelData?.packageLevel}
                  </div>
                  <div className="text-[10px] font-bold text-blue-800">
                    Target: {activeDraft?.market}
                  </div>
                </div>
              </div>

              {/* Middle Row: Symbols Strip */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-slate-300 rounded-md">
                {previewMode === 'before' ? (
                  // Before: Legacy EO
                  <>
                    <SymbolBadge symbol="STERILE EO" />
                    <SymbolBadge symbol="DO NOT RE-USE" />
                    <SymbolBadge symbol="CONSULT IFU" />
                    {activeDraft?.market === 'US' ? (
                      <SymbolBadge symbol="Rx Only" />
                    ) : (
                      <SymbolBadge symbol="CE 0123" />
                    )}
                    <SymbolBadge symbol="MD" />
                  </>
                ) : (
                  // After: Staged Gamma R
                  <>
                    <SymbolBadge symbol="STERILE R" highlight />
                    <SymbolBadge symbol="DO NOT RE-USE" />
                    <SymbolBadge symbol="CONSULT IFU" />
                    {activeDraft?.market === 'US' ? (
                      <SymbolBadge symbol="Rx Only" />
                    ) : (
                      <SymbolBadge symbol="CE 0123" />
                    )}
                    <SymbolBadge symbol="MD" />
                  </>
                )}
              </div>

              {/* Japanese Mandatory Warning Box (Injected or Legacy) */}
              {isJP && (
                <div
                  className={`p-3 rounded border ${
                    previewMode === 'after' && appliedFixes[selectedLabelId]
                      ? 'bg-blue-50/70 border-blue-400 text-slate-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>
                      {previewMode === 'after'
                        ? '【法的表示 / PMD Act Compliance Warning Block】'
                        : '【警告表示：未記載 (Warning Block Missing)】'}
                    </span>
                    <span className="text-[10px] font-mono">7.5pt Hiragino Kaku Gothic</span>
                  </div>

                  {previewMode === 'after' && appliedFixes[selectedLabelId] ? (
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-950">
                        【警告】再滅菌禁止。本品は単回使用医療機器であり、いかなる場合も再滅菌を行ってはならない。
                      </p>
                      <p className="text-[11px] text-slate-700">
                        製造販売業者：カルディオメド・ジャパン株式会社 東京都千代田区大手町1-2-3 | 承認番号：30400BZX00123000
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-700 font-medium">
                      ⚠️ WARNING OMITTED: Japanese law strictly mandates '再滅菌禁止' text on this component before marketing authorization.
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Row: Barcode & Packaging Batch Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <BarcodePreview
                    di={activeDraft?.udiDIAfter || '(01)00850012345678'}
                    pi={
                      previewMode === 'before'
                        ? '(17)290930(10)LOT-2026A(21)SN-99412'
                        : '(17)290831(10)LOT-2026A(21)SN-99412'
                    }
                    hasMismatch={previewMode === 'before' && isJP}
                  />
                </div>

                <div className="text-xs font-mono bg-white p-3 rounded border border-slate-300 space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">LOT / BATCH:</span>
                    <span className="font-bold text-slate-900">LOT-2026A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EXPIRATION (YYYY-MM-DD):</span>
                    <span
                      className={`font-bold ${
                        previewMode === 'before' && isJP
                          ? 'text-rose-600 bg-rose-50 px-1'
                          : 'text-slate-900'
                      }`}
                    >
                      {previewMode === 'before' && isJP
                        ? '2029-09-30 (Discrepant)'
                        : '2029-08-31 (Verified)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">STERILIZATION METHOD:</span>
                    <span className="font-bold text-blue-700">
                      {previewMode === 'after' ? 'GAMMA RADIATION 25 kGy' : 'ETHYLENE OXIDE (EO)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Status Check */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <span>
                Artwork Hash: <strong className="font-mono text-slate-700">SHA256:7f4a...29e1</strong>
              </span>
              <button
                onClick={() => onNavigateTab('diff')}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Inspect Artwork Diff (Before vs After) →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

