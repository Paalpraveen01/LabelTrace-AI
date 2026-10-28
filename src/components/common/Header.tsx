import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  FileCheck2,
  GitCompare,
  GitFork,
  CheckCircle2,
  FileText,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from './Badge';

export type TabType =
  | 'copilot'
  | 'kpis'
  | 'impact'
  | 'drafts'
  | 'compliance'
  | 'diff'
  | 'traceability'
  | 'workflow'
  | 'audit';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedProduct: string;
  setSelectedProduct: (p: string) => void;
  onRunDemoScenario: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedProduct,
  setSelectedProduct,
  onRunDemoScenario,
}) => {
  const tabs = [
    { id: 'copilot' as TabType, label: 'AI Copilot', icon: Sparkles, badge: 'Main' },
    { id: 'kpis' as TabType, label: 'Dashboard KPIs', icon: Activity },
    { id: 'impact' as TabType, label: 'Impact Simulator', icon: Layers, badge: '12 Labels' },
    { id: 'drafts' as TabType, label: 'Label Drafts', icon: FileCheck2 },
    { id: 'compliance' as TabType, label: 'Compliance', icon: AlertTriangle, badge: '2 Blocked', badgeVariant: 'red' as const },
    { id: 'diff' as TabType, label: 'Artwork Diff', icon: GitCompare },
    { id: 'traceability' as TabType, label: 'Traceability', icon: GitFork },
    { id: 'workflow' as TabType, label: 'Approval Workflow', icon: CheckCircle2, badge: 'Regulatory', badgeVariant: 'amber' as const },
    { id: 'audit' as TabType, label: 'Audit Package', icon: FileText, badge: 'Part 11' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md ring-2 ring-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  LabelTrace AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-950/80 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded">
                  MedTech Copilot
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Medical Device Labeling & Regulatory Traceability
              </p>
            </div>
          </div>

          {/* Center Context / Product Selector */}
          <div className="hidden md:flex items-center gap-3 bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 shadow-inner">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Device:</span>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-slate-900 border border-slate-600 text-blue-200 font-semibold text-xs rounded px-2.5 py-1 focus:ring-1 focus:ring-blue-400 focus:outline-none cursor-pointer"
            >
              <option value="CS-100">Cardiac Stent CS-100 (Class III PMA)</option>
              <option value="SI-200">Surgical Instrument SI-200 (Class IIa)</option>
              <option value="OI-300">Orthopedic Implant OI-300 (Class IIb)</option>
            </select>

            <span className="h-4 w-px bg-slate-700" />

            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-slate-300 font-medium">ECO-2026-089</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onRunDemoScenario}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm border border-blue-400/30 transition-all active:scale-95"
              title="Loads the full CS-100 sterilization scenario"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeVariant === 'red'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : tab.badgeVariant === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

