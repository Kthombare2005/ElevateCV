import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/lib/auth/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElevateCV - AI-Powered Resume Analysis",
  description: "Transform your resume with AI-powered insights and optimization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-white to-purple-50/50 antialiased`}>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
