'use client';

interface PDFViewerProps {
  url: string | null;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  if (!url) {
    return (
      <div className="relative h-[600px] border border-white/10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
        <p className="text-zinc-500">No PDF preview available</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] border border-white/10 rounded-xl overflow-hidden bg-white/5">
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">
            Unable to display PDF. <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Open in new tab</a>
          </p>
        </div>
      </object>
    </div>
  );
} 