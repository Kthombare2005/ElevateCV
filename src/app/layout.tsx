import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElevateCV - Transform Your Resume with AI",
  description: "Create a stunning resume portfolio with AI-powered analysis, ATS optimization, and personalized feedback. Stand out from the crowd and land your dream job.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-white to-purple-50/50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
