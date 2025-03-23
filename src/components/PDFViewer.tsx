"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import PDF viewer components
const PDFViewerComponent = dynamic(
  () => import('@react-pdf-viewer/core').then(mod => mod.Viewer),
  { ssr: false }
);

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFViewerProps {
  url: string | null;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!url) {
    return (
      <div className="w-full aspect-[1/1.4] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <p className="text-sm text-zinc-500">No PDF selected</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="w-full aspect-[1/1.4] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading viewer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[1/1.4] rounded-lg bg-white/5 border border-white/10 overflow-hidden">
      <PDFViewerComponent fileUrl={url} />
    </div>
  );
} 