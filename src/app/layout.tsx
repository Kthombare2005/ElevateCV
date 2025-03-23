import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/lib/auth/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElevateCV - AI Resume Analysis",
  description: "Analyze and improve your resume with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A1F] min-h-screen text-white antialiased`}>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
