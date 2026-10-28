import { approvalsData } from '../mocks';

export interface WorkflowStep {
  step: 'DRAFT' | 'AI_VALIDATED' | 'REGULATORY_REVIEW' | 'QA_REVIEW' | 'MANUFACTURING_REVIEW' | 'RELEASED' | 'BLOCKED';
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'GATE_DECISION' | 'BLOCKED';
  owner: string;
  timestamp: string | null;
  comments: string;
  signature: string | null;
}

export interface WorkflowState {
  changeOrderId: string;
  title: string;
  product: string;
  currentStatus: 'DRAFT' | 'AI_VALIDATED' | 'REGULATORY_REVIEW' | 'QA_REVIEW' | 'MANUFACTURING_REVIEW' | 'RELEASED' | 'BLOCKED';
  workflowSteps: WorkflowStep[];
  history: {
    action: string;
    by: string;
    role: string;
    date: string;
    status: string;
  }[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep in-memory state for prototype interactivity
let currentState: WorkflowState = JSON.parse(JSON.stringify(approvalsData));

export const mockApprovalWorkflowService = {
  async getWorkflow(): Promise<WorkflowState> {
    await sleep(500);
    return JSON.parse(JSON.stringify(currentState));
  },

  async advanceWorkflow(stepName: string, approver: string, comments: string): Promise<WorkflowState> {
    await sleep(750);
    const steps: WorkflowStep['step'][] = [
      'DRAFT',
      'AI_VALIDATED',
      'REGULATORY_REVIEW',
      'QA_REVIEW',
      'MANUFACTURING_REVIEW',
      'RELEASED',
    ];

    const currentIndex = steps.indexOf(currentState.currentStatus as any);
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      
      // Update current step to completed
      const stepObj = currentState.workflowSteps.find((s) => s.step === currentState.currentStatus);
      if (stepObj) {
        stepObj.status = 'COMPLETED';
        stepObj.comments = comments || stepObj.comments;
        stepObj.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        stepObj.signature = `SHA256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)} [21 CFR Part 11 Validated]`;
      }

      // Update next step to in progress
      const nextStepObj = currentState.workflowSteps.find((s) => s.step === nextStep);
      if (nextStepObj) {
        nextStepObj.status = nextStep === 'RELEASED' ? 'COMPLETED' : 'IN_PROGRESS';
        nextStepObj.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      }

      currentState.currentStatus = nextStep;
      currentState.history.unshift({
        action: `Advanced to ${nextStep}`,
        by: approver || 'Current User',
        role: 'Authorized Regulatory Signatory',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: nextStep,
      });
    }

    return JSON.parse(JSON.stringify(currentState));
  },

  async resetWorkflow(): Promise<WorkflowState> {
    await sleep(400);
    currentState = JSON.parse(JSON.stringify(approvalsData));
    return JSON.parse(JSON.stringify(currentState));
  },

  async blockWorkflow(reason: string): Promise<WorkflowState> {
    await sleep(600);
    currentState.currentStatus = 'BLOCKED';
    currentState.history.unshift({
      action: 'Change Order Gated: BLOCKED',
      by: 'Compliance Safety Guardrail',
      role: 'Automated Enforcement',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'BLOCKED',
    });
    return JSON.parse(JSON.stringify(currentState));
  },
};

