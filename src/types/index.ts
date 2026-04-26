export type FacilityType = "hospital" | "clinic" | "diagnostic" | "pharmacy";
export type Severity = "low" | "medium" | "high";
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Contradiction {
  text: string;
  source: string;
  severity: Severity;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  state: string;
  city: string;
  lat: number;
  lon: number;
  phone: string;
  trustScore: number;
  contradictions: Contradiction[];
  sources: string[];
  distance?: number;
}

export interface ThinkingStep {
  step: number;
  title: string;
  detail: string;
  duration: number;
}

export interface AskResponse {
  response: string;
  thinking: ThinkingStep[];
  facilities: Facility[];
  queryLanguage: string;
  traceId: string;
  searchTime: number;
}

export interface MapFacility {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state: string;
  trustScore: number;
  contradictions: number;
  phone: string;
  type: FacilityType;
}

export interface StateAnalysis {
  state: string;
  avgTrust: number;
  facilitiesSampled: number;
  highTrustCount: number;
  riskLevel: RiskLevel;
  desertZones: number;
}

export interface DesertAnalysisResponse {
  totalFacilities: number;
  desertZones: number;
  contradictions: number;
  states: StateAnalysis[];
}
