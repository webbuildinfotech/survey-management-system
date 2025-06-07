export interface BusinessScore {
  name: string;
  category: string;
  score: number;
  scoreBreakdown: {
    qualityScore: number;
    expertiseScore: number;
    valueScore: number;
  };
  reasoning: string;
}

export interface ScoredBusiness extends BusinessScore {
  rating?: number;
  categories?: string[];
}
