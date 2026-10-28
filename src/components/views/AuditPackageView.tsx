import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Clock,
  User,
  Hash,
  Globe2,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { mockAuditService, AuditPackage } from '../../services';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface AuditPackageViewProps {
  onNavigateTab: (tab: TabType) => void;
}

export const AuditPackageView: React.FC<AuditPackageViewProps> = ({ onNavigateTab }) => {
  const [auditData, setAuditData] = useState<AuditPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await mockAuditService.getAuditPackage();
      setAuditData(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  if (!auditData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              21 CFR Part 11 Audit Package
            </h1>
            <Badge variant="green" size="sm" dot>
              Cryptographically Sealed
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Package: <strong>{auditData.packageId}</strong> • Generated: {new Date(auditData.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => mockAuditService.downloadAuditJSON(auditData)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Package</span>
          </button>
          <button
            onClick={() => mockAuditService.printAuditReport()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Package Metadata Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-xs text-blue-300 font-bold uppercase tracking-wider mb-3">
          <Lock className="w-4 h-4" />
          <span>Regulatory Compliance Statement & Package Integrity</span>
        </div>

        <h2 className="text-lg font-bold tracking-tight mb-2">{auditData.title}</h2>

        <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-4xl">
          {auditData.regulatoryComplianceStatement}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 border border-white/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Target Product</span>
            </div>
            <div className="text-sm font-bold text-white">{auditData.scope.product}</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-semibold">
              <Hash className="w-3.5 h-3.5" />
              <span>Change Order Scope</span>
            </div>
            <div className="text-sm font-bold text-white">{auditData.scope.ecoNumber}</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-semibold">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Jurisdictions</span>
            </div>
            <div className="text-sm font-bold text-white">
              {auditData.scope.markets.join(' • ')}
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Integrity Hash ({auditData.scope.hashAlgorithm})</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 truncate">
              {auditData.scope.systemIntegrityHash}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Event Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Chronological Audit Event Log ({auditData.events.length} Events)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditData.scope.totalAffectedLabels} Labels Tracked
          </span>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-1">
            {auditData.events.map((event, idx) => {
              const isAI = event.user.includes('AI');
              const isFlag = event.action.includes('FLAG') || event.action.includes('HOLD');

              return (
                <div key={event.id} className="relative pl-14 pb-6 group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[16px] w-[15px] h-[15px] rounded-full border-2 z-10 ${
                      isFlag
                        ? 'bg-rose-500 border-rose-300'
                        : isAI
                        ? 'bg-blue-500 border-blue-300'
                        : 'bg-emerald-500 border-emerald-300'
                    }`}
                  />

                  <div className="bg-slate-50/70 hover:bg-white border border-slate-200 rounded-xl p-4 transition-all shadow-2xs group-hover:shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {event.id}
                          </span>
                          <Badge
                            variant={isFlag ? 'red' : isAI ? 'blue' : 'green'}
                            size="sm"
                          >
                            {event.action.replace(/_/g, ' ')}
                          </Badge>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900">
                          Target: {event.target}
                        </h4>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {event.details}
                        </p>
                      </div>

                      <div className="shrink-0 text-right space-y-1.5 min-w-[200px]">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          {isAI ? (
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                            {event.user}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">{event.role}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {event.timestamp}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 inline-block px-2 py-0.5 rounded">
                          IP: {event.ipAddress}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700">
                          SHA: {event.checksum}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Certification Statement */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Electronic Record & Signature Certification</span>
        </div>
        <p className="leading-relaxed">
          This audit package has been generated and cryptographically sealed by the LabelTrace AI
          regulatory compliance engine. All events are timestamped, attributed, and integrity-checked
          per US FDA 21 CFR Part 11 for electronic records and electronic signatures, EU GMP Annex 11,
          and PMDA ministerial ordinance requirements for digital quality management systems.
        </p>
        <p className="font-mono text-[11px] text-slate-400">
          Package Hash: {auditData.scope.systemIntegrityHash} • Generator: {auditData.generatedBy}
        </p>
      </div>
    </div>
  );
};

