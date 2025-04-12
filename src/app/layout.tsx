import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { ClerkProvider } from '@clerk/nextjs';
import UserButtonClient from "@/components/auth/UserButtonClient";

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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 transition-colors',
          footerActionLink: 'text-purple-600 hover:text-purple-700',
          card: 'bg-white shadow-xl rounded-xl',
        },
        variables: {
          colorPrimary: '#9333ea',
          colorTextOnPrimaryBackground: 'white',
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/analyze"
      afterSignUpUrl="/analyze"
    >
      <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} min-h-screen bg-gradient-to-b from-white to-purple-50/50 antialiased`}>
          <UserButtonClient />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
