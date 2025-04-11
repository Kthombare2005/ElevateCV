'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Code, Database, GitBranch, Wrench, Server, Target } from 'lucide-react';
import { MagicCard } from '@/components/magicui/MagicCard';

interface TechnicalSkillCategory {
  skills: string[];
  proficiency: number;
  gaps: string[];
}

interface ATSAnalysisSectionProps {
  score: number;
  suggestions: string[];
  missingKeywords: string[];
  jobTitle: string;
  detailedAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    skillMatch: {
      matching: string[];
      missing: string[];
      additional: string[];
    };
    formatIssues?: string[];
    recommendations: {
      immediate: string[];
      longTerm: string[];
    };
    industryKeywords: string[];
    technicalSkillsAnalysis?: {
      frontend: TechnicalSkillCategory;
      backend: TechnicalSkillCategory;
      devops: TechnicalSkillCategory;
      databases: TechnicalSkillCategory;
    };
  };
  disableHover?: boolean;
}

const SkillCategoryCard = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  category 
}: { 
  title: string; 
  icon: any; 
  iconColor: string; 
  category: TechnicalSkillCategory;
}) => (
  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <h4 className="text-lg font-semibold text-gray-200">{title}</h4>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">Overall Proficiency</span>
        <span className={`text-sm font-medium ${
          category.proficiency >= 80 ? 'text-green-400' :
          category.proficiency >= 60 ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {category.proficiency}%
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${category.proficiency}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${
            category.proficiency >= 80 ? 'bg-green-400' :
            category.proficiency >= 60 ? 'bg-yellow-400' :
            'bg-red-400'
          }`}
        />
      </div>
      <div>
        <h5 className="text-sm font-medium text-gray-400 mb-2">Skills</h5>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      {category.gaps.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-400 mb-2">Skill Gaps</h5>
          <div className="flex flex-wrap gap-2">
            {category.gaps.map((gap, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-sm"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export const ATSAnalysisSection = ({ 
  score, 
  suggestions, 
  missingKeywords, 
  jobTitle,
  detailedAnalysis,
  disableHover 
}: ATSAnalysisSectionProps) => {
  return (
    <div className="space-y-8">
      <MagicCard disableHover={disableHover}>
        {/* Score Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            ATS Score
          </h2>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform transition-transform duration-1000 hover:scale-105">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <motion.circle
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                strokeWidth="8"
                strokeDasharray={364}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`absolute text-4xl font-bold ${
                score >= 80 ? 'text-green-500' : 
                score >= 60 ? 'text-yellow-500' : 
                'text-red-500'
              }`}
            >
              {score}%
            </motion.span>
          </div>
          <p className="mt-4 text-gray-300">
            Your resume's compatibility with {jobTitle} position
          </p>
        </div>
      </MagicCard>

      {detailedAnalysis && (
        <>
          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MagicCard>
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                Strengths
              </h3>
              <div className="space-y-3">
                {detailedAnalysis.strengths.map((strength, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                    <p className="text-gray-300">{strength}</p>
                  </motion.div>
                ))}
              </div>
            </MagicCard>

            <MagicCard>
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 mb-4">
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                {detailedAnalysis.weaknesses.map((weakness, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 mt-1" />
                    <p className="text-gray-300">{weakness}</p>
                  </motion.div>
                ))}
              </div>
            </MagicCard>
          </div>

          {/* Technical Skills Analysis */}
          {detailedAnalysis.technicalSkillsAnalysis && (
            <MagicCard>
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500 mb-4">
                Technical Skills Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillCategoryCard
                  title="Frontend"
                  icon={Code}
                  iconColor="text-blue-400"
                  category={detailedAnalysis.technicalSkillsAnalysis.frontend}
                />
                <SkillCategoryCard
                  title="Backend"
                  icon={Server}
                  iconColor="text-purple-400"
                  category={detailedAnalysis.technicalSkillsAnalysis.backend}
                />
                <SkillCategoryCard
                  title="DevOps"
                  icon={Wrench}
                  iconColor="text-yellow-400"
                  category={detailedAnalysis.technicalSkillsAnalysis.devops}
                />
                <SkillCategoryCard
                  title="Databases"
                  icon={Database}
                  iconColor="text-green-400"
                  category={detailedAnalysis.technicalSkillsAnalysis.databases}
                />
              </div>
            </MagicCard>
          )}

          {/* Recommendations */}
          <MagicCard>
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              Action Items
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-blue-400 mb-3">Immediate Actions</h4>
                <div className="space-y-3">
                  {detailedAnalysis.recommendations.immediate.map((rec, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-1" />
                      <p className="text-gray-300">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-purple-400 mb-3">Long-term Improvements</h4>
                <div className="space-y-3">
                  {detailedAnalysis.recommendations.longTerm.map((rec, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <Target className="w-5 h-5 text-purple-400 mt-1" />
                      <p className="text-gray-300">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </MagicCard>

          {/* Missing Keywords */}
          <MagicCard>
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 mb-4">
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20 hover:border-red-500/40 transition-colors duration-300"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </MagicCard>
        </>
      )}
    </div>
  );
}; 