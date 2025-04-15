import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { fileContent, jobTitle, experience, skills, industry } = await request.json();

    if (!fileContent) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a prompt for the model
    const prompt = `
      You are an expert resume analyzer and career coach. Analyze the following resume content and provide feedback based on the job title "${jobTitle}", experience level "${experience}", skills "${skills}", and industry "${industry}".
      
      Resume content:
      ${fileContent}
      
      Please provide a detailed analysis in the following JSON format:
      {
        "score": 85,
        "suggestions": [
          "Suggestion 1",
          "Suggestion 2"
        ],
        "missingKeywords": [
          "Keyword 1",
          "Keyword 2"
        ],
        "detailedAnalysis": {
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Weakness 1", "Weakness 2"],
          "skillMatches": ["Skill 1", "Skill 2"],
          "recommendations": ["Recommendation 1", "Recommendation 2"]
        }
      }
      
      The score should be a number between 0 and 100, representing how well the resume matches the job requirements.
      The suggestions should be specific improvements for the resume.
      The missingKeywords should be important keywords from the job description that are missing from the resume.
      The detailedAnalysis should provide a comprehensive breakdown of the resume's strengths, weaknesses, skill matches, and specific recommendations.
    `;

    // Generate content with the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate the analysis structure
      if (typeof analysis.score !== 'number' || !Array.isArray(analysis.suggestions)) {
        throw new Error('Invalid analysis structure');
      }
      
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse analysis response',
        rawResponse: text
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze resume',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 