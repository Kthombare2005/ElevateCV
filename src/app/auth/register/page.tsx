"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { MagicContainer } from "@/components/ui/magic-container";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signup, signupWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s-]{2,30}$/;
    return nameRegex.test(name);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (name: keyof SignupFormData, value: string): string => {
    switch (name) {
      case "firstName":
      case "lastName":
        return validateName(value) ? "" : "Name should only contain letters, spaces, or hyphens (2-30 characters)";
      
      case "email":
        return validateEmail(value) ? "" : "Please enter a valid email address";
      
      case "password":
        return validatePassword(value) 
          ? "" 
          : "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      
      case "confirmPassword":
        return value === formData.password ? "" : "Passwords do not match";
      
      case "phoneNumber":
        return validatePhone(value) ? "" : "Please enter a valid 10-digit phone number";
      
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and limit to 10 characters
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof SignupFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.phoneNumber,
        jobTitle: "",
        industry: "",
        experienceLevel: ""
      });
      
      setSuccessMessage("Account created successfully! Please sign in to access the resume analyzer.");
      
      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
      });
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use" || err.message === "auth/email-already-exists") {
        setGeneralError("An account with this email already exists. Please sign in to access the resume analyzer.");
        // Clear the form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: ""
        });
        
        // Delay redirect to sign in page
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        setGeneralError(err.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGeneralError("");
    setSuccessMessage("");
    setGoogleLoading(true);
    
    try {
      await signupWithGoogle();
      setSuccessMessage("Account created successfully! Please sign in to access the resume analyzer.");
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (err: any) {
      console.error("Google signup error:", err);
      
      // Handle specific error cases
      if (err.code === "auth/popup-closed-by-user") {
        setGeneralError("Sign in was cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setGeneralError("Pop-up was blocked by your browser. Please enable pop-ups for this site.");
      } else if (err.code === "auth/account-exists-with-different-credential" || err.message === "auth/email-already-exists") {
        setGeneralError("An account already exists with this email. Please sign in to access the resume analyzer.");
        // Delay redirect to sign in page
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else if (err.message === "Failed to create user profile") {
        setGeneralError("Failed to create your profile. Please try again.");
      } else {
        setGeneralError(err.message || "Failed to sign up with Google. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <MagicContainer className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[720px] backdrop-blur-xl px-4 sm:px-6 md:px-8 py-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Create Your Account
            </h1>
            <p className="text-sm text-zinc-400">
              Join us to start analyzing your resume and boost your career
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-sm text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="relative w-full flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 font-medium text-white transition-all duration-200 
                     hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                     disabled:cursor-not-allowed disabled:opacity-50 border border-white/10"
          >
            {googleLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing up with Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-zinc-400 bg-[#0A0A1F]">Or continue with email</span>
            </div>
          </div>

          {/* General Error Message */}
          {generalError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs text-red-500">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-sm sm:text-base font-semibold text-white">Personal Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>First Name</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] px-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Last Name</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] px-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>Email address</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] px-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <span>Phone Number</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-zinc-400">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] pl-12 pr-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700"
                      placeholder="1234567890"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security Section */}
            <div className="space-y-4">
              <h2 className="text-sm sm:text-base font-semibold text-white">Account Security</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-zinc-400" />
                    <span>Password</span>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] px-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700 pr-10"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-zinc-400" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-[#0A0A1F] px-4 py-2.5 text-white placeholder-zinc-500
                               border border-zinc-800/60 outline-none transition-all duration-200
                               focus:border-blue-500/50 focus:bg-[#0A0A1F]/50 focus:ring-2 focus:ring-blue-500/20
                               group-hover:border-zinc-700 pr-10"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-all duration-200 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 
                       disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link 
              href="/auth" 
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </MagicContainer>
    </div>
  );
} 