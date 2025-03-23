import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithGemini } from "@/lib/services/gemini";

export async function POST(request: NextRequest) {
  console.log("API route called: /api/analyze-resume");
  
  try {
    // Parse form data
    const formData = await request.formData();
    console.log("Form data received");

    // Get required fields
    const resume = formData.get("resume") as File;
    const userId = formData.get("userId") as string;
    const additionalDetailsStr = formData.get("additionalDetails") as string;

    // Log received data
    console.log("Resume file:", resume?.name, resume?.type, resume?.size);
    console.log("User ID:", userId);
    console.log("Additional details received");

    // Validate required fields
    if (!resume || !userId || !additionalDetailsStr) {
      console.error("Missing required fields:", {
        hasResume: !!resume,
        hasUserId: !!userId,
        hasDetails: !!additionalDetailsStr
      });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse additional details
    let additionalDetails;
    try {
      additionalDetails = JSON.parse(additionalDetailsStr);
      console.log("Additional details parsed successfully");
    } catch (error) {
      console.error("Failed to parse additional details:", error);
      return NextResponse.json(
        { message: "Invalid additional details format" },
        { status: 400 }
      );
    }

    // Convert PDF to base64
    console.log("Converting PDF to base64");
    const buffer = await resume.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    console.log("PDF converted to base64");

    // Analyze resume with Gemini
    console.log("Calling Gemini API");
    const analysis = await analyzeResumeWithGemini(
      base64String,
      additionalDetails.jobTitle,
      additionalDetails.industry,
      additionalDetails.experienceLevel,
      additionalDetails.skills,
      additionalDetails.jobDescription
    );
    console.log("Gemini API response received");

    // Check for analysis error
    if ('error' in analysis) {
      console.error("Analysis error:", analysis);
      return NextResponse.json(
        { message: "Failed to analyze resume" },
        { status: 500 }
      );
    }

    // Prepare successful response
    const response = {
      message: "Resume analyzed successfully",
      analysisId: userId,
      analysis: {
        ...analysis,
        file: {
          name: resume.name,
          size: resume.size,
          type: resume.type
        }
      }
    };
    console.log("Sending successful response");

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to analyze resume" },
      { status: 500 }
    );
  }
} 