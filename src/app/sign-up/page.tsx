'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createUser } from '@/lib/firebase';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    general: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validate phone number
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, phoneNumber: numericValue }));
        setErrors(prev => ({
          ...prev,
          phoneNumber: numericValue.length === 10 ? '' : 'Phone number must be 10 digits'
        }));
      }
    }

    // Validate email
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: value.includes('@') ? '' : 'Email must contain @'
      }));
    }

    // Validate password match
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      } else if (name === 'password' && value !== formData.confirmPassword && formData.confirmPassword) {
        setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', phoneNumber: '', password: '', general: '' });

    // Validate form
    if (!formData.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Email must contain @' }));
      setIsLoading(false);
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 10 digits' }));
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      setIsLoading(false);
      return;
    }

    try {
      const result = await createUser(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      if (result.success) {
        router.push('/sign-in?message=Account created successfully! Please sign in.');
      } else {
        if (result.error.includes('already exists')) {
          setErrors(prev => ({
            ...prev,
            general: (
              <div className="flex flex-col space-y-2">
                <span>{result.error}</span>
                <button
                  type="button"
                  onClick={() => router.push('/sign-in')}
                  className="text-blue-500 hover:text-blue-400 underline text-sm"
                >
                  Click here to sign in
                </button>
              </div>
            ) as unknown as string
          }));
        } else {
          setErrors(prev => ({ ...prev, general: result.error }));
        }
      }
    } catch (error: any) {
      setErrors(prev => ({ ...prev, general: error.message || 'An error occurred during sign up' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a0b14] via-[#121629] to-[#0a0b14]">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full animate-slow-spin opacity-20">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full animate-slow-spin-reverse opacity-20">
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="w-full max-w-md p-4 relative z-10">
        <div className="w-full bg-[#131620]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400">Get started with your free account</p>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-white/10 bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50"
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-white/10 bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-white/10'} bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50`}
                placeholder="john.doe@example.com"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-white/10 bg-[#1c1f2e] px-3 text-gray-300 sm:text-sm">
                  +91
                </span>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full rounded-none rounded-r-md border ${errors.phoneNumber ? 'border-red-500' : 'border-white/10'} bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50`}
                  placeholder="1234567890"
                  required
                />
              </div>
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-white/10'} bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50 pr-10`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-white/10'} bg-[#1c1f2e] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/50 pr-10`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-[#1c1f2e] text-blue-600 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/terms')}
                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/privacy')}
                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#131620] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/sign-in')}
              className="font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-32 right-20 w-4 h-4 bg-blue-500/20 rounded-full blur-sm animate-float"></div>
      <div className="absolute bottom-32 left-20 w-6 h-6 bg-purple-500/20 rounded-full blur-sm animate-float-delayed"></div>
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-500/20 rounded-full blur-sm animate-float"></div>
    </div>
  );
} 