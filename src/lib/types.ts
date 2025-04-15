export interface TechnicalSkillCategory {
  skills: string[];
  proficiency: number;
  gaps: string[];
}

export interface AnalysisResponse {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    skillMatches: string[];
    recommendations: string[];
  };
} 