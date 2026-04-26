import type {
  AskResponse,
  DesertAnalysisResponse,
  Facility,
  MapFacility,
  StateAnalysis,
} from "@/types";

const askFacilities: Facility[] = [
  {
    id: "f-aiims-patna",
    name: "AIIMS Patna",
    type: "hospital",
    state: "Bihar",
    city: "Patna",
    lat: 25.6201,
    lon: 85.1437,
    phone: "0612-2451070",
    trustScore: 87,
    contradictions: [
      {
        text: 'Hospital website claims "24/7 ICU availability" but a Sept 2024 patient report indicated a 6-hour wait.',
        source: "patient-grievance-portal.gov.in",
        severity: "medium",
      },
    ],
    sources: ["aiims.gov.in", "nabh-accreditation-registry", "tavily:news-2024"],
  },
  {
    id: "f-pmch-patna",
    name: "Patna Medical College Hospital",
    type: "hospital",
    state: "Bihar",
    city: "Patna",
    lat: 25.6118,
    lon: 85.1407,
    phone: "0612-2300307",
    trustScore: 64,
    contradictions: [
      {
        text: 'Listed as "fully equipped dialysis unit" but state audit (Mar 2024) found 3 of 8 machines non-functional.',
        source: "bihar-health-audit-2024.pdf",
        severity: "high",
      },
    ],
    sources: ["pmch.bih.nic.in", "state-audit-2024"],
  },
  {
    id: "f-aiims-delhi",
    name: "AIIMS New Delhi",
    type: "hospital",
    state: "Delhi",
    city: "New Delhi",
    lat: 28.5672,
    lon: 77.21,
    phone: "011-26588500",
    trustScore: 94,
    contradictions: [],
    sources: ["aiims.edu", "nabh-accreditation-registry"],
  },
  {
    id: "f-apollo-chennai",
    name: "Apollo Hospitals Chennai",
    type: "hospital",
    state: "Tamil Nadu",
    city: "Chennai",
    lat: 13.0633,
    lon: 80.2497,
    phone: "044-28290200",
    trustScore: 89,
    contradictions: [
      {
        text: 'Marketing material states "lowest cancer-care prices in South India" — independent comparison rated mid-tier.',
        source: "consumer-voice.org",
        severity: "low",
      },
    ],
    sources: ["apollohospitals.com", "jci-accreditation"],
  },
  {
    id: "f-tata-mumbai",
    name: "Tata Memorial Hospital",
    type: "hospital",
    state: "Maharashtra",
    city: "Mumbai",
    lat: 19.0035,
    lon: 72.843,
    phone: "022-24177000",
    trustScore: 96,
    contradictions: [],
    sources: ["tmc.gov.in", "icmr-records"],
  },
  {
    id: "f-nimhans-blr",
    name: "NIMHANS Bengaluru",
    type: "hospital",
    state: "Karnataka",
    city: "Bengaluru",
    lat: 12.9434,
    lon: 77.5961,
    phone: "080-26995000",
    trustScore: 91,
    contradictions: [],
    sources: ["nimhans.ac.in"],
  },
  {
    id: "f-nizam-hyd",
    name: "Nizam's Institute of Medical Sciences",
    type: "hospital",
    state: "Telangana",
    city: "Hyderabad",
    lat: 17.4192,
    lon: 78.451,
    phone: "040-23489000",
    trustScore: 82,
    contradictions: [
      {
        text: "Public registry lists 1,200 beds; latest inspection (2024) recorded 1,083 functional.",
        source: "telangana-health-dept",
        severity: "low",
      },
    ],
    sources: ["nims.edu.in"],
  },
  {
    id: "f-sms-jaipur",
    name: "SMS Hospital Jaipur",
    type: "hospital",
    state: "Rajasthan",
    city: "Jaipur",
    lat: 26.9078,
    lon: 75.8161,
    phone: "0141-2560291",
    trustScore: 71,
    contradictions: [],
    sources: ["smsmedicalcollege.org"],
  },
];

const askThinking = [
  {
    step: 1,
    title: "Parsing your query",
    detail: "Extracting medical intent, location signals, and urgency markers.",
    duration: 312,
  },
  {
    step: 2,
    title: "Detecting language",
    detail: "Script-based detection identifies query language for response generation.",
    duration: 84,
  },
  {
    step: 3,
    title: "Hybrid search across 12,847 facilities",
    detail: "Combining BM25 keyword scoring with semantic vector similarity (e5-large).",
    duration: 1240,
  },
  {
    step: 4,
    title: "Cross-referencing trust database",
    detail: "Pulling NABH accreditation, government audits, and Tavily live web signals.",
    duration: 980,
  },
  {
    step: 5,
    title: "Synthesizing response",
    detail: "Databricks-hosted LLM composes a cited, contradiction-aware answer.",
    duration: 1530,
  },
];

export function buildAskMock(query: string, language: string): AskResponse {
  const md = `## Top matches for your query

I found **${askFacilities.length} facilities** matching _"${query.slice(0, 80)}"_.
Two have **outstanding trust scores** (\`>90\`) and three carry verified
**contradictions** you should be aware of before visiting.

> ⚠ Always call ahead to confirm bed availability — automated availability feeds
> across Indian hospitals are still inconsistent.

**Recommended next step:** call AIIMS Patna directly or use the Trust Map to
explore nearby alternatives.`;
  return {
    response: md,
    thinking: askThinking,
    facilities: askFacilities,
    queryLanguage: language,
    traceId: `mlflow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    searchTime: 4146,
  };
}

const STATES_WITH_COORDS: Array<{
  state: string;
  cities: Array<{ name: string; lat: number; lon: number }>;
}> = [
  {
    state: "Delhi",
    cities: [
      { name: "New Delhi", lat: 28.6139, lon: 77.209 },
      { name: "Dwarka", lat: 28.5921, lon: 77.046 },
    ],
  },
  {
    state: "Maharashtra",
    cities: [
      { name: "Mumbai", lat: 19.076, lon: 72.8777 },
      { name: "Pune", lat: 18.5204, lon: 73.8567 },
      { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
    ],
  },
  {
    state: "Karnataka",
    cities: [
      { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
      { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
    ],
  },
  {
    state: "Tamil Nadu",
    cities: [
      { name: "Chennai", lat: 13.0827, lon: 80.2707 },
      { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
    ],
  },
  {
    state: "Telangana",
    cities: [{ name: "Hyderabad", lat: 17.385, lon: 78.4867 }],
  },
  {
    state: "West Bengal",
    cities: [{ name: "Kolkata", lat: 22.5726, lon: 88.3639 }],
  },
  {
    state: "Bihar",
    cities: [
      { name: "Patna", lat: 25.5941, lon: 85.1376 },
      { name: "Gaya", lat: 24.7914, lon: 85.0002 },
    ],
  },
  {
    state: "Rajasthan",
    cities: [
      { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
      { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
    ],
  },
  {
    state: "Gujarat",
    cities: [
      { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
      { name: "Surat", lat: 21.1702, lon: 72.8311 },
    ],
  },
  {
    state: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
      { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
      { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
    ],
  },
  {
    state: "Madhya Pradesh",
    cities: [{ name: "Bhopal", lat: 23.2599, lon: 77.4126 }],
  },
  {
    state: "Kerala",
    cities: [
      { name: "Kochi", lat: 9.9312, lon: 76.2673 },
      { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
    ],
  },
  {
    state: "Odisha",
    cities: [{ name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 }],
  },
  {
    state: "Punjab",
    cities: [{ name: "Chandigarh", lat: 30.7333, lon: 76.7794 }],
  },
  {
    state: "Assam",
    cities: [{ name: "Guwahati", lat: 26.1445, lon: 91.7362 }],
  },
  {
    state: "Jharkhand",
    cities: [{ name: "Ranchi", lat: 23.3441, lon: 85.3096 }],
  },
];

const TYPES: MapFacility["type"][] = ["hospital", "clinic", "diagnostic", "pharmacy"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function buildMapFacilities(): MapFacility[] {
  const out: MapFacility[] = [];
  let i = 0;
  for (const s of STATES_WITH_COORDS) {
    for (const c of s.cities) {
      const count = 2 + Math.floor(seededRandom(i + 1) * 2);
      for (let n = 0; n < count; n++) {
        const r1 = seededRandom(i * 7 + n + 13);
        const r2 = seededRandom(i * 11 + n + 31);
        const r3 = seededRandom(i * 17 + n + 53);
        const trust = Math.floor(20 + r1 * 78);
        out.push({
          id: `m-${i}-${n}`,
          name: `${["City", "Apollo", "Civil", "District", "Care", "Janani", "MediHelp"][n % 7]} ${
            ["Hospital", "Clinic", "Diagnostics", "Pharmacy"][n % 4]
          } — ${c.name}`,
          state: s.state,
          lat: c.lat + (r2 - 0.5) * 0.6,
          lon: c.lon + (r3 - 0.5) * 0.6,
          trustScore: trust,
          contradictions: Math.floor(r3 * 4),
          phone: `0${10 + (i % 89)}-${Math.floor(2000000 + r1 * 7999999)}`,
          type: TYPES[n % TYPES.length],
        });
        i++;
        if (out.length >= 44) return out;
      }
    }
  }
  return out;
}

const ALL_28_STATES: Array<{ state: string; baseTrust: number }> = [
  { state: "Andhra Pradesh", baseTrust: 62 },
  { state: "Arunachal Pradesh", baseTrust: 31 },
  { state: "Assam", baseTrust: 44 },
  { state: "Bihar", baseTrust: 38 },
  { state: "Chhattisgarh", baseTrust: 41 },
  { state: "Delhi", baseTrust: 81 },
  { state: "Goa", baseTrust: 73 },
  { state: "Gujarat", baseTrust: 71 },
  { state: "Haryana", baseTrust: 66 },
  { state: "Himachal Pradesh", baseTrust: 64 },
  { state: "Jharkhand", baseTrust: 39 },
  { state: "Karnataka", baseTrust: 78 },
  { state: "Kerala", baseTrust: 84 },
  { state: "Madhya Pradesh", baseTrust: 47 },
  { state: "Maharashtra", baseTrust: 76 },
  { state: "Manipur", baseTrust: 35 },
  { state: "Meghalaya", baseTrust: 33 },
  { state: "Mizoram", baseTrust: 36 },
  { state: "Nagaland", baseTrust: 32 },
  { state: "Odisha", baseTrust: 49 },
  { state: "Punjab", baseTrust: 68 },
  { state: "Rajasthan", baseTrust: 55 },
  { state: "Sikkim", baseTrust: 58 },
  { state: "Tamil Nadu", baseTrust: 80 },
  { state: "Telangana", baseTrust: 74 },
  { state: "Tripura", baseTrust: 42 },
  { state: "Uttar Pradesh", baseTrust: 43 },
  { state: "Uttarakhand", baseTrust: 57 },
];

function riskFromTrust(t: number): StateAnalysis["riskLevel"] {
  if (t < 40) return "CRITICAL";
  if (t < 55) return "HIGH";
  if (t < 70) return "MEDIUM";
  return "LOW";
}

export function buildDesertAnalysis(): DesertAnalysisResponse {
  const states: StateAnalysis[] = ALL_28_STATES.map((s, idx) => {
    const sampled = 220 + Math.floor(seededRandom(idx + 91) * 800);
    const high = Math.floor(sampled * (s.baseTrust / 200));
    return {
      state: s.state,
      avgTrust: s.baseTrust,
      facilitiesSampled: sampled,
      highTrustCount: high,
      riskLevel: riskFromTrust(s.baseTrust),
      desertZones: Math.max(1, Math.floor((100 - s.baseTrust) / 6)),
    };
  });
  return {
    totalFacilities: 12847,
    desertZones: states.reduce((a, b) => a + b.desertZones, 0),
    contradictions: 1892,
    states,
  };
}
