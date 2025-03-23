import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

interface ResumeAnalysis {
  atsScore: number;
  matchScore: number;
  keyFindings: string[];
  skillsAnalysis: {
    present: string[];
    missing: string[];
    recommended: string[];
  };
  formatAnalysis: {
    strengths: string[];
    weaknesses: string[];
  };
  improvementSuggestions: string[];
}

export async function analyzeResumeWithGemini(
  base64PDF: string,
  jobTitle: string,
  industry: string,
  experienceLevel: string,
  skills: string[],
  jobDescription?: string
) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Construct the prompt
    const prompt = `
      Analyze this resume for a ${jobTitle} position in the ${industry} industry.
      Experience Level: ${experienceLevel}
      Key skills to focus on: ${skills.join(", ")}
      ${jobDescription ? `\nJob Description: ${jobDescription}` : ""}

      Provide a detailed analysis in the following JSON format:
      {
        "atsScore": number between 0-100,
        "matchScore": number between 0-100,
        "keyFindings": array of strings with main observations,
        "skillsAnalysis": {
          "present": array of strings with skills found in resume,
          "missing": array of strings with required skills not found,
          "recommended": array of strings with suggested additional skills
        },
        "formatAnalysis": {
          "strengths": array of strings with format strengths,
          "weaknesses": array of strings with format weaknesses
        },
        "improvementSuggestions": array of strings with specific recommendations
      }

      Return ONLY the JSON object without any markdown formatting or additional text.
    `;

    // Prepare the content for analysis
    const contents = [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: "application/pdf", data: base64PDF } },
          { text: prompt }
        ]
      }
    ];

    // Generate the analysis
    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from markdown if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;

      // Parse the JSON
      const analysisResult = JSON.parse(jsonString.trim());

      // Validate the structure
      if (!analysisResult.atsScore || !analysisResult.matchScore) {
        throw new Error("Invalid analysis structure");
      }

      // Return the analysis with metadata
      return {
        ...analysisResult,
        metadata: {
          timestamp: new Date().toISOString(),
          jobTitle,
          industry,
          experienceLevel,
          skills
        }
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.log("Raw response:", text);
      
      // Return a structured error response
      return {
        error: true,
        message: "Failed to parse analysis results",
        raw: text,
        metadata: {
          timestamp: new Date().toISOString(),
          jobTitle,
          industry,
          experienceLevel,
          skills
        }
      };
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze resume with Gemini AI");
  }
} 