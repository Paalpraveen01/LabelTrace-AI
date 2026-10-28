import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { mockComplianceService, ComplianceIssue } from '../../services';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface ComplianceValidationViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const ComplianceValidationView: React.FC<ComplianceValidationViewProps> = ({
  onNavigateTab,
}) => {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      const data = await mockComplianceService.getIssues(filter);
      setIssues(data);
      setIsLoading(false);
    };
    fetchIssues();
  }, [filter]);

  const handleResolve = async (issueId: string) => {
    setResolvingId(issueId);
    try {
      const res = await mockComplianceService.resolveIssue(issueId);
      setIssues((prev) =>
        prev.map((item) => (item.id === issueId ? res.issue : item))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  };

  const criticalCount = issues.filter(
    (i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED'
  ).length;
  const warningCount = issues.filter(
    (i) => i.severity === 'WARNING' && i.status !== 'RESOLVED'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Compliance & Safety Validation
            </h1>
            <Badge variant={criticalCount > 0 ? 'red' : 'green'} size="sm">
              {criticalCount > 0 ? `${criticalCount} Critical Blockers` : 'All Checks Passed'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Automated verification against FDA 21 CFR 801/830, EU MDR Annex I §23, PMD Act Ordinance 169, and ISO 15223-1.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARNING'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                filter === sev
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {sev === 'ALL'
                ? `All Issues (${issues.length})`
                : sev === 'CRITICAL'
                ? `Critical (${criticalCount})`
                : `Warnings (${warningCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Notice */}
      {criticalCount > 0 ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm">
                Regulatory Release Gate: BLOCKED (2 Critical Non-Conformances)
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                Japan packaging artwork cannot proceed to manufacturing line or PMDA minor change submission until these non-conformances are cleared.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('drafts')}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <span>Auto-Remediate in Drafts →</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-emerald-950">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="font-bold text-sm">All Compliance Non-Conformances Resolved</div>
            <p className="text-xs text-emerald-800 mt-0.5">
              Artwork packages meet all international standards and are ready for Quality & Regulatory signoff.
            </p>
          </div>
        </div>
      )}

      {/* 3 Hardcoded Compliance Issues Grid */}
      <div className="space-y-4">
        {issues.map((issue) => {
          const isCritical = issue.severity === 'CRITICAL';
          const isResolved = issue.status === 'RESOLVED';
          const isBusy = resolvingId === issue.id;

          return (
            <div
              key={issue.id}
              className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                isResolved
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isCritical
                  ? 'border-rose-300 ring-1 ring-rose-300'
                  : 'border-amber-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{issue.id}</span>
                    <Badge
                      variant={isResolved ? 'green' : isCritical ? 'red' : 'amber'}
                      size="sm"
                      dot
                    >
                      {isResolved
                        ? 'RESOLVED'
                        : isCritical
                        ? 'CRITICAL BLOCKER'
                        : 'REVIEW REQUIRED'}
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {issue.market}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400">
                      Product: {issue.productCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {issue.title}
                  </h3>
                </div>

                {/* Action button */}
                <div>
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Compliant</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolve(issue.id)}
                      disabled={isBusy}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all ${
                        isCritical
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                      <span>{isBusy ? 'Executing Fix...' : 'Auto-Remediate Issue'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description & Citations */}
              <div className="py-3 text-xs space-y-3">
                <p className="text-slate-700 leading-relaxed font-normal">
                  {issue.description}
                </p>

                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Regulatory Mandate:</span>
                  <span className="font-mono text-blue-700">{issue.regulationReference}</span>
                </div>

                {/* Side-by-side Current vs Required */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                      Current Non-Conformant Content:
                    </div>
                    <div className="text-xs font-mono text-rose-950 font-medium">
                      {issue.currentContent}
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      Required ISO / PMDA Content:
                    </div>
                    <div className="text-xs font-mono text-emerald-950 font-medium">
                      {issue.requiredContent}
                    </div>
                  </div>
                </div>

                {/* Affected Components */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-semibold">Affected Artwork SKUs:</span>
                  {issue.affectedLabels.map((lbl, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[11px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Required Footer */}
              <div className="pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">Remediation:</span>
                  <span>{issue.actionRequired}</span>
                </div>
                <button
                  onClick={() => onNavigateTab('diff')}
                  className="text-blue-600 hover:text-blue-800 font-semibold shrink-0 ml-2"
                >
                  View Diff →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

