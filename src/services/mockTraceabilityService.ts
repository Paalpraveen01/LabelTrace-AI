import { traceabilityData } from '../mocks';

export interface TraceNode {
  id: string;
  type: 'REQUIREMENT' | 'DESIGN_OUTPUT' | 'UDI_RECORD' | 'LABEL_ARTWORK' | 'REGULATORY_FILING';
  code: string;
  title: string;
  standard: string;
  status: 'APPROVED' | 'SYNCED' | 'PENDING_RELEASE' | 'BLOCKED' | 'READY_TO_SUBMIT' | 'HOLD_COMPLIANCE_FIX';
}

export interface TraceLink {
  source: string;
  target: string;
  relation: string;
}

export interface TraceabilityResult {
  product: string;
  changeOrder: string;
  nodes: TraceNode[];
  links: TraceLink[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockTraceabilityService = {
  async getTraceability(): Promise<TraceabilityResult> {
    await sleep(600);
    return traceabilityData as TraceabilityResult;
  },
};

