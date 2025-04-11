import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface TechnicalSkillCategory {
  skills: string[];
  proficiency: number;
  gaps: string[];
}

interface AnalysisResponse {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    skillMatch: {
      matching: string[];
      missing: string[];
      additional: string[];
    };
    recommendations: {
      immediate: string[];
      longTerm: string[];
    };
    technicalSkillsAnalysis: {
      frontend: TechnicalSkillCategory;
      backend: TechnicalSkillCategory;
      devops: TechnicalSkillCategory;
      databases: TechnicalSkillCategory;
    };
  };
}

export async function analyzeResume(file: File, formData: {
  jobTitle: string;
  experience: string;
  skills: string;
  industry: string;
}) {
  try {
    // Convert file to base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the prompt with detailed analysis instructions
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and technical recruiter. Analyze the provided resume in detail for the following position:

Position: ${formData.jobTitle}
Industry: ${formData.industry}
Required Experience: ${formData.experience} years
Required Skills: ${formData.skills}

Perform a comprehensive analysis focusing on:
1. ATS Compatibility
2. Technical Skills Alignment
3. Experience Relevance
4. Resume Format & Structure
5. Industry Best Practices

Provide a detailed analysis in JSON format with the following structure:
{
  "score": <number between 0-100>,
  "suggestions": [<detailed improvement suggestions>],
  "missingKeywords": [<critical missing keywords>],
  "detailedAnalysis": {
    "strengths": [<specific strong points>],
    "weaknesses": [<specific areas needing improvement>],
    "skillMatch": {
      "matching": [<matching skills>],
      "missing": [<missing skills>],
      "additional": [<additional relevant skills>]
    },
    "recommendations": {
      "immediate": [<immediate actions>],
      "longTerm": [<long-term improvements>]
    },
    "technicalSkillsAnalysis": {
      "frontend": {
        "skills": [<frontend skills>],
        "proficiency": <number between 0-100>,
        "gaps": [<missing frontend skills>]
      },
      "backend": {
        "skills": [<backend skills>],
        "proficiency": <number between 0-100>,
        "gaps": [<missing backend skills>]
      },
      "devops": {
        "skills": [<devops skills>],
        "proficiency": <number between 0-100>,
        "gaps": [<missing devops skills>]
      },
      "databases": {
        "skills": [<database skills>],
        "proficiency": <number between 0-100>,
        "gaps": [<missing database skills>]
      }
    }
  }
}`;

    try {
      // Generate analysis with streaming
      const result = await model.generateContentStream({
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type,
                data: base64String
              }
            }
          ]
        }]
      });

      // Collect the streamed response
      let responseText = '';
      for await (const chunk of result.stream) {
        responseText += chunk.text();
      }

      // Clean and parse the response
      try {
        // Find the first { and last } to extract valid JSON
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error('Invalid JSON response format');
        }
        const jsonStr = responseText.slice(jsonStart, jsonEnd);
        const analysis = JSON.parse(jsonStr) as AnalysisResponse;

        // Validate the response structure
        if (!analysis || typeof analysis.score !== 'number' || !Array.isArray(analysis.suggestions)) {
          throw new Error('Invalid response structure');
        }

        // Ensure all required fields exist with proper defaults
        return {
          score: Math.min(Math.max(0, Math.round(analysis.score)), 100),
          suggestions: analysis.suggestions?.filter((s: string) => typeof s === 'string') || [],
          missingKeywords: analysis.missingKeywords?.filter((k: string) => typeof k === 'string') || [],
          jobTitle: formData.jobTitle,
          detailedAnalysis: {
            strengths: analysis.detailedAnalysis?.strengths || [],
            weaknesses: analysis.detailedAnalysis?.weaknesses || [],
            skillMatch: {
              matching: analysis.detailedAnalysis?.skillMatch?.matching || [],
              missing: analysis.detailedAnalysis?.skillMatch?.missing || [],
              additional: analysis.detailedAnalysis?.skillMatch?.additional || []
            },
            recommendations: {
              immediate: analysis.detailedAnalysis?.recommendations?.immediate || [],
              longTerm: analysis.detailedAnalysis?.recommendations?.longTerm || []
            },
            technicalSkillsAnalysis: {
              frontend: {
                skills: analysis.detailedAnalysis?.technicalSkillsAnalysis?.frontend?.skills || [],
                proficiency: analysis.detailedAnalysis?.technicalSkillsAnalysis?.frontend?.proficiency || 0,
                gaps: analysis.detailedAnalysis?.technicalSkillsAnalysis?.frontend?.gaps || []
              },
              backend: {
                skills: analysis.detailedAnalysis?.technicalSkillsAnalysis?.backend?.skills || [],
                proficiency: analysis.detailedAnalysis?.technicalSkillsAnalysis?.backend?.proficiency || 0,
                gaps: analysis.detailedAnalysis?.technicalSkillsAnalysis?.backend?.gaps || []
              },
              devops: {
                skills: analysis.detailedAnalysis?.technicalSkillsAnalysis?.devops?.skills || [],
                proficiency: analysis.detailedAnalysis?.technicalSkillsAnalysis?.devops?.proficiency || 0,
                gaps: analysis.detailedAnalysis?.technicalSkillsAnalysis?.devops?.gaps || []
              },
              databases: {
                skills: analysis.detailedAnalysis?.technicalSkillsAnalysis?.databases?.skills || [],
                proficiency: analysis.detailedAnalysis?.technicalSkillsAnalysis?.databases?.proficiency || 0,
                gaps: analysis.detailedAnalysis?.technicalSkillsAnalysis?.databases?.gaps || []
              }
            }
          }
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response');
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      throw new Error('Failed to generate analysis');
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw error;
  }
} 