import React, { useState, useCallback } from 'react';
import { Header, TabType } from './components/common/Header';
import { CopilotChatView } from './components/views/CopilotChatView';
import { DashboardKPIsView } from './components/views/DashboardKPIsView';
import { ChangeImpactSimulatorView } from './components/views/ChangeImpactSimulatorView';
import { LabelDraftGeneratorView } from './components/views/LabelDraftGeneratorView';
import { ComplianceValidationView } from './components/views/ComplianceValidationView';
import { ArtworkDiffViewerView } from './components/views/ArtworkDiffViewerView';
import { TraceabilityView } from './components/views/TraceabilityView';
import { ApprovalWorkflowView } from './components/views/ApprovalWorkflowView';
import { AuditPackageView } from './components/views/AuditPackageView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('copilot');
  const [selectedProduct, setSelectedProduct] = useState('CS-100');
  const [demoTrigger, setDemoTrigger] = useState(false);

  const handleNavigateTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRunDemoScenario = useCallback(() => {
    setActiveTab('copilot');
    setSelectedProduct('CS-100');
    setDemoTrigger((prev) => !prev);
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'copilot':
        return (
          <CopilotChatView
            onNavigateTab={handleNavigateTab}
            triggerDemo={demoTrigger}
          />
        );
      case 'kpis':
        return <DashboardKPIsView onNavigateTab={handleNavigateTab} />;
      case 'impact':
        return (
          <ChangeImpactSimulatorView
            onNavigateTab={handleNavigateTab}
            selectedProduct={selectedProduct}
          />
        );
      case 'drafts':
        return <LabelDraftGeneratorView onNavigateTab={handleNavigateTab} />;
      case 'compliance':
        return <ComplianceValidationView onNavigateTab={handleNavigateTab} />;
      case 'diff':
        return <ArtworkDiffViewerView onNavigateTab={handleNavigateTab} />;
      case 'traceability':
        return <TraceabilityView onNavigateTab={handleNavigateTab} />;
      case 'workflow':
        return <ApprovalWorkflowView onNavigateTab={handleNavigateTab} />;
      case 'audit':
        return <AuditPackageView onNavigateTab={handleNavigateTab} />;
      default:
        return <CopilotChatView onNavigateTab={handleNavigateTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        onRunDemoScenario={handleRunDemoScenario}
      />
      <main className="pb-12">{renderView()}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">LabelTrace AI</span>
            <span>•</span>
            <span>Frontend-Only Clickable Prototype</span>
            <span>•</span>
            <span>All data is local mock data — no real backend or LLM</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Build: PROTO-2026.10.28 | React + Vite + Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

