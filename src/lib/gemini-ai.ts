import { AnalysisResponse } from './types';

export async function analyzeResume(fileContent: string, formData: {
  jobTitle: string;
  experience: string;
  skills: string;
  industry: string;
}): Promise<AnalysisResponse> {
  try {
    // Create request body
    const requestBody = {
      fileContent,
      jobTitle: formData.jobTitle,
      experience: formData.experience,
      skills: formData.skills,
      industry: formData.industry
    };

    // Call our API route
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response
    const data = await response.json();

    // Check if the response indicates an error
    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze resume');
    }

    // Validate the response structure
    if (typeof data.score !== 'number' || !Array.isArray(data.suggestions)) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid analysis response structure');
    }

    // Create a properly structured response
    const analysisResponse: AnalysisResponse = {
      score: data.score,
      suggestions: data.suggestions,
      missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
      detailedAnalysis: data.detailedAnalysis ? {
        strengths: Array.isArray(data.detailedAnalysis.strengths) ? data.detailedAnalysis.strengths : [],
        weaknesses: Array.isArray(data.detailedAnalysis.weaknesses) ? data.detailedAnalysis.weaknesses : [],
        skillMatches: Array.isArray(data.detailedAnalysis.skillMatches) ? data.detailedAnalysis.skillMatches : [],
        recommendations: Array.isArray(data.detailedAnalysis.recommendations) ? data.detailedAnalysis.recommendations : []
      } : undefined
    };

    return analysisResponse;
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw error;
  }
} 