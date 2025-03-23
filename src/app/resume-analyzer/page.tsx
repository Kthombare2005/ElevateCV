"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileText, Loader2, Sparkles, User, LogOut, ChevronLeft } from "lucide-react";
import { MagicContainer } from "@/components/ui/magic-container";
import { useAuth } from "@/lib/auth/AuthContext";
import PDFViewer from "@/components/PDFViewer";

interface AdditionalDetails {
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  skills: string[];
  jobDescription: string;
}

interface AnalysisResponse {
  message: string;
  analysisId: string;
  analysis: {
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
    file: {
      name: string;
      size: number;
      type: string;
    };
  };
}

type FormStep = 'upload' | 'details' | 'preview';

export default function ResumeAnalyzerPage() {
  const { user, signout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<FormStep>('upload');
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>({
    jobTitle: '',
    industry: '',
    experienceLevel: '',
    skills: [],
    jobDescription: '',
  });
  const [newSkill, setNewSkill] = useState('');

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user, router]);

  // Get user's initial letter and background color
  const getInitialAndColor = () => {
    let initial = "U";
    
    if (user?.displayName) {
      const firstName = user.displayName.split(" ")[0];
      initial = firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      initial = user.email.charAt(0).toUpperCase();
    }

    const colors = [
      "bg-[#E84435]", // Red
      "bg-[#2D9D3B]", // Green
      "bg-[#3B84C5]", // Blue
      "bg-[#F4B400]", // Yellow
      "bg-[#7B1FA2]", // Purple
    ];

    const colorIndex = initial.charCodeAt(0) % colors.length;
    return { initial, color: colors[colorIndex] };
  };

  const handleSignOut = async () => {
    try {
      await signout();
      router.replace("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // If not authenticated, show nothing while redirecting
  if (!user) {
    return null;
  }

  const { initial, color } = getInitialAndColor();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);
    setFormStep('details'); // Transition to details step after file selection
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Validate file type
    if (droppedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (5MB)
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setError("");
    setFile(droppedFile);
    setFormStep('details'); // Transition to details step after file drop
  };

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      // Prevent default form submission
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      
      // Clear previous states
      setError("");
      setSuccess("");

      // Debug logging
      console.log("Form submission started");
      console.log("File:", file);
      console.log("User:", user);
      console.log("Additional Details:", additionalDetails);

      // Validate required fields
      if (!file) {
        setError("Please upload a resume file");
        return;
      }

      if (!user) {
        setError("Please sign in to continue");
        return;
      }

      if (loading) {
        console.log("Already loading, preventing duplicate submission");
        return;
      }

      // Validate form fields
      const requiredFields = {
        jobTitle: additionalDetails.jobTitle,
        industry: additionalDetails.industry,
        experienceLevel: additionalDetails.experienceLevel,
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value?.trim())
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        const errorMsg = `Please fill in: ${emptyFields.join(", ")}`;
        console.log("Validation error:", errorMsg);
        setError(errorMsg);
        return;
      }

      if (!additionalDetails.skills || additionalDetails.skills.length === 0) {
        setError("Please add at least one skill");
        return;
      }

      // Set loading state
      setLoading(true);
      console.log("Setting loading state");

      // Create form data
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", user.uid);

      // Create a clean copy of additionalDetails
      const detailsToSend = {
        jobTitle: additionalDetails.jobTitle.trim(),
        industry: additionalDetails.industry.trim(),
        experienceLevel: additionalDetails.experienceLevel,
        skills: [...additionalDetails.skills],
        jobDescription: additionalDetails.jobDescription?.trim() || ""
      };

      formData.append("additionalDetails", JSON.stringify(detailsToSend));

      console.log("Making API call");
      
      // Make the API call with credentials
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        credentials: 'include',
        body: formData
      });

      console.log("API Response status:", response.status);
      const data = await response.json();
      console.log("API Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      // Store the analysis result
      const analysisId = data.analysisId || user.uid;
      const analysisData = JSON.stringify(data.analysis);
      console.log("Storing analysis data:", { analysisId, analysisData });
      
      sessionStorage.setItem(
        `resume-analysis-${analysisId}`,
        analysisData
      );

      // Show success message
      setSuccess("Analysis completed successfully!");
      console.log("Analysis completed");

      // Navigate to results page
      console.log("Navigating to results page");
      window.location.href = `/resume-analyzer/results/${analysisId}`;

    } catch (error: any) {
      console.error("Form submission error:", error);
      setError(error.message || "Failed to analyze resume");
    } finally {
      console.log("Resetting loading state");
      setLoading(false);
    }
  };

  // Update preview URL when file changes
  useEffect(() => {
    let url: string | null = null;
    
    if (file) {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  // Add cleanup when unmounting
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Add a cleanup effect for the loading state
  useEffect(() => {
    return () => {
      if (loading) {
        setLoading(false);
      }
    };
  }, [loading]);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 overflow-hidden bg-[#0A0A1F]">
      {/* Profile Avatar */}
      <div className="fixed top-4 right-4 z-50">
        <div className="group relative">
          <div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0A0A1F]/80 backdrop-blur-lg border border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full ${!user?.photoURL ? color : ''} flex items-center justify-center text-center overflow-hidden`}>
              {user?.photoURL ? (
                <img 
                  src={user.photoURL}
                  alt={initial}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, show initial instead
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add(color);
                  }}
                />
              ) : (
                <span className="text-[18px] font-medium text-white select-none leading-none">
                  {initial}
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-zinc-400">{user?.email}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-[#0A0A1F]/95 backdrop-blur-lg rounded-xl border border-white/5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[#0A0A1F]">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <MagicContainer className="relative w-full max-w-[1200px] backdrop-blur-xl bg-[#0A0A1F]/50 px-8 py-10 z-10 border border-white/5">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Resume Analysis
                </span>
              </h1>
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto">
              Upload your resume and let our AI analyze it for insights, skills assessment, and improvement suggestions
            </p>
          </div>

          {/* Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Box */}
            <div className={`space-y-4 ${formStep === 'details' && 'hidden lg:block'}`}>
              <h2 className="text-xl font-semibold text-white mb-4">Upload Resume</h2>
              {!file ? (
                <div
                  className={`relative group border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer
                    ${isDragging
                      ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                      : "border-zinc-700/50 hover:border-zinc-600/50 hover:scale-[1.01]"
                    }
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
                    before:rounded-xl before:opacity-0 before:transition-opacity before:duration-500
                    hover:before:opacity-100`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf"
                    className="hidden"
                  />

                  <div className="relative space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white/5 rounded-full">
                        <Upload className="w-10 h-10 text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-base text-zinc-300">
                        Drag and drop your resume here, or click anywhere to upload
                      </p>
                      <p className="text-sm text-zinc-500">
                        Supported format: PDF (Max size: 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Header */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-zinc-200">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* <a
                        href={previewUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Open in New Tab
                      </a> */}
                      <button
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                          setFormStep('upload');
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-zinc-400 hover:text-white" />
                      </button>
                    </div>
                  </div>

                  {/* PDF Preview */}
                  <PDFViewer url={previewUrl} />

                  {/* Continue Button - Only show on small screens when not in details step */}
                  <div className="block lg:hidden">
                    <button
                      onClick={() => setFormStep('details')}
                      className="w-full relative group flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                              p-[1px] font-medium text-white transition-all duration-300
                              hover:shadow-[0_0_2rem_-0.5rem_#3b82f6]"
                    >
                      <span className="block w-full bg-[#0A0A1F] rounded-lg py-2.5 px-4 transition-all duration-300 group-hover:bg-opacity-90">
                        Continue to Details
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Helper Text - Only show when no file is selected */}
              {!file && (
                <p className="text-center text-sm text-zinc-500 mt-4">
                  Your resume will be analyzed for skills, experience, and potential improvements
                </p>
              )}
            </div>

            {/* Details Form Box */}
            <div className={`space-y-6 ${formStep === 'details' ? 'block' : 'hidden lg:block'}`}>
              {/* Back Button - Only show on small screens */}
              <div className="flex items-center gap-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => setFormStep('upload')}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Upload
                </button>
              </div>

              <h2 className="text-xl font-semibold text-white">Additional Details</h2>
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Job Title or Role Applied For
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      placeholder="e.g., Software Engineer, Data Analyst"
                      value={additionalDetails.jobTitle}
                      onChange={(e) => setAdditionalDetails(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                      disabled={!file}
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Industry/Domain
                    </label>
                    <input
                      type="text"
                      id="industry"
                      placeholder="e.g., Tech, Finance, Healthcare"
                      value={additionalDetails.industry}
                      onChange={(e) => setAdditionalDetails(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                      disabled={!file}
                    />
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      value={additionalDetails.experienceLevel}
                      onChange={(e) => setAdditionalDetails(prev => ({ ...prev, experienceLevel: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                      disabled={!file}
                    >
                      <option value="" disabled>Select experience level</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="4-6 years">4-6 years</option>
                      <option value="7+ years">7+ years</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Key Skills to Highlight
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="skills"
                          placeholder="e.g., React"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSkill.trim()) {
                              e.preventDefault();
                              if (!additionalDetails.skills.includes(newSkill.trim())) {
                                setAdditionalDetails(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, newSkill.trim()]
                                }));
                              }
                              setNewSkill('');
                            }
                          }}
                          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          disabled={!file}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newSkill.trim() && !additionalDetails.skills.includes(newSkill.trim())) {
                              setAdditionalDetails(prev => ({
                                ...prev,
                                skills: [...prev.skills, newSkill.trim()]
                              }));
                              setNewSkill('');
                            }
                          }}
                          disabled={!file || !newSkill.trim()}
                          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2">
                        {additionalDetails.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="group flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full border border-white/10"
                          >
                            <span className="text-sm text-zinc-300">{skill}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setAdditionalDetails(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== index)
                                }));
                              }}
                              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/10"
                            >
                              <X className="w-3 h-3 text-zinc-400 group-hover:text-white" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {additionalDetails.skills.length === 0 && (
                        <p className="text-sm text-zinc-500">
                          Add your key skills one by one (e.g., React, Python, Data Science)
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Job Description (Optional)
                    </label>
                    <textarea
                      id="jobDescription"
                      placeholder="Paste the job description here for better matching..."
                      value={additionalDetails.jobDescription}
                      onChange={(e) => setAdditionalDetails(prev => ({ ...prev, jobDescription: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                      disabled={!file}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!file}
                  className="w-full relative group flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                           p-[1px] font-medium text-white transition-all duration-300
                           hover:shadow-[0_0_2rem_-0.5rem_#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="block w-full bg-[#0A0A1F] rounded-lg py-2.5 px-4 transition-all duration-300 group-hover:bg-opacity-90">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Analyze Resume'
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="animate-slideIn rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {success && (
            <div className="animate-slideIn rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {success}
            </div>
          )}
        </div>
      </MagicContainer>
    </div>
  );
}