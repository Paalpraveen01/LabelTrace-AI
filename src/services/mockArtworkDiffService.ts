import { artworkDiffData } from '../mocks';

export interface ArtworkDiffResult {
  labelId: string;
  labelName: string;
  versionBefore: string;
  versionAfter: string;
  diffSummary: {
    totalChanges: number;
    criticalIssues: number;
    warnings: number;
    pixelDiffPercentage: string;
  };
  changes: {
    id: string;
    category: string;
    title: string;
    type: 'changed barcode' | 'missing symbol' | 'layout shift';
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    severityColor: 'red' | 'amber' | 'blue';
    boundingBox: { x: number; y: number; width: number; height: number };
    before: {
      text?: string;
      humanReadable?: string;
      barcodeSvgType?: string;
      symbolCode?: string;
      symbolStandard?: string;
      presence?: string;
      layoutState?: string;
      fontSize?: string;
      textBlocks?: number;
      description: string;
    };
    after: {
      text?: string;
      humanReadable?: string;
      barcodeSvgType?: string;
      symbolCode?: string;
      symbolStandard?: string;
      presence?: string;
      layoutState?: string;
      fontSize?: string;
      textBlocks?: number;
      description: string;
    };
    validationNote: string;
  }[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockArtworkDiffService = {
  async getDiff(labelId: string = 'LBL-CS100-JP-C10'): Promise<ArtworkDiffResult> {
    await sleep(750);
    return artworkDiffData as ArtworkDiffResult;
  },
};

