import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Layers,
  FileCheck2,
  GitCompare,
  RotateCcw,
  Globe2,
  Cpu,
  Bookmark,
} from 'lucide-react';
import { mockCopilotService, CopilotResponse } from '../../services';
import { Badge } from '../common/Badge';
import { TabType } from '../common/Header';

interface CopilotChatViewProps {
  onNavigateTab: (tab: TabType) => void;
  triggerDemo?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  data?: CopilotResponse;
}

export const CopilotChatView: React.FC<CopilotChatViewProps> = ({
  onNavigateTab,
  triggerDemo,
}) => {
  const [inputValue, setInputValue] = useState(
    'Update CS-100 sterilization to Gamma Radiation for US, EU and Japan'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Update CS-100 sterilization to Gamma Radiation for US, EU and Japan',
    'Verify Japanese PMDA Kanji warning requirements for primary pouch',
    'Check barcode AI(17) expiration date consistency across cartons',
    'Simulate EU MDR Annex I compliance for secondary packaging',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await mockCopilotService.processQuery(textToSend);
      const botMsg: Message = {
        id: response.id,
        sender: 'assistant',
        timestamp: response.timestamp,
        data: response,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial greeting if empty
  useEffect(() => {
    if (messages.length === 0) {
      // Auto run first query for immediate demo impact
      handleSend('Update CS-100 sterilization to Gamma Radiation for US, EU and Japan');
    }
  }, []);

  // Listen to external triggerDemo
  useEffect(() => {
    if (triggerDemo) {
      handleSend('Update CS-100 sterilization to Gamma Radiation for US, EU and Japan');
    }
  }, [triggerDemo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Labeling Copilot
            </h1>
            <Badge variant="blue" size="sm">
              Model: MedLabel-LLM (Local Guardrailed)
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Autonomous medical device labeling assistant. Evaluates ECO changes against ISO 15223-1, EU MDR, FDA 21 CFR & PMDA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Thread</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area (3 columns) */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm min-h-[640px] overflow-hidden">
          {/* Chat Header Status */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">Copilot Session Active</span>
              <span className="text-slate-400">|</span>
              <span>Context: <strong>Cardiac Stent CS-100</strong> (16 Labels Registered)</span>
            </div>
            <div className="text-slate-400 text-[11px] font-mono">
              Deterministic Mock Engine (0 Network Calls)
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[600px]">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === 'user' ? (
                  // User Message Bubble
                  <div className="flex justify-end">
                    <div className="max-w-2xl bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
                      <div className="text-[11px] text-blue-200 font-medium mb-1 flex items-center justify-between gap-4">
                        <span>Regulatory Affairs Lead</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  // Copilot Structured Response
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>

                    <div className="flex-1 space-y-4 max-w-4xl">
                      {msg.data && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                          {/* 1. Understood Change */}
                          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5">
                            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">
                              <Cpu className="w-4 h-4 text-blue-700" />
                              <span>1. Understood Change</span>
                            </div>
                            <p className="text-sm text-blue-950 font-semibold leading-relaxed">
                              {msg.data.understoodChange}
                            </p>
                          </div>

                          {/* 2. 12 Affected Labels Grid */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                                <Layers className="w-4 h-4 text-blue-600" />
                                <span>2. Affected Labels ({msg.data.affectedLabelsCount} Total Impacted)</span>
                              </div>
                              <span className="text-xs text-slate-500">US (4) • EU (4) • Japan (4)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {msg.data.affectedLabels.map((lbl) => (
                                <div
                                  key={lbl.id}
                                  className="border border-slate-200 bg-white rounded-lg p-2.5 flex items-start justify-between gap-2 shadow-xs hover:border-blue-300 transition-colors"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-slate-800">
                                        {lbl.id}
                                      </span>
                                      <Badge
                                        variant={
                                          lbl.market === 'Japan'
                                            ? 'red'
                                            : lbl.market === 'EU'
                                            ? 'blue'
                                            : 'purple'
                                        }
                                        size="sm"
                                      >
                                        {lbl.market}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                                      {lbl.packageLevel}
                                    </div>
                                    <div className="text-[11px] text-amber-700 font-mono mt-1">
                                      → {lbl.changeRequired}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Affected Markets & Languages */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3.5 border border-slate-200 rounded-lg">
                            <div>
                              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>3A. Affected Jurisdictions</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.data.affectedMarkets.map((mkt, idx) => (
                                  <Badge key={idx} variant="blue" size="sm">
                                    {mkt}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                                <span>3B. Language Translations Required</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.data.affectedLanguages.map((lang, idx) => (
                                  <Badge key={idx} variant="gray" size="sm">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 4. Required Actions Checklist */}
                          <div>
                            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>4. Required Actions Execution Plan</span>
                            </div>
                            <ul className="space-y-1.5">
                              {msg.data.requiredActions.map((action, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/50 p-2 rounded border border-emerald-100"
                                >
                                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 5. Identified Risks (Missing Japanese warning & UDI/barcode mismatch) */}
                          <div>
                            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>5. Critical Regulatory Risks & Compliance Hazards</span>
                            </div>
                            <div className="space-y-2">
                              {msg.data.risks.map((risk, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg border ${
                                    risk.severity === 'critical'
                                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                                      : 'bg-amber-50 border-amber-300 text-amber-950'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase ${
                                          risk.severity === 'critical'
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-amber-600 text-white'
                                        }`}
                                      >
                                        {risk.severity === 'critical' ? 'CRITICAL BLOCKER' : 'WARNING'}
                                      </span>
                                      <span className="text-xs font-bold">{risk.title}</span>
                                    </div>
                                    <span className="text-[11px] font-mono opacity-80">
                                      {risk.regulation}
                                    </span>
                                  </div>
                                  <p className="text-xs leading-relaxed opacity-90 mt-1">
                                    {risk.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 6. Recommended Next Step & Interactive Jump Buttons */}
                          <div className="bg-indigo-50/80 border border-indigo-200 rounded-lg p-4">
                            <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <ArrowRight className="w-4 h-4 text-indigo-700" />
                              <span>6. Recommended Next Step</span>
                            </div>
                            <p className="text-xs text-indigo-950 font-medium leading-relaxed mb-3">
                              {msg.data.recommendedNextStep}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-indigo-200/80">
                              <button
                                onClick={() => onNavigateTab('drafts')}
                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xs transition-colors"
                              >
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>Open Label Draft Generator</span>
                              </button>
                              <button
                                onClick={() => onNavigateTab('compliance')}
                                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xs transition-colors"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Inspect 2 Compliance Blockers</span>
                              </button>
                              <button
                                onClick={() => onNavigateTab('diff')}
                                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xs transition-colors"
                              >
                                <GitCompare className="w-3.5 h-3.5" />
                                <span>View Artwork Diff</span>
                              </button>
                            </div>
                          </div>

                          {/* 7. Source Citations */}
                          <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                              <span>7. Source Citations & Regulatory References</span>
                            </div>
                            <div className="space-y-1.5">
                              {msg.data.sourceCitations.map((cite, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs text-slate-700 flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-none"
                                >
                                  <div>
                                    <span className="font-semibold text-slate-900">{cite.title}</span>
                                    <span className="text-slate-500 ml-1">({cite.source})</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                                    {cite.section}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 8. Mandatory Warning Callout */}
                          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                              8. Warning: {msg.data.warningNotice}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 text-xs text-slate-600">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Evaluating 12 labels against ISO 15223-1, EU MDR & PMDA rules...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Pills */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Suggested:
            </span>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(prompt);
                  handleSend(prompt);
                }}
                className="text-xs text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Copilot, e.g. Update CS-100 sterilization to Gamma Radiation for US, EU and Japan..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Copilot</span>
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Context & Live Guardrails (1 column) */}
        <div className="space-y-4">
          {/* Active ECO Status Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Change Order
              </span>
              <Badge variant="amber" size="sm">
                Under Review
              </Badge>
            </div>
            <div className="font-bold text-slate-900 text-sm">ECO-2026-089</div>
            <p className="text-xs text-slate-600 mt-1">
              Transition from Ethylene Oxide to Gamma Radiation sterilization.
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Device Class:</span>
                <span className="font-medium text-slate-800">Class III (PMA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Impacted Labels:</span>
                <span className="font-bold text-blue-700">12 of 16 SKUs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Workflow Gate:</span>
                <span className="font-semibold text-amber-700">REGULATORY_REVIEW</span>
              </div>
            </div>
          </div>

          {/* Quick Compliance Alerts Card */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Active Gate Blockers</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed mb-3">
              2 critical regulatory violations prevent release of Japanese packaging components:
            </p>
            <ul className="text-xs space-y-2">
              <li className="bg-white p-2 rounded border border-rose-200 font-medium text-rose-950 flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">1.</span>
                <span>Missing Japanese Kanji caution '再滅菌禁止' on Pouch & Carton.</span>
              </li>
              <li className="bg-white p-2 rounded border border-rose-200 font-medium text-rose-950 flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">2.</span>
                <span>GS1 DataMatrix AI(17) barcode expiration mismatch on Carton.</span>
              </li>
            </ul>
            <button
              onClick={() => onNavigateTab('compliance')}
              className="mt-3 w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow-xs transition-colors"
            >
              Resolve In Compliance View →
            </button>
          </div>

          {/* Regulatory Standards Knowledge Base */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Loaded Regulatory Schemas</span>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">ISO 15223-1:2021</div>
                <div className="text-[11px] text-slate-500">Medical devices — Symbols to be used with labels</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">FDA 21 CFR 801 / 830</div>
                <div className="text-[11px] text-slate-500">Unique Device Identification & General Labeling</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">EU MDR 2017/745 Annex I</div>
                <div className="text-[11px] text-slate-500">Chapter III Section 23 Label & IFU Requirements</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">PMDA / MHLW 169</div>
                <div className="text-[11px] text-slate-500">Japanese Pharmaceutical & Medical Device Act</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

