import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { mockApprovalWorkflowService, WorkflowState, WorkflowStep } from '../../services';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface ApprovalWorkflowViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const ApprovalWorkflowView: React.FC<ApprovalWorkflowViewProps> = ({ onNavigateTab }) => {
  const [workflow, setWorkflow] = useState<WorkflowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await mockApprovalWorkflowService.getWorkflow();
      setWorkflow(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleAdvance = async () => {
    if (!workflow) return;
    setIsLoading(true);
    const updated = await mockApprovalWorkflowService.advanceWorkflow(
      workflow.currentStatus,
      'Dr. Marcus Vance',
      'Approved after reviewing all compliance resolutions and artwork diffs.'
    );
    setWorkflow(updated);
    setActionMsg(`Workflow advanced to ${updated.currentStatus}`);
    setIsLoading(false);
    setTimeout(() => setActionMsg(null), 3000);
  };

  const handleBlock = async () => {
    if (!workflow) return;
    setIsLoading(true);
    const updated = await mockApprovalWorkflowService.blockWorkflow(
      'Unresolved critical compliance issue on Japan packaging.'
    );
    setWorkflow(updated);
    setActionMsg('Workflow BLOCKED — gate enforced');
    setIsLoading(false);
    setTimeout(() => setActionMsg(null), 3000);
  };

  const handleReset = async () => {
    setIsLoading(true);
    const updated = await mockApprovalWorkflowService.resetWorkflow();
    setWorkflow(updated);
    setActionMsg('Workflow reset to initial state');
    setIsLoading(false);
    setTimeout(() => setActionMsg(null), 3000);
  };

  if (!workflow) return null;

  const stepIcons: Record<string, React.ReactNode> = {
    COMPLETED: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    IN_PROGRESS: <Clock className="w-5 h-5 text-blue-600 animate-pulse" />,
    PENDING: <Lock className="w-5 h-5 text-slate-400" />,
    GATE_DECISION: <ShieldCheck className="w-5 h-5 text-amber-600" />,
    BLOCKED: <XCircle className="w-5 h-5 text-rose-600" />,
  };

  const stepColors: Record<string, string> = {
    COMPLETED: 'border-emerald-500 bg-emerald-50/60',
    IN_PROGRESS: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-400',
    PENDING: 'border-slate-300 bg-slate-50/60',
    GATE_DECISION: 'border-amber-400 bg-amber-50/40',
    BLOCKED: 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400',
  };

  const isBlocked = workflow.currentStatus === 'BLOCKED';
  const isReleased = workflow.currentStatus === 'RELEASED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Approval Workflow Pipeline
            </h1>
            <Badge
              variant={isBlocked ? 'red' : isReleased ? 'green' : 'amber'}
              size="sm"
              dot
            >
              {workflow.currentStatus.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Change Order: <strong>{workflow.changeOrderId}</strong> • {workflow.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pipeline</span>
          </button>

          {!isReleased && !isBlocked && (
            <>
              <button
                onClick={handleBlock}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Block Release</span>
              </button>

              <button
                onClick={handleAdvance}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Advance Gate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Visual Pipeline Stepper */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {/* Horizontal Progress Bar */}
        <div className="flex items-center gap-0 overflow-x-auto pb-2 mb-6">
          {workflow.workflowSteps.map((step, idx) => {
            const isLast = idx === workflow.workflowSteps.length - 1;
            return (
              <React.Fragment key={step.step}>
                <div className="flex flex-col items-center min-w-[100px] relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${
                      step.status === 'COMPLETED'
                        ? 'border-emerald-500 bg-emerald-100'
                        : step.status === 'IN_PROGRESS'
                        ? 'border-blue-500 bg-blue-100 ring-4 ring-blue-100'
                        : step.status === 'BLOCKED'
                        ? 'border-rose-500 bg-rose-100'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  >
                    {stepIcons[step.status] || stepIcons['PENDING']}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mt-2 text-center leading-tight ${
                      step.status === 'COMPLETED'
                        ? 'text-emerald-700'
                        : step.status === 'IN_PROGRESS'
                        ? 'text-blue-700'
                        : step.status === 'BLOCKED'
                        ? 'text-rose-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.step.replace(/_/g, ' ')}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex-1 min-w-[40px] h-0.5 relative mx-1 mt-[-20px]">
                    <div className="absolute inset-0 bg-slate-200 rounded" />
                    <div
                      className={`absolute inset-y-0 left-0 rounded transition-all duration-500 ${
                        step.status === 'COMPLETED'
                          ? 'bg-emerald-500 w-full'
                          : step.status === 'IN_PROGRESS'
                          ? 'bg-blue-500 w-1/2'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Detailed Step Cards */}
        <div className="space-y-3">
          {workflow.workflowSteps.map((step) => (
            <div
              key={step.step}
              className={`border rounded-xl p-4 transition-all ${stepColors[step.status]}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{stepIcons[step.status]}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{step.name}</span>
                      <Badge
                        variant={
                          step.status === 'COMPLETED'
                            ? 'green'
                            : step.status === 'IN_PROGRESS'
                            ? 'blue'
                            : step.status === 'BLOCKED'
                            ? 'red'
                            : 'gray'
                        }
                        size="sm"
                      >
                        {step.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                      {step.comments}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{step.owner}</span>
                  </div>
                  {step.timestamp && (
                    <div className="text-[11px] text-slate-400 font-mono">{step.timestamp}</div>
                  )}
                  {step.signature && (
                    <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {step.signature}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail History */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Workflow Audit History (21 CFR Part 11 Timestamped)
          </h3>
          <button
            onClick={() => onNavigateTab('audit')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Full Audit Package →
          </button>
        </div>

        <div className="space-y-2">
          {workflow.history.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50/60 rounded-lg border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                  {workflow.history.length - idx}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{entry.action}</span>
                  <span className="text-slate-400 ml-2">by {entry.by} ({entry.role})</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    entry.status === 'BLOCKED'
                      ? 'red'
                      : entry.status.includes('REVIEW')
                      ? 'amber'
                      : entry.status === 'RELEASED'
                      ? 'green'
                      : 'blue'
                  }
                  size="sm"
                >
                  {entry.status}
                </Badge>
                <span className="font-mono text-[11px] text-slate-400">{entry.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

