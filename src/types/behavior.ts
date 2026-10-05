export type ShoppingArchetype = 
  | 'The Strategic Cart Parker'
  | 'The Dopamine Bargain Hunter'
  | 'The Analysis Paralysis Researcher'
  | 'The Threshold Vulnerable Saver'
  | 'The Frictionless One-Clicker';

export interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: {
    label: string;
    description: string;
    scores: {
      impulse: number;
      threshold: number;
      research: number;
      returnFriction: number;
      scarcity: number;
    };
  }[];
}

export interface QuizResult {
  archetype: ShoppingArchetype;
  archetypeDescription: string;
  coreVulnerability: string;
  superpower: string;
  recommendedRules: string[];
  scores: {
    impulse: number;
    threshold: number;
    research: number;
    returnFriction: number;
    scarcity: number;
  };
}

export interface CognitiveBias {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pricing' | 'Urgency' | 'Cognitive Load' | 'Post-Purchase';
  scientificPrinciple: string;
  retailerGoal: string;
  customerVulnerability: string;
  realWorldExample: string;
  interactiveType: 'threshold' | 'anchor' | 'scarcity' | 'friction';
  counterStrategy: string;
}

export interface DarkPattern {
  id: string;
  name: string;
  severity: 'Severe' | 'High' | 'Moderate';
  description: string;
  howItWorks: string;
  customerHarm: string;
  detectionTip: string;
  liveExample: {
    headline: string;
    deceptiveElement: string;
    normalOption: string;
  };
}

export interface PurchaseLogItem {
  id: string;
  date: string;
  itemName: string;
  category: string;
  price: number;
  originalPrice?: number;
  type: 'Impulse' | 'Planned' | 'Threshold Filler';
  emotionalStateAtPurchase: string;
  utilityRating: 1 | 2 | 3 | 4 | 5; // 1 = instant regret, 5 = loved & used daily
  stillUsed: boolean;
  notes: string;
}

export interface CartAuditInput {
  itemName: string;
  category: string;
  price: number;
  originalPrice: number;
  shippingFee: number;
  freeShippingMin: number;
  urgencySignals: string;
  emotionalState: 'Calm & Intentional' | 'Bored / Scrolling' | 'Stressed / Seeking Relief' | 'Excited / FOMO';
  expectedUsesPerYear: number;
  reason: string;
}

export interface CartAuditResult {
  deceptionScore: number;
  urgencyReality: string;
  regretProbability: string;
  costPerUse: number;
  shippingTrapAdvice: string;
  psychologicalTriggers: string[];
  customerAdvocateRecommendation: string;
  counterActionQuestions: string[];
}
