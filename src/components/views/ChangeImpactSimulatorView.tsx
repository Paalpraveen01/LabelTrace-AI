import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Filter,
  FileCheck2,
  RefreshCw,
  Box,
  FileSpreadsheet,
  Globe2,
} from 'lucide-react';
import { mockChangeImpactService, ImpactSummaryResult } from '../../services';
import { Badge } from '../common/Badge';
import { SymbolBadge } from '../common/SymbolBadge';
import { TabType } from '../common/Header';

interface ChangeImpactSimulatorViewProps {
  onNavigateTab: (tab: TabType) => void;
  selectedProduct: string;
}

export const ChangeImpactSimulatorView: React.FC<ChangeImpactSimulatorViewProps> = ({
  onNavigateTab,
  selectedProduct,
}) => {
  const [productCode, setProductCode] = useState(selectedProduct || 'CS-100');
  const [changeType, setChangeType] = useState('sterilization');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['US', 'EU', 'Japan']);
  const [isLoading, setIsLoading] = useState(false);
  const [impactData, setImpactData] = useState<ImpactSummaryResult | null>(null);

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const data = await mockChangeImpactService.getImpactAnalysis({
        productCode,
        changeType,
        markets: selectedMarkets,
      });
      setImpactData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [productCode]);

  const toggleMarket = (mkt: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(mkt) ? prev.filter((m) => m !== mkt) : [...prev, mkt]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Layers className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Change Impact Simulator
            </h1>
            <Badge variant="blue" size="sm">
              Deterministic Impact Engine
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Simulate engineering change orders across global packaging tiers, symbols, barcodes, and regulatory filings.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Simulating Engine...' : 'Re-Run Impact Simulation'}</span>
        </button>
      </div>

      {/* Simulator Inputs Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Engineering Change Parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Product Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Medical Device:
            </label>
            <select
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              <option value="CS-100">Cardiac Stent CS-100 (Class III PMA)</option>
              <option value="SI-200">Surgical Instrument SI-200 (Class IIa)</option>
              <option value="OI-300">Orthopedic Implant OI-300 (Class IIb)</option>
            </select>
          </div>

          {/* Change Parameter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proposed Engineering Modification:
            </label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              <option value="sterilization">Sterilization: Ethylene Oxide (EO) → Gamma Radiation (R)</option>
              <option value="shelflife">Shelf Life Extension: 36 Months → 48 Months</option>
              <option value="material">Primary Packaging: Tyvek 1073B Material Supplier Update</option>
            </select>
          </div>

          {/* Target Jurisdictions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Active Regulatory Jurisdictions:
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['US', 'EU', 'Japan', 'Middle East'].map((mkt) => {
                const checked = selectedMarkets.includes(mkt);
                return (
                  <button
                    key={mkt}
                    type="button"
                    onClick={() => toggleMarket(mkt)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                      checked
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {mkt} {checked ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results Banner */}
      {impactData && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Total Labels Impacted</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">
                {impactData.totalLabelsImpacted} of {impactData.totalLabelsScanned} SKUs
              </div>
              <span className="text-[11px] text-slate-500">100% of target packaging files</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Jurisdictions Affected</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">3 Regimes</div>
              <span className="text-[11px] text-slate-500">US FDA, EU MDR, Japan PMDA</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500">ISO Symbol Substitutions</span>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">12 Labels</div>
              <span className="text-[11px] text-slate-500">STERILE EO → STERILE R</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Turnaround Acceleration</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">12 Sec</div>
              <span className="text-[11px] text-slate-500">vs 38 days manual packaging review</span>
            </div>
          </div>

          {/* Symbol Migration Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Symbol & Nomenclature Migration Map (ISO 15223-1:2021)
              </h3>
              <Badge variant="blue" size="sm">
                Mandatory Global Rule
              </Badge>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Current Symbol (Legacy)</th>
                    <th className="p-3">Proposed AI Replacement</th>
                    <th className="p-3">ISO 15223 Clause</th>
                    <th className="p-3">Affected SKUs</th>
                    <th className="p-3">Packaging Levels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-3">
                      <SymbolBadge symbol="STERILE EO" />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        <SymbolBadge symbol="STERILE R" highlight />
                      </div>
                    </td>
                    <td className="p-3 font-mono">Clause 5.2.4 (Radiation)</td>
                    <td className="p-3 font-bold text-blue-700">12 Labels</td>
                    <td className="p-3 text-slate-600">Pouch, Carton, Shipper, IFU</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 12 Affected Labels Grouped By Packaging Level */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  12 Affected Labels Breakdown (US, EU, Japan)
                </h3>
                <p className="text-xs text-slate-500">
                  Categorized across the 4 packaging and instruction tiers
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('drafts')}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>View Staged Artwork Drafts →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {impactData.packagingTiersImpacted.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{tier.level}</span>
                    <Badge variant="blue" size="sm">
                      {tier.count} SKUs
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    {tier.labels.map((lblId) => {
                      const labelObj = impactData.affectedLabels.find((l) => l.id === lblId);
                      const isJP = labelObj?.market === 'Japan';

                      return (
                        <div
                          key={lblId}
                          className="bg-white p-2 rounded border border-slate-200 text-xs shadow-2xs hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">{lblId}</span>
                            <Badge
                              variant={
                                labelObj?.market === 'Japan'
                                  ? 'red'
                                  : labelObj?.market === 'EU'
                                  ? 'blue'
                                  : 'purple'
                              }
                              size="sm"
                            >
                              {labelObj?.market}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {labelObj?.dimensions}
                          </div>
                          {isJP && (
                            <div className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1 py-0.5 rounded mt-1">
                              ⚠️ PMDA Caution & Barcode sync required
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

