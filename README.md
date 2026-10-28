# LabelTrace AI — Frontend-Only Interactive Prototype

> **Autonomous Medical Device Labeling & Regulatory Traceability Copilot**

This is a **frontend-only clickable prototype** with mock AI/backend services. No real backend, database, LLM API, or network requests are used. All data is hardcoded local mock data designed for demo and stakeholder review purposes.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Framework    | React 18 + TypeScript            |
| Build Tool   | Vite 5                           |
| Styling      | Tailwind CSS 3.4                 |
| Icons        | Lucide React                     |
| Data         | Local JSON mock files            |
| AI/Backend   | Mock service functions (no network) |

---

## Architecture

```
src/
├── mocks/               # Realistic mock JSON data
│   ├── products.json     # CS-100, SI-200, OI-300
│   ├── markets.json      # US, EU, Japan, Middle East
│   ├── languages.json    # English, German, Japanese, Arabic
│   ├── labels.json       # 14 label records (12 affected by ECO)
│   ├── symbols.json      # ISO 15223-1 symbol catalog
│   ├── complianceIssues.json
│   ├── artworkDiff.json
│   ├── approvals.json
│   ├── auditTrail.json
│   ├── traceability.json
│   ├── dashboardKPIs.json
│   └── index.ts
│
├── services/             # Mock service functions (500-1000ms delay)
│   ├── mockCopilotService.ts
│   ├── mockChangeImpactService.ts
│   ├── mockLabelDraftService.ts
│   ├── mockComplianceService.ts
│   ├── mockArtworkDiffService.ts
│   ├── mockTraceabilityService.ts
│   ├── mockApprovalWorkflowService.ts
│   ├── mockAuditService.ts
│   └── index.ts
│
├── components/
│   ├── common/           # Shared UI components
│   │   ├── Header.tsx
│   │   ├── Badge.tsx
│   │   ├── SymbolBadge.tsx
│   │   └── BarcodePreview.tsx
│   │
│   └── views/            # Dashboard tab views
│       ├── CopilotChatView.tsx
│       ├── DashboardKPIsView.tsx
│       ├── ChangeImpactSimulatorView.tsx
│       ├── LabelDraftGeneratorView.tsx
│       ├── ComplianceValidationView.tsx
│       ├── ArtworkDiffViewerView.tsx
│       ├── TraceabilityView.tsx
│       ├── ApprovalWorkflowView.tsx
│       └── AuditPackageView.tsx
│
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

---

## Dashboard Tabs

1. **AI Copilot** — Chat interface; type a change request and get structured regulatory analysis
2. **Dashboard KPIs** — High-level metrics, regional compliance breakdown, recent activity
3. **Change Impact Simulator** — Simulate an ECO across products, markets, and packaging tiers
4. **Label Draft Generator** — Live artwork preview with symbol, barcode, and warning injection
5. **Compliance Validation** — 3 compliance issues (2 critical blockers, 1 warning) with auto-fix
6. **Artwork Diff Viewer** — Side-by-side before/after comparison with bounding box overlays
7. **Traceability Matrix** — End-to-end regulatory traceability from requirement to filing
8. **Approval Workflow** — Interactive 6-stage pipeline (advance, block, reset)
9. **Audit Package** — Downloadable JSON and printable 21 CFR Part 11 audit trail

---

## Demo Scenario

Click the **"Demo Scenario"** button in the header (or type into the Copilot):

> "Update CS-100 sterilization to Gamma Radiation for US, EU and Japan"

The Copilot responds with:
- Understood change description
- 12 affected labels across 3 markets
- Affected markets and 7 language translations
- 5 required actions
- 2 critical risks (missing Japanese warning + UDI barcode mismatch) and 1 warning
- Recommended next step with navigation buttons
- 5 source citations (ISO, FDA, EU MDR, PMDA, internal DHF)
- Mandatory warning: "AI Copilot suggestion — human approval required"

---

## Mock Data Products

| Code   | Name                      | Class              | Markets              |
| ------ | ------------------------- | ------------------ | -------------------- |
| CS-100 | Cardiac Stent CS-100      | Class III (PMA)    | US, EU, Japan, ME    |
| SI-200 | Surgical Instrument SI-200| Class IIa          | US, EU, ME           |
| OI-300 | Orthopedic Implant OI-300 | Class IIb          | US, EU, Japan, ME    |

---

## Important Notes

- **No real LLM API** — All copilot responses are deterministic mock data
- **No real database** — All state is in-memory React state + JSON files
- **No network requests** — Every service function uses `setTimeout` delays (500–1000ms)
- **No authentication** — No login, no backend auth
- **No FastAPI / SQLite / SQLAlchemy** — All backend code has been removed

---

## License

Proprietary — Internal prototype for demonstration purposes only.

