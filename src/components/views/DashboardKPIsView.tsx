import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Globe2,
  Flame,
} from 'lucide-react';
import { dashboardKPIsData, productsData } from '../../mocks';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface DashboardKPIsViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const DashboardKPIsView: React.FC<DashboardKPIsViewProps> = ({ onNavigateTab }) => {
  const { summary, metrics, regionalBreakdown, recentActivities } = dashboardKPIsData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Alert for Active ECO */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/60 rounded-xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs uppercase font-extrabold text-blue-300 tracking-wider">
              High Priority Change Order
            </span>
            <Badge variant="amber" size="sm">
              REGULATORY REVIEW HOLD
            </Badge>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            ECO-2026-089: Terminal Sterilization Transition (EO → Gamma) for Cardiac Stent CS-100
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            12 of 16 packaging specifications impacted across US FDA, EU MDR, and Japan PMDA. 2 critical blockers identified by autonomous rule check.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('copilot')}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open AI Copilot</span>
          </button>
          <button
            onClick={() => onNavigateTab('impact')}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-700 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Simulate Impact</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((kpi) => {
          const isNegative = kpi.changeType === 'negative' || kpi.changeType === 'critical';
          const isPositive = kpi.changeType === 'positive';

          return (
            <div
              key={kpi.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                <span>{kpi.label}</span>
                {kpi.statusColor === 'red' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                )}
                {kpi.statusColor === 'amber' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                )}
                {kpi.statusColor === 'green' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                )}
                {kpi.statusColor === 'blue' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-semibold inline-flex items-center ${
                    isNegative ? 'text-rose-600' : isPositive ? 'text-emerald-600' : 'text-blue-600'
                  }`}
                >
                  {isNegative ? (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : null}
                  {kpi.change}
                </span>
              </div>

              <p className="text-xs text-slate-500">{kpi.subtitle}</p>

              {/* Bottom decorative color bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${
                  kpi.statusColor === 'red'
                    ? 'bg-rose-500'
                    : kpi.statusColor === 'amber'
                    ? 'bg-amber-500'
                    : kpi.statusColor === 'green'
                    ? 'bg-emerald-500'
                    : 'bg-blue-600'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Middle Section: Regional Compliance Matrix + Active Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Compliance Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Global Regulatory Jurisdiction Compliance
              </h3>
            </div>
            <span className="text-xs text-slate-400">ECO-2026-089 Scope</span>
          </div>

          <div className="space-y-3">
            {regionalBreakdown.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800">{r.region}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {r.totalLabels} affected packaging tiers in scope
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={r.color === 'red' ? 'red' : r.color === 'blue' ? 'blue' : 'gray'}
                    size="sm"
                    dot
                  >
                    {r.status}
                  </Badge>
                  {r.color === 'red' && (
                    <button
                      onClick={() => onNavigateTab('compliance')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
                    >
                      Fix
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
            <span className="font-medium text-blue-900">
              Autonomous Verification Scan Status:
            </span>
            <span className="font-semibold text-blue-700">
              100% Rules Evaluated against 21 CFR 801, EU MDR Annex I, PMDA 169
            </span>
          </div>
        </div>

        {/* Product Catalog Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Registered Device Lines</h3>
            </div>
            <span className="text-xs text-slate-400">3 Products</span>
          </div>

          <div className="space-y-3">
            {productsData.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-white transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{prod.name}</span>
                  <Badge variant={prod.riskLevel === 'High' ? 'red' : 'blue'} size="sm">
                    {prod.deviceClass.split(' ')[0]} {prod.deviceClass.split(' ')[1]}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500">{prod.description}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 font-mono">
                  <span>Sterilization: {prod.currentSterilization.split(' ')[0]}</span>
                  <span>{prod.totalLabels} Master Labels</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Trail Feed */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Recent Automated Audit & Copilot Operations
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Full 21 CFR Part 11 Audit Log →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>{act.time}</span>
                  <Badge
                    variant={
                      act.type === 'alert' ? 'red' : act.type === 'ai' ? 'blue' : 'gray'
                    }
                    size="sm"
                  >
                    {act.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-slate-800 leading-snug">
                  {act.title}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-mono">
                Actor: {act.actor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

