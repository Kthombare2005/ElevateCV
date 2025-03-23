"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Analysis {
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
  metadata: {
    timestamp: string;
    jobTitle: string;
    industry: string;
    experienceLevel: string;
    skills: string[];
  };
  file?: {
    name: string;
    size: number;
    type: string;
  };
}

export default function ResultsPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get analysis from sessionStorage
    const analysisData = sessionStorage.getItem(`resume-analysis-${params.id}`);
    if (analysisData) {
      try {
        const parsedAnalysis = JSON.parse(analysisData);
        
        // Validate the analysis structure
        if (!parsedAnalysis.atsScore || !parsedAnalysis.matchScore) {
          throw new Error("Invalid analysis data structure");
        }
        
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error("Error parsing analysis:", error);
        setError("Failed to load analysis results. The data format is invalid.");
      }
    } else {
      setError("No analysis results found");
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A1F] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/resume-analyzer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Analyzer
            </Link>
          </div>
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0A0A1F] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A1F] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/resume-analyzer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Analyzer
          </Link>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Resume Analysis Results</h1>
            <p className="text-zinc-400">
              Analysis for {analysis.metadata.jobTitle} position in {analysis.metadata.industry}
            </p>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">ATS Score</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-blue-400">{analysis.atsScore}</span>
                <span className="text-zinc-400 mb-1">/100</span>
              </div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Match Score</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-purple-400">{analysis.matchScore}</span>
                <span className="text-zinc-400 mb-1">/100</span>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Key Findings</h2>
            <ul className="space-y-2">
              {analysis.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-zinc-300">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Analysis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Skills Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Present Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsAnalysis.present.map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-sm bg-emerald-500/10 text-emerald-400 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsAnalysis.missing.map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-sm bg-red-500/10 text-red-400 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Recommended Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsAnalysis.recommended.map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-sm bg-blue-500/10 text-blue-400 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Format Analysis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Format Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.formatAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-emerald-400">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {analysis.formatAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-400">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Improvement Suggestions</h2>
            <ul className="space-y-2">
              {analysis.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-zinc-300">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-zinc-400">Experience Level</p>
                <p className="text-white">{analysis.metadata.experienceLevel}</p>
              </div>
              <div>
                <p className="text-zinc-400">Analysis Date</p>
                <p className="text-white">
                  {new Date(analysis.metadata.timestamp).toLocaleDateString()}
                </p>
              </div>
              {analysis.file && (
                <>
                  <div>
                    <p className="text-zinc-400">Resume File</p>
                    <p className="text-white">{analysis.file.name}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">File Size</p>
                    <p className="text-white">{Math.round(analysis.file.size / 1024)} KB</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 