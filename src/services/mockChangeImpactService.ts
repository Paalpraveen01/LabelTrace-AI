import { labelsData, productsData, marketsData } from '../mocks';

export interface ImpactFilterParams {
  productCode: string;
  changeType: string;
  markets: string[];
}

export interface ImpactSummaryResult {
  productCode: string;
  productName: string;
  changeType: string;
  proposedSterilization: string;
  totalLabelsScanned: number;
  totalLabelsImpacted: number;
  marketsImpacted: string[];
  packagingTiersImpacted: {
    level: string;
    count: number;
    labels: string[];
  }[];
  symbolReplacements: {
    oldSymbol: string;
    newSymbol: string;
    clause: string;
    count: number;
  }[];
  affectedLabels: typeof labelsData;
  regulatoryRiskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedTimeToUpdateManual: string;
  estimatedTimeToUpdateAI: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockChangeImpactService = {
  async getImpactAnalysis(params?: Partial<ImpactFilterParams>): Promise<ImpactSummaryResult> {
    await sleep(650);

    const productCode = params?.productCode || 'CS-100';
    const product = productsData.find((p) => p.code === productCode) || productsData[0];

    const affectedLabels = labelsData.filter(
      (l) => l.productCode === productCode && l.affectedBySterilizationChange
    );

    return {
      productCode: product.code,
      productName: product.name,
      changeType: "Sterilization Modality: Ethylene Oxide to Gamma Radiation",
      proposedSterilization: "Gamma Radiation (ISO 11137-1)",
      totalLabelsScanned: 16,
      totalLabelsImpacted: 12,
      marketsImpacted: ["United States", "European Union", "Japan"],
      packagingTiersImpacted: [
        {
          level: "Primary Sterile Pouch (Tyvek)",
          count: 3,
          labels: ["LBL-CS100-US-P01", "LBL-CS100-EU-P05", "LBL-CS100-JP-P09"],
        },
        {
          level: "Secondary Folding Carton",
          count: 3,
          labels: ["LBL-CS100-US-C02", "LBL-CS100-EU-C06", "LBL-CS100-JP-C10"],
        },
        {
          level: "Shipper Case (Corrugated)",
          count: 3,
          labels: ["LBL-CS100-US-S03", "LBL-CS100-EU-S07", "LBL-CS100-JP-S11"],
        },
        {
          level: "Instructions for Use (IFU) / Insert",
          count: 3,
          labels: ["LBL-CS100-US-I04", "LBL-CS100-EU-I08", "LBL-CS100-JP-I12"],
        },
      ],
      symbolReplacements: [
        {
          oldSymbol: "STERILE EO (ISO 15223-1 #5.2.3)",
          newSymbol: "STERILE R (ISO 15223-1 #5.2.4)",
          clause: "5.2.4",
          count: 12,
        },
      ],
      affectedLabels,
      regulatoryRiskLevel: "HIGH",
      estimatedTimeToUpdateManual: "38 Business Days",
      estimatedTimeToUpdateAI: "12 Seconds (Staged for Review)",
    };
  },
};

