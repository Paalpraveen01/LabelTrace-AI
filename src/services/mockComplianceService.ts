import { complianceIssuesData } from '../mocks';

export interface ComplianceIssue {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  severityColor: 'red' | 'amber' | 'blue';
  title: string;
  market: string;
  productCode: string;
  affectedLabels: string[];
  regulationReference: string;
  description: string;
  currentContent: string;
  requiredContent: string;
  status: 'BLOCKED' | 'REVIEW_REQUIRED' | 'RESOLVED';
  actionRequired: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockComplianceService = {
  async getIssues(filterSeverity?: string): Promise<ComplianceIssue[]> {
    await sleep(550);
    let list = complianceIssuesData as ComplianceIssue[];
    if (filterSeverity && filterSeverity !== 'ALL') {
      list = list.filter((item) => item.severity === filterSeverity);
    }
    return list;
  },

  async resolveIssue(issueId: string): Promise<{ success: boolean; issue: ComplianceIssue }> {
    await sleep(650);
    const issue = (complianceIssuesData as ComplianceIssue[]).find((i) => i.id === issueId);
    if (!issue) {
      throw new Error(`Issue ${issueId} not found`);
    }
    const updated = {
      ...issue,
      status: 'RESOLVED' as const,
      actionRequired: 'Resolved and verified by LabelTrace AI automated compliance check.',
    };
    return {
      success: true,
      issue: updated,
    };
  },
};

