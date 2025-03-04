import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElevateCV - AI-Powered Resume Builder",
  description: "Transform your resume with AI-powered optimization and get more interviews.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-white to-purple-50/50 antialiased`}>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
