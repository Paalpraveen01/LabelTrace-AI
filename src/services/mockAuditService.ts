import { auditTrailData } from '../mocks';

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  checksum: string;
}

export interface AuditPackage {
  packageId: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  scope: {
    product: string;
    ecoNumber: string;
    markets: string[];
    totalAffectedLabels: number;
    hashAlgorithm: string;
    systemIntegrityHash: string;
  };
  regulatoryComplianceStatement: string;
  events: AuditEvent[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuditService = {
  async getAuditPackage(): Promise<AuditPackage> {
    await sleep(500);
    return auditTrailData as AuditPackage;
  },

  downloadAuditJSON(data: AuditPackage) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.packageId}_21CFRPart11_Package.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  printAuditReport() {
    window.print();
  },
};

