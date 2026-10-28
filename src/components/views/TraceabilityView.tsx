import React, { useState, useEffect } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Layers,
  ArrowRight,
  Database,
  Building,
} from 'lucide-react';
import { mockTraceabilityService, TraceabilityResult, TraceNode } from '../../services';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface TraceabilityViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({ onNavigateTab }) => {
  const [traceData, setTraceData] = useState<TraceabilityResult | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-LBL-JP');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrace = async () => {
      setIsLoading(true);
      const data = await mockTraceabilityService.getTraceability();
      setTraceData(data);
      setIsLoading(false);
    };
    fetchTrace();
  }, []);

  if (!traceData) return null;

  const selectedNode =
    traceData.nodes.find((n) => n.id === selectedNodeId) || traceData.nodes[0];

  const columns = [
    {
      title: '1. Engineering Requirement',
      type: 'REQUIREMENT',
      icon: Layers,
      nodes: traceData.nodes.filter((n) => n.type === 'REQUIREMENT'),
    },
    {
      title: '2. Design Output Specification',
      type: 'DESIGN_OUTPUT',
      icon: FileText,
      nodes: traceData.nodes.filter((n) => n.type === 'DESIGN_OUTPUT'),
    },
    {
      title: '3. Master UDI DI Record',
      type: 'UDI_RECORD',
      icon: Database,
      nodes: traceData.nodes.filter((n) => n.type === 'UDI_RECORD'),
    },
    {
      title: '4. Packaging Label Artwork',
      type: 'LABEL_ARTWORK',
      icon: ShieldCheck,
      nodes: traceData.nodes.filter((n) => n.type === 'LABEL_ARTWORK'),
    },
    {
      title: '5. Regulatory Submissions',
      type: 'REGULATORY_FILING',
      icon: Building,
      nodes: traceData.nodes.filter((n) => n.type === 'REGULATORY_FILING'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <GitFork className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              End-to-End Regulatory Traceability Matrix
            </h1>
            <Badge variant="blue" size="sm">
              Digital Thread & DHF Ledger
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Product: <strong>{traceData.product}</strong> • Scope: <strong>{traceData.changeOrder}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="green" size="sm" dot>
            Approved / Synced
          </Badge>
          <Badge variant="blue" size="sm" dot>
            Pending Release
          </Badge>
          <Badge variant="red" size="sm" dot>
            Hold / Blocked
          </Badge>
        </div>
      </div>

      {/* Multi-Column Traceability Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {columns.map((col, cIdx) => {
          const Icon = col.icon;
          return (
            <div
              key={cIdx}
              className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex flex-col min-w-[210px] space-y-3"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[11px] font-extrabold uppercase text-slate-700 tracking-wider">
                  {col.title}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {col.nodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  const isBlocked = node.status === 'BLOCKED' || node.status === 'HOLD_COMPLIANCE_FIX';
                  const isApproved = node.status === 'APPROVED' || node.status === 'SYNCED';

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-white ring-2 ring-blue-500 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {node.code}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isBlocked
                              ? 'bg-rose-500'
                              : isApproved
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                        />
                      </div>

                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {node.title}
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono truncate max-w-[110px]">
                          {node.standard}
                        </span>
                        <Badge
                          variant={isBlocked ? 'red' : isApproved ? 'green' : 'blue'}
                          size="sm"
                        >
                          {node.status}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">
                {selectedNode.code}
              </span>
              <Badge
                variant={
                  selectedNode.status.includes('HOLD') || selectedNode.status === 'BLOCKED'
                    ? 'red'
                    : selectedNode.status.includes('APP') || selectedNode.status === 'SYNCED'
                    ? 'green'
                    : 'blue'
                }
                size="sm"
              >
                {selectedNode.status}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {selectedNode.title}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono">Governing Standard:</span>
            <div className="text-xs font-bold text-blue-700 font-mono">
              {selectedNode.standard}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-0.5">DHF Traceability ID:</span>
            <span className="font-mono text-slate-900 font-bold">{selectedNode.id}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-0.5">Cryptographic Hash:</span>
            <span className="font-mono text-slate-900 font-bold truncate block">
              SHA256:4b91...8c3a
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-0.5">Part 11 Audit Status:</span>
            <span className="text-emerald-700 font-bold">✓ Complete Signature Chain</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-slate-500">
            All nodes maintain bi-directional links per FDA 21 CFR 820.30 & EU MDR Article 10.
          </span>
          <button
            onClick={() => onNavigateTab('workflow')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Review Approval Gates →
          </button>
        </div>
      </div>
    </div>
  );
};

