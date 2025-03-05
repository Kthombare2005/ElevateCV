'use client';

import { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, X, Download, Maximize2, Minimize2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { PulsatingButton } from '@/components/ui/pulsating-button';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import TypingAnimation with no SSR
const TypingAnimation = dynamic(() => import('@/components/ui/typing-animation').then(mod => mod.TypingAnimation), {
  ssr: false,
  loading: () => (
    <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 leading-tight tracking-tight">
      Analyze Your Resume
    </div>
  ),
});

// Dynamically import FileViewer to avoid SSR issues
const FileViewer = dynamic(() => import('react-file-viewer'), { ssr: false });

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

const AnalyzePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate file type
  const validateFile = (file: File): boolean => {
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      setFileError('Please upload a PDF or Word document (DOC/DOCX)');
      return false;
    }
    setFileError('');
    return true;
  };

  // Handle file selection
  const handleFileSelection = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setIsLoading(true);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Set file type for the viewer
      const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      setFileType(extension);
      
      // Simulate loading time for preview
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setFileError('');
  };

  // Handle preview errors
  const handlePreviewError = (e: Error) => {
    console.error('Preview failed to load:', e);
    setPreviewUrl(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    // TODO: Implement actual resume analysis logic
    // This is a placeholder for the analysis result
    setTimeout(() => {
      setAnalysis({
        score: 85,
        strengths: [
          "Strong technical skills",
          "Clear work experience",
          "Good education background"
        ],
        improvements: [
          "Add more quantifiable achievements",
          "Include relevant certifications",
          "Optimize for ATS keywords"
        ],
        keywords: [
          "JavaScript",
          "React",
          "Node.js",
          "TypeScript"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar hideGetStarted />
      
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header with animation */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TypingAnimation
              className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 leading-tight tracking-tight"
              duration={50}
              delay={800}
              startOnView={true}
            >
              Analyze Your Resume
            </TypingAnimation>

            <motion.p 
              className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              Upload your resume and get{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
                instant AI-powered
              </span>{' '}
              analysis and optimization suggestions
            </motion.p>
          </motion.div>

          {/* Upload Section with animation */}
          <motion.div 
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 mb-6 group
              ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-102' : 'border-slate-700 hover:border-slate-600'}
              ${file ? 'bg-slate-900/50' : 'bg-slate-900/30 cursor-pointer hover:bg-slate-900/40'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && document.getElementById('file-upload')?.click()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-2 p-4">
                <FileText className="h-8 w-8 text-slate-300" />
                <div className="text-left">
                  <p className="text-slate-300 font-medium">{file.name}</p>
                  <p className="text-slate-500 text-sm">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent div's onClick
                    handleRemoveFile();
                  }}
                  className="ml-4 p-1 rounded-full bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-700/90 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-slate-400 group-hover:text-slate-300 transition-colors" />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-300 font-medium group-hover:text-white transition-colors">
                    Drag and drop your resume here
                  </p>
                  <p className="text-slate-400 text-sm">
                    or click anywhere in this box to{' '}
                    <span className="text-blue-500 hover:text-blue-400">
                      browse
                    </span>
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  <p className="text-slate-500 text-xs">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                  {fileError && (
                    <p className="text-red-500 text-sm mt-2">{fileError}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* File Preview Section with enhanced UI */}
          <AnimatePresence mode="wait">
            {file && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Enhanced Preview Container */}
                <motion.div 
                  className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50 transition-all duration-300
                    ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
                  layoutId="preview-container"
                >
                  {/* Enhanced Header */}
                  <motion.div 
                    className="absolute top-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm p-3 border-b border-slate-700 flex justify-between items-center z-10"
                    layoutId="preview-header"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-slate-300" />
                        <h3 className="text-slate-200 font-medium">Resume Preview</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-xs">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.a
                        href={previewUrl || ''}
                        download={file.name}
                        className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Download</span>
                      </motion.a>
                      <motion.button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/90 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={handleRemoveFile}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/90 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Preview Content with Loading State */}
                  <motion.div 
                    className="mt-12"
                    layoutId="preview-content"
                  >
                    {isLoading ? (
                      <div className="w-full h-[600px] flex items-center justify-center bg-slate-900/50">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-slate-400 text-sm">Loading preview...</p>
                        </div>
                      </div>
                    ) : previewUrl && fileType ? (
                      <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'} bg-white transition-all duration-300`}>
                        {fileType === 'pdf' ? (
                          <iframe
                            src={previewUrl}
                            className="w-full h-full"
                            title="Resume Preview"
                          />
                        ) : (
                          <FileViewer
                            fileType={fileType}
                            filePath={previewUrl}
                            onError={handlePreviewError}
                            errorComponent={() => (
                              <motion.div 
                                className="flex flex-col items-center justify-center h-full bg-slate-100 text-slate-900"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <FileText className="h-16 w-16 text-slate-400 mb-4" />
                                <p className="text-lg font-medium">Preview not available</p>
                                <p className="text-sm text-slate-500">Please download the file to view it</p>
                              </motion.div>
                            )}
                          />
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                </motion.div>

                {/* Analyze Button with animation */}
                <motion.button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <PulsatingButton
                    variant="primary"
                    size="lg"
                    disabled={isAnalyzing}
                    icon={
                      isAnalyzing ? (
                        <Sparkles className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )
                    }
                    pulseColor="#3b82f6"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                  </PulsatingButton>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Results with animations */}
          <AnimatePresence>
            {analysis && (
              <motion.div 
                className="mt-12 space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Score */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Resume Score</h3>
                    <div className="text-2xl font-bold text-blue-500">{analysis.score}%</div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Strengths</h3>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Suggested Improvements</h3>
                  <ul className="space-y-3">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-300">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keywords */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Skills & Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyzePage; 