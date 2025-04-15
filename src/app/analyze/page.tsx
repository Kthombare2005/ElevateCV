'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ATSAnalysisSection } from '@/components/sections/ATSAnalysisSection';
import { GradientBackground } from '@/components/magicui/GradientBackground';
import { MagicCard } from '@/components/magicui/MagicCard';
import { MagicButton } from '@/components/magicui/MagicButton';
import { TypewriterText } from '@/components/magicui/TypewriterText';
import { ParticleBackground } from '@/components/magicui/ParticleBackground';
import { FloatingElement } from '@/components/magicui/FloatingElement';
import { BackButton } from '@/components/magicui/BackButton';
import { analyzeResume } from '@/lib/gemini-ai';
import { saveResumeToStorage, saveUserData } from '@/lib/user-data';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { AnalysisResponse } from '@/lib/types';
import { getFirestore } from 'firebase/firestore';

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'form' | 'analysis'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: '',
    skills: '',
    industry: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && (uploadedFile.type === 'application/pdf' || uploadedFile.type === 'application/msword' || uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setStep('preview');
    } else {
      setError('Please upload a PDF or Word document');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      // First, upload the file to Firestore
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const { documentId, content } = await uploadResponse.json();

      // Prepare job details for analysis
      const jobDetails = {
        jobTitle: formData.jobTitle,
        experience: formData.experience,
        skills: formData.skills,
        industry: formData.industry
      };

      // Then analyze the resume using the base64 content
      const analysisResponse = await analyzeResume(content, jobDetails);
      
      // Set the analysis result
      setAnalysisResult(analysisResponse);
      
      // Save the analysis to Firestore
      const db = getFirestore();
      const analysesCollection = collection(db, 'analyses');
      await addDoc(analysesCollection, {
        resumeId: documentId,
        analysis: analysisResponse,
        createdAt: new Date().toISOString(),
      });

      // Move to the analysis step
      setStep('analysis');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 relative overflow-hidden">
      <GradientBackground />
      <ParticleBackground />
      <BackButton href="/" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          {/* Decorative elements */}
          <FloatingElement className="absolute -left-12 top-0" duration={3}>
            <Sparkles className="w-8 h-8 text-blue-500/30" />
          </FloatingElement>
          <FloatingElement className="absolute -right-8 bottom-0" duration={4} delay={1}>
            <Sparkles className="w-6 h-6 text-purple-500/30" />
          </FloatingElement>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="inline-block">
              <TypewriterText
                text="Analyze Your Resume"
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
                speed={70}
              />
            </span>
          </h1>
          <p className="mt-6 text-lg">
            <TypewriterText
              text="Upload your resume to get an ATS score and personalized improvement suggestions"
              className="text-gray-300"
              delay={2000}
              speed={30}
            />
          </p>

          {/* Steps indicator */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {['upload', 'preview', 'form', 'analysis'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <ArrowRight
                    className={`w-4 h-4 mx-2 ${
                      step === s ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {step === 'upload' && (
            <MagicCard>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
                      <FloatingElement duration={3}>
                        <Upload className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                      </FloatingElement>
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PDF or Word Document (MAX. 10MB)</p>
                    </div>
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </MagicCard>
          )}

          {step === 'preview' && file && (
            <MagicCard disableHover>
              <div className="flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-6 bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-green-400" />
                    <div className="flex flex-col">
                      <span className="text-green-400 font-medium">File uploaded successfully!</span>
                      <span className="text-sm text-gray-400">{file.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setStep('upload');
                    }}
                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="w-full max-w-2xl bg-[#1a1f35] rounded-lg p-4 mb-6">
                  {preview ? (
                    <iframe
                      src={preview}
                      className="w-full h-[600px] rounded-lg bg-white"
                      title="Resume Preview"
                    />
                  ) : (
                    <div className="w-full h-[600px] rounded-lg bg-white/5 flex flex-col items-center justify-center">
                      <FileText className="w-24 h-24 text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium text-gray-300 mb-2">Word Document</h3>
                      <p className="text-sm text-gray-400 mb-4">Preview not available for Word documents</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </div>
                    </div>
                  )}
                </div>

                <MagicButton onClick={() => setStep('form')}>
                  Continue to Analysis
                  <CheckCircle2 className="w-5 h-5" />
                </MagicButton>
              </div>
            </MagicCard>
          )}

          {step === 'form' && (
            <MagicCard disableHover>
              <h2 className="text-2xl font-semibold text-white mb-6">Additional Information</h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="e.g. Software Engineer, Product Manager"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-300">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-300">
                    Key Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="e.g. React, Node.js, AWS"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-300">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select an industry</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <MagicButton type="submit" fullWidth disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      Analyzing Resume...
                      <span className="ml-2 animate-spin">⚡</span>
                    </>
                  ) : (
                    <>
                      Analyze Resume
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </MagicButton>
              </form>
            </MagicCard>
          )}

          {step === 'analysis' && analysisResult && (
            <ATSAnalysisSection 
              {...analysisResult} 
              jobTitle={formData.jobTitle}
              disableHover 
            />
          )}
        </motion.div>
      </div>
    </main>
  );
} 