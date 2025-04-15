'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Target } from 'lucide-react';
import { MagicCard } from '@/components/magicui/MagicCard';

interface ATSAnalysisSectionProps {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
  jobTitle: string;
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    skillMatches: string[];
    recommendations: string[];
  };
  disableHover?: boolean;
}

export const ATSAnalysisSection = ({ 
  score, 
  suggestions, 
  missingKeywords, 
  jobTitle,
  detailedAnalysis,
  disableHover 
}: ATSAnalysisSectionProps) => {
  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Score Card */}
      <MagicCard disableHover={disableHover}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
          <p className="text-gray-400 mb-6">How well your resume matches the job requirements for {jobTitle}</p>
          
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`${getScoreColor(score)}`}
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className={`text-lg font-medium ${getScoreColor(score)}`}>
              {score >= 80 ? 'Excellent Match!' : 
               score >= 60 ? 'Good Match' : 
               'Needs Improvement'}
            </p>
          </div>
        </div>
      </MagicCard>

      {/* Suggestions Card */}
      <MagicCard disableHover={disableHover}>
        <h2 className="text-xl font-semibold mb-4">Improvement Suggestions</h2>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{suggestion}</span>
            </li>
          ))}
        </ul>
      </MagicCard>

      {/* Missing Keywords Card */}
      <MagicCard disableHover={disableHover}>
        <h2 className="text-xl font-semibold mb-4">Missing Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      </MagicCard>

      {/* Detailed Analysis */}
      {detailedAnalysis && (
        <>
          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MagicCard disableHover={disableHover}>
              <h2 className="text-xl font-semibold mb-4">Strengths</h2>
              <ul className="space-y-3">
                {detailedAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </MagicCard>

            <MagicCard disableHover={disableHover}>
              <h2 className="text-xl font-semibold mb-4">Weaknesses</h2>
              <ul className="space-y-3">
                {detailedAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{weakness}</span>
                  </li>
                ))}
              </ul>
            </MagicCard>
          </div>

          {/* Skill Matches */}
          <MagicCard disableHover={disableHover}>
            <h2 className="text-xl font-semibold mb-4">Skill Matches</h2>
            <div className="flex flex-wrap gap-2">
              {detailedAnalysis.skillMatches.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </MagicCard>

          {/* Recommendations */}
          <MagicCard disableHover={disableHover}>
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="space-y-3">
              {detailedAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </MagicCard>
        </>
      )}
    </div>
  );
}; 