import { labelsData } from '../mocks';

export interface CopilotCitation {
  title: string;
  source: string;
  section: string;
  type: 'standard' | 'regulation' | 'internal';
}

export interface CopilotResponse {
  id: string;
  timestamp: string;
  understoodChange: string;
  affectedLabelsCount: number;
  affectedLabels: {
    id: string;
    productName: string;
    market: string;
    packageLevel: string;
    changeRequired: string;
  }[];
  affectedMarkets: string[];
  affectedLanguages: string[];
  requiredActions: string[];
  risks: {
    severity: 'critical' | 'warning';
    title: string;
    description: string;
    regulation: string;
  }[];
  recommendedNextStep: string;
  sourceCitations: CopilotCitation[];
  warningNotice: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockCopilotService = {
  async processQuery(query: string): Promise<CopilotResponse> {
    // 500 - 900 ms delay to simulate realistic AI inference & RAG query
    await sleep(750);

    const lowerQuery = query.toLowerCase();

    // Default canonical scenario or query-matched scenario
    const affected12 = labelsData.filter((l) => l.productCode === 'CS-100' && l.affectedBySterilizationChange);

    return {
      id: `COPILOT-RESP-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      understoodChange: "Change terminal sterilization modality from Ethylene Oxide (EO) to Gamma Radiation (R) for product Cardiac Stent CS-100 across US, EU, and Japan regulatory scopes.",
      affectedLabelsCount: 12,
      affectedLabels: affected12.map((l) => ({
        id: l.id,
        productName: l.productName,
        market: l.market,
        packageLevel: l.packageLevel,
        changeRequired: l.requiredSymbolChanges,
      })),
      affectedMarkets: ["United States (FDA)", "European Union (EMA / TÜV SÜD)", "Japan (PMDA / MHLW)"],
      affectedLanguages: [
        "English (US / EU)",
        "German (EU MDR Annex I)",
        "French (EU MDR)",
        "Italian (EU MDR)",
        "Spanish (EU MDR)",
        "Dutch (EU MDR)",
        "Japanese (Kanji / PMD Act compliant)",
      ],
      requiredActions: [
        "Replace ISO 15223-1 Symbol 5.2.3 [STERILE EO] with Symbol 5.2.4 [STERILE R] on all 12 primary, secondary, shipper, and IFU components.",
        "Validate packaging polymer barrier compatibility (Tyvek 1073B + foil laminate) under 25–40 kGy Gamma dosage (ISO 11137-1).",
        "Add mandatory Japanese PMD Act caution statement '再滅菌禁止' (Do not re-sterilize) to Japan Primary Pouch and Secondary Carton artwork.",
        "Synchronize Japanese Secondary Carton GS1 DataMatrix AI(17) expiry code with human-readable date (fix 1-month discrepancy).",
        "Generate 30-Day Notice / PMA supplement filing for FDA and Minor Change Notification (軽微変更届) for Japan PMDA.",
      ],
      risks: [
        {
          severity: "critical",
          title: "Missing Japanese Warning (再滅菌禁止)",
          description: "PMDA MHLW Ordinance No. 169 Article 63-2 requires explicit Japanese warning text against re-sterilization on cardiovascular single-use devices. Omission will trigger customs detention and PMDA rejection.",
          regulation: "Japan PMD Act / PMDA Notification Yakushokuhatsu 0219-4",
        },
        {
          severity: "critical",
          title: "UDI / Barcode Expiration Mismatch",
          description: "Carton 2D DataMatrix encodes AI(17) as '290831' (Aug 31, 2029) while human-readable text prints '2029-09-30'. Optical verification failure will fail hospital inbound dock scanning.",
          regulation: "GS1 General Specs §3.4.1 / FDA 21 CFR 830.20",
        },
        {
          severity: "warning",
          title: "ISO Symbol Standard Obsolescence",
          description: "All 12 label files currently utilize obsolete EO gas symbols. Retaining legacy symbols after Gamma transition violates ISO 15223-1 §5.2.4.",
          regulation: "ISO 15223-1:2021 & EU MDR 2017/745 Annex I",
        },
      ],
      recommendedNextStep:
        "Open the Label Draft Generator to auto-apply the AI-staged fixes (inject Japanese caution block, synchronize AI(17) barcode, swap to STERILE R) and route ECO-2026-089 through Regulatory Review signoff.",
      sourceCitations: [
        {
          title: "ISO 15223-1:2021 Medical Devices — Symbols to be used with information to be supplied by the manufacturer",
          source: "ISO / ANSI Standard",
          section: "Clause 5.2.4 (Sterilized using irradiation)",
          type: "standard",
        },
        {
          title: "EU Medical Device Regulation (EU) 2017/745",
          source: "Official Journal of the European Union",
          section: "Annex I, Chapter III, Section 23.2 (Information on the label)",
          type: "regulation",
        },
        {
          title: "FDA 21 CFR Part 801 (Medical Device Labeling) & Part 830 (UDI)",
          source: "US Code of Federal Regulations",
          section: "21 CFR 801.109 Prescription Devices & 21 CFR 830.20",
          type: "regulation",
        },
        {
          title: "Japan PMD Act & MHLW Ordinance 169",
          source: "Ministry of Health, Labour and Welfare, Japan",
          section: "Article 63-2 & PMDA Guidance on Single-Use Labeling",
          type: "regulation",
        },
        {
          title: "CardioMed Packaging Master Specification SPEC-LBL-CS100-REV2",
          source: "CardioMed Design History File (DHF)",
          section: "Section 4.3 (Tyvek Sterile Barrier Seal & Gamma Inks)",
          type: "internal",
        },
      ],
      warningNotice: "AI Copilot suggestion — human approval required",
    };
  },
};

