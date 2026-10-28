import { labelsData } from '../mocks';

export interface LabelDraft {
  labelId: string;
  productCode: string;
  market: string;
  packageLevel: string;
  versionBefore: string;
  versionAfter: string;
  status: 'DRAFT' | 'APPLIED' | 'READY_FOR_APPROVAL';
  sterilizationBefore: string;
  sterilizationAfter: string;
  symbolBefore: string;
  symbolAfter: string;
  udiDIBefore: string;
  udiDIAfter: string;
  udiPIBefore: string;
  udiPIAfter: string;
  barcodeStatus: 'OK' | 'DISCREPANCY_RESOLVED';
  japaneseWarningText?: string;
  appliedFixes: string[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLabelDraftService = {
  async getDrafts(): Promise<LabelDraft[]> {
    await sleep(600);
    return labelsData
      .filter((l) => l.affectedBySterilizationChange)
      .map((l) => ({
        labelId: l.id,
        productCode: l.productCode,
        market: l.market,
        packageLevel: l.packageLevel,
        versionBefore: l.currentVersion,
        versionAfter: l.draftVersion,
        status: l.id === 'LBL-CS100-JP-P09' || l.id === 'LBL-CS100-JP-C10' ? 'DRAFT' : 'READY_FOR_APPROVAL',
        sterilizationBefore: 'STERILE EO',
        sterilizationAfter: 'STERILE R',
        symbolBefore: 'ISO 15223-1 5.2.3',
        symbolAfter: 'ISO 15223-1 5.2.4',
        udiDIBefore: l.udiDI,
        udiDIAfter: l.udiDI,
        udiPIBefore: l.udiPI,
        udiPIAfter: l.id === 'LBL-CS100-JP-C10' ? '(17)290831(10)LOT-2026A(21)SN-99412 [SYNCED]' : l.udiPI,
        barcodeStatus: l.id === 'LBL-CS100-JP-C10' ? 'DISCREPANCY_RESOLVED' : 'OK',
        japaneseWarningText: l.market === 'Japan' ? '【警告】再滅菌禁止。本品は単回使用であり、再滅菌及び再使用は厳重に禁じられています。' : undefined,
        appliedFixes: [
          'Sterilization symbol migrated from STERILE EO to STERILE R (ISO 15223-1 #5.2.4)',
          ...(l.market === 'Japan' ? ['Japanese MHLW 169 warning banner injected (再滅菌禁止)', 'GS1 DataMatrix AI(17) barcode synced with human-readable date 2029-08-31'] : []),
        ],
      }));
  },

  async applyAutoFix(labelId: string, fixType: 'japanese_warning' | 'barcode_sync' | 'symbol_update'): Promise<{ success: boolean; message: string }> {
    await sleep(700);
    return {
      success: true,
      message: `Successfully applied fix [${fixType}] to artwork layer of ${labelId}. Verification hash updated.`,
    };
  },
};

