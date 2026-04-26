# SachCare

**Serving a Nation — Building Agentic Healthcare Maps for 1.4 Billion Lives**

In collaboration with the **MIT Club of Northern California** and **MIT Club of Germany**.

Powered by **Databricks Data Intelligence Platform**

---

## Challenge 03

India’s healthcare access is often a discovery problem, not just a supply problem. A postal code can determine whether a family reaches the right care in time. SachCare Navigator is an AI-powered healthcare facility trust advisor designed to help users find the nearest, most trustworthy, and most capable medical facility from a large, messy, unstructured dataset of Indian healthcare providers.

This project goes beyond keyword search. It uses an agentic reasoning layer to:

- audit facility capabilities at scale
- identify specialized healthcare deserts
- detect contradictions in facility claims
- score trust using evidence from unstructured notes
- provide transparent, citation-backed recommendations

---

## Motivation / Goal

In India, healthcare data is fragmented and inconsistent. Facilities may claim ICU, surgery, or specialist support without providing enough evidence to verify those claims. Patients and planners need a system that can reason through incomplete and contradictory records.

SachCare Navigator aims to reduce **discovery-to-care time** by turning 10,000+ facility records into a living intelligence network.

### Core goals
- **Audit capability at scale**  
  Verify whether a hospital actually has the resources it claims.
- **Identify specialized deserts**  
  Find gaps in high-acuity needs such as oncology, dialysis, trauma, and emergency care.
- **Navigate the truth gap**  
  Detect contradictions between claims and evidence in free-form facility notes.

---

## Core Features

### 1. Massive Unstructured Extraction
Processes free-form notes from 10,000 Indian healthcare facility records, including:

- equipment logs
- 24/7 availability claims
- staff specialties
- procedure descriptions
- capacity and bed data

### 2. Multi-Attribute Reasoning
Handles queries that require more than simple search.

Example:
> “Find the nearest facility in rural Bihar that can perform an emergency appendectomy and typically leverages part-time doctors.”

### 3. Trust Scoring
Generates a trust score by checking whether claims are supported by evidence.

Examples of suspicious patterns:
- ICU claimed, but no ventilator listed
- surgery claimed, but no anesthesiologist mentioned
- emergency service listed, but no relevant equipment or staffing evidence

---

## Stretch Goals

### Agentic Traceability
- Row-level and step-level citations
- Clear evidence for every recommendation
- MLflow 3 tracing for observability

### Self-Correction Loops
- Validator agent cross-references extracted data against medical standards
- Helps reduce hallucinations and incorrect inference

### Dynamic Crisis Mapping
- Visual dashboard of India
- Highlights high-risk healthcare deserts by PIN code

---

## Architecture

SachCare Navigator follows a classic **ingest → enrich → score → serve** pattern across five layers.

### 1. Data Layer — Raw Ingestion
`02_Ingest_Data_To_Spark` ingests 10,000 healthcare facility records from the VF hackathon dataset and writes them to Delta Lake.

Key actions:
- generates unique `facility_id`
- normalizes column names
- builds a searchable `searchable_text` field
- fills missing latitude/longitude with India center coordinates
- enables Change Data Feed for downstream use

Target table:
- `healthcare_hackathon.india_facilities.facilities_raw`

### 2. Trust Scoring Engine — LLM as Auditor
`02_Agent_Core` is the core intelligence layer.

It uses **Llama 3.3 70B Instruct** via Databricks Model Serving in two roles:

#### Internal Trust Auditor
An LLM acts as a senior healthcare facility auditor for India’s Ministry of Health and produces:

- trust score (0–100)
- verified capabilities
- contradictions
- missing evidence
- key citation

#### External Verification
Uses the **Tavily web search API** to check:
- NABH accreditation
- online reviews
- news reports
- complaints or fraud indicators

This is still early-stage and marked as **V0**.

### 3. Batch Scoring Pipeline
`03_Batch_Map_Scoring` pre-computes trust scores at scale using two strategies:

#### LLM-based scoring
- scores ~300 facilities
- uses 12 concurrent workers via `ThreadPoolExecutor`
- writes results to:
  - `healthcare_hackathon.india_facilities.trust_scores_map`

#### Heuristic Spark-native scoring
- scores 2,000+ facilities quickly
- uses rule-based keyword and contradiction heuristics
- supports rapid map visualization

Examples:
- ICU +15
- emergency +12
- surgery +10
- ICU without ventilator = -10

### 4. API Serving Layer
The `sachcare_api.py` Flask app is deployed as a **Databricks App** and exposed through `app.yaml`.

#### `POST /api/ask`
Main query endpoint.

Pipeline:
- input sanitization
- location resolution from query text or GPS
- medical keyword expansion
- SQL search with relevance scoring
- geo-aware fallback strategy
- composite ranking
- LLM reasoning over top results

#### `GET /api/map-data`
Returns facilities with trust scores for map visualization.

#### `GET /api/export/facilities`
Returns the full 10K facility export with gzip compression.

### 5. Tracking & Observability
MLflow experiment tracking is enabled via:

- `/sachcare-agent-traces`

This provides:
- traceability for LLM calls
- reasoning visibility
- cost tracking
- debugging support

---

## Key Design Decisions

- **Hybrid scoring**  
  LLM scoring gives quality, heuristics give scale.

- **Location intent extraction**  
  User-stated city/state/PIN should override device GPS when appropriate.

- **Contradiction detection over pure recommendation**  
  The system is designed to act like an auditor, not just a search engine.

- **Progressive fallback querying**  
  If results are sparse, the system widens geography or relaxes constraints so users still get useful results.

---

## Research Areas

The dataset is incomplete and noisy, so the model must handle uncertainty carefully.

Open questions include:

- How should confidence be framed when the dataset may be incomplete?
- Can prediction intervals be created around trust conclusions?
- How should contradictory or missing records affect final recommendations?

If you can solve questions marked “could have” or “won’t have,” that would be especially valuable.

---

## Tech Stack

### Databricks
- Databricks Free Edition
- Serverless compute
- Unity Catalog
- Delta Lake
- Agent Bricks
- Genie Code
- MLflow 3
- Mosaic AI Vector Search

### App / Serving
- Flask API
- Vercel deployment
- Databricks App backend integration

### Data & AI
- Llama 3.3 70B Instruct
- Tavily API
- Pydantic schemas
- vector retrieval over 10k records

---

## Dataset

### India 10k Dataset
A dataset of 10,000 medical facilities across India with:
- structured metadata
- unstructured notes
- equipment details
- staffing information
- service capabilities
- location data

### Virtue Foundation Schema
Standardized Pydantic models used to structure extraction and normalization.

Dataset reference:
- `VF_Hackathon_Dataset_India_Large.xlsx`

---

## Evaluation Criteria

### 1. Discovery and Verification — 35%
How well does the agent extract data and verify consistency across the dataset?

### 2. Intelligent Document Parsing — 30%
How well does the solution synthesize messy, free-form facility notes?

### 3. Social Impact and Utility — 25%
How effectively does the tool identify medical deserts and help planners?

### 4. User Experience and Transparency — 10%
How intuitive is the interface, and how clearly does it show reasoning and trust?

---

## Why It Matters

In a country of 1.4 billion people, “near enough” is not enough.

SachCare Navigator transforms a static list of facilities into a healthcare intelligence network that can help families, clinicians, and NGO planners make better decisions faster.

---

## Local Development

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
