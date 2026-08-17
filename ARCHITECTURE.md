# PRISM Architecture (Frozen)

Frontend
- Presentation only
- No business calculation
- No data persistence
- Consume Backend API only

Backend
- Business logic
- Validation
- Aggregation
- Data transformation
- REST API

Database
- PostgreSQL
- Historical storage
- Single source of truth

## COA Governance & Early Detection — LOCKED

PRISM must maintain a Master COA, Mapping Engine, and Validation Engine.

During every upload, the backend must detect:
- New or unmapped COA
- COA description/category changes
- Missing COA versus prior snapshots
- Abnormal balance movements
- COA not included in existing indicator formulas
- Potentially incomplete or distorted calculations

A snapshot cannot become READY when a material COA remains unmapped.
The system must show the affected indicators and required mapping action.

## Final Architecture
Upload
→ COA Detection
→ Mapping Validation
→ Formula Impact Analysis
→ Data Validation
→ Processing
→ READY

## Master Data is the source of business meaning. Excel is only the carrier.

## Dynamic Formula Engine — LOCKED

All business indicators must be calculated by the backend formula engine.

Formulas must:
- Be version-controlled
- Have effective dates
- Preserve historical calculations
- Reference mapped master data
- Record the formula version used
- Detect incomplete components
- Identify indicators affected by COA or mapping changes

Material calculation failures must prevent a snapshot from becoming READY.

# PRISM Indicator Classification (LOCKED)

This classification is a permanent architecture decision for PRISM.
Each indicator belongs to exactly one Source Type.

| Indicator | Module | Source Type | Current Source | Future State | Backend Responsibility |
|----------|--------|-------------|----------------|--------------|------------------------|
| LCR | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| NSFR | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| AL/DPK | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| AL/NCD | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| NOP | Treasury | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| Gross NPL | Credit | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| Net NPL | Credit | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| LAR | Credit | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| CAR | Capital | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| Equity Tier 1 | Capital | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| GWM IDR | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| GWM Valas | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| GWM PLM | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| Excess Liquidity | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| 7 Days Liquidity Ratio | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| 3 Months Liquidity Ratio | Liquidity | IMPORTED | Excel | Imported | Validate, Store, Historical Trend |
| Actual NIM | Profitability | TRANSITIONAL | Excel | Formula Engine | Validate today, Generate in future |
| Asset Yield (per Asset Product) | Profitability | TRANSITIONAL | Excel | Formula Engine | Validate today, Generate in future |
| Liability Cost (per Funding Product) | Profitability | TRANSITIONAL | Excel | Formula Engine | Validate today, Generate in future |
| Enterprise Score | Executive | GENERATED | PRISM | Formula Engine | Fully Generated |
| Credit Intelligence Score | Credit | GENERATED | PRISM | Formula Engine | Fully Generated |
| Liquidity Intelligence Score | Liquidity | GENERATED | PRISM | Formula Engine | Fully Generated |
| Treasury Intelligence Score | Treasury | GENERATED | PRISM | Formula Engine | Fully Generated |
| Operational Intelligence Score | Operational | GENERATED | PRISM | Formula Engine | Fully Generated |
| Profitability Intelligence Score | Profitability | GENERATED | PRISM | Formula Engine | Fully Generated |
| Recovery Readiness Index | Executive | GENERATED | PRISM | Formula Engine | Fully Generated |
| Data Quality Score | Executive | GENERATED | PRISM | Formula Engine | Fully Generated |
| COA Completeness Score | Executive | GENERATED | PRISM | Formula Engine | Fully Generated |

## Source Type Definition

| Source Type | Description |
|-------------|-------------|
| IMPORTED | Imported directly from the source system. PRISM validates, stores, trends, and monitors the data without recalculating it. |
| TRANSITIONAL | Temporarily imported from the source system. Planned to be generated internally by the PRISM Formula Engine after backend development is completed. |
| GENERATED | Fully calculated by the PRISM backend using Master Data, Mapping Engine, and Formula Engine. These indicators never originate directly from Excel. |

## Architecture Rules (LOCKED)

- Excel is the transport medium, not the source of business logic.
- Master Data defines business meaning.
- Formula Engine owns all generated calculations.
- Historical snapshots must never be overwritten.
- Indicator classification (IMPORTED / TRANSITIONAL / GENERATED) is a permanent architecture principle.
- Changes to indicator formulas must be version-controlled and preserve historical results.