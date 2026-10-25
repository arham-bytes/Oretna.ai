'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KaetleLogo from '@/components/KaetleLogo';

interface AuthCardProps {
  initialMode: 'login' | 'signup' | 'forgot' | 'reset';
  resetToken?: string;
}

export default function AuthCard({ initialMode, resetToken }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(initialMode);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // If in reset mode, verify token on mount
  useEffect(() => {
    if (mode === 'reset' && resetToken) {
      fetch(`/api/auth/verify-reset-token?token=${resetToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setTokenValid(true);
            if (data.email) setEmail(data.email);
          } else {
            setTokenValid(false);
            setError(data.error || 'This reset link has expired or is invalid.');
          }
        })
        .catch(() => {
          setTokenValid(false);
          setError('Failed to verify reset link.');
        });
    }
  }, [mode, resetToken]);

  // Validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordValid = hasMinLength && hasNumber && hasSpecial;

  // Background switches depending on mode
  const bgImage =
    mode === 'login' || mode === 'forgot'
      ? '/images/auth-bg-login.jpg'
      : '/images/auth-bg-signup.jpg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);

    // Validation checks for Signup and Reset
    if (mode === 'signup' || mode === 'reset') {
      if (!hasMinLength) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!hasNumber) {
        setError('Password must contain at least one number (0-9).');
        return;
      }
      if (!hasSpecial) {
        setError('Password must contain at least one special character (e.g. !@#$%^&*).');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        const destination = data.redirectTo || (data.surveyCompleted ? '/onboarding/thank-you' : '/onboarding/survey');
        router.push(destination);
      } else if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid credentials');
        }
        const destination = data.redirectTo || (data.surveyCompleted ? '/onboarding/thank-you' : '/onboarding/survey');
        router.push(destination);
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to request password reset');
        }
        setSuccessMessage(data.message || 'If that email address is registered, we have sent a reset link.');
        if (data.previewUrl) {
          setDevResetUrl(data.previewUrl);
        }
      } else if (mode === 'reset') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, password, confirmPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to reset password');
        }
        setSuccessMessage('Password reset successfully! Redirecting to login in 2 seconds...');
        setTimeout(() => {
          handleToggleMode('login');
        }, 2200);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);
    window.history.replaceState(null, '', `/${newMode === 'forgot' ? 'forgot-password' : newMode}`);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 sm:p-7 md:p-8 bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Central Large Crisp White Frame with Thin Uniform Border Frame */}
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] sm:min-h-[calc(100vh-64px)] bg-white rounded-none sm:rounded-[2px] shadow-none px-6 py-10 sm:px-12 flex flex-col justify-center items-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity mb-5 sm:mb-6">
          <KaetleLogo size={24} />
        </Link>

        {/* Dynamic Headline based on mode */}
        <h1 className="font-serif text-[38px] sm:text-[44px] md:text-[50px] font-normal leading-[1.08] text-[#1E1E1E] text-center tracking-[-0.015em]">
          {mode === 'forgot' ? (
            <>Reset your<br />password.</>
          ) : mode === 'reset' ? (
            <>Choose a new<br />password.</>
          ) : (
            <>Curiosity looks<br />good on you.</>
          )}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="mt-3 text-[13.5px] sm:text-[14.5px] text-[#555558] max-w-sm mx-auto text-center leading-relaxed font-normal">
          {mode === 'forgot' ? (
            'Enter your registered email address and we will send you a secure link to reset your password.'
          ) : mode === 'reset' ? (
            'Enter a strong new password below to regain access to your Oretna account.'
          ) : (
            <>
              Create your account and start exploring ideas,
              <br className="hidden sm:inline" />
              {' '}discovering research, and connecting the dots.
            </>
          )}
        </p>

        {/* Segmented Switcher (Visible in Login & Signup modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="bg-[#242426] p-[2.5px] rounded-full inline-flex items-center mx-auto my-5 shadow-xs">
            <button
              type="button"
              onClick={() => handleToggleMode('login')}
              className={`px-5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1E1E1E] shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('signup')}
              className={`px-5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1E1E1E] shadow-sm font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto mt-2">
          {/* Hairline Divider above Email in Login mode */}
          {mode === 'login' && (
            <div className="h-[1px] w-full bg-[#EAE6DF] mb-5" />
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center leading-relaxed">
              <div className="font-semibold mb-1">Check your inbox</div>
              {successMessage}
              {devResetUrl && (
                <div className="mt-2 pt-2 border-t border-emerald-200">
                  <span className="text-[11px] text-emerald-700 block mb-1">Dev test shortcut:</span>
                  <Link
                    href={devResetUrl}
                    className="inline-block text-[11px] font-medium text-emerald-900 bg-white px-2.5 py-1 rounded border border-emerald-300 hover:bg-emerald-50"
                  >
                    Open Reset Link →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">
              {error}
            </div>
          )}

          {/* Reset Token Invalid State */}
          {mode === 'reset' && tokenValid === false && (
            <div className="text-center py-4">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center px-6 py-2 rounded-full text-xs font-medium bg-[#242426] text-white hover:bg-black"
              >
                Request a new link
              </Link>
            </div>
          )}

          {/* Form */}
          {!(mode === 'reset' && tokenValid === false) && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* First Name & Last Name (Sign Up only) */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-normal text-[#555558] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full rounded-lg border border-[#E2DDD5] px-3.5 py-2 text-xs outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder-[#B5B0A8] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-[#555558] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full rounded-lg border border-[#E2DDD5] px-3.5 py-2 text-xs outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder-[#B5B0A8] bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email field (Sign Up, Login, Forgot) */}
              {mode !== 'reset' && (
                <div>
                  <label className="block text-xs font-normal text-[#555558] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-lg border border-[#E2DDD5] px-3.5 py-2 text-xs outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder-[#B5B0A8] bg-white transition-colors"
                  />
                </div>
              )}

              {/* Password field (Sign Up, Login, Reset) */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-normal text-[#555558]">
                      {mode === 'reset' ? 'New Password' : 'Password'}
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleToggleMode('forgot')}
                        className="text-[11px] text-[#77777A] hover:text-[#1E1E1E] transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? '' : '••••••••'}
                      className="w-full rounded-lg border border-[#E2DDD5] pl-3.5 pr-9 py-2 text-xs outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder-[#B5B0A8] bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8B85] hover:text-[#1E1E1E] transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password field (Sign Up & Reset only) */}
              {(mode === 'signup' || mode === 'reset') && (
                <div>
                  <label className="block text-xs font-normal text-[#555558] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#E2DDD5] pl-3.5 pr-9 py-2 text-xs outline-none focus:border-[#1E1E1E] text-[#1E1E1E] placeholder-[#B5B0A8] bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8B85] hover:text-[#1E1E1E] transition-colors p-1"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Password Requirements Checklist (Sign Up & Reset) */}
              {(mode === 'signup' || mode === 'reset') && (
                <div className="bg-[#FAF9F5] border border-[#ECE8E1] rounded-lg p-3 text-[11px] space-y-1.5 transition-all">
                  <div className="text-[#6B6964] font-medium mb-1">Password must include:</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-[#8E8B85]'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EAE6DF] text-[#8E8B85]'}`}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-700 font-medium' : 'text-[#8E8B85]'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EAE6DF] text-[#8E8B85]'}`}>
                        {hasNumber ? '✓' : '•'}
                      </span>
                      1 number (0-9)
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${hasSpecial ? 'text-emerald-700 font-medium' : 'text-[#8E8B85]'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasSpecial ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EAE6DF] text-[#8E8B85]'}`}>
                        {hasSpecial ? '✓' : '•'}
                      </span>
                      1 special char (!@#$)
                    </div>
                    <div className={`flex items-center gap-1.5 transition-colors ${passwordsMatch ? 'text-emerald-700 font-medium' : 'text-[#8E8B85]'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passwordsMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EAE6DF] text-[#8E8B85]'}`}>
                        {passwordsMatch ? '✓' : '•'}
                      </span>
                      Passwords match
                    </div>
                  </div>
                </div>
              )}

              {/* Centered Pill Action Button */}
              <div className="pt-3 text-center">
                <button
                  type="submit"
                  disabled={loading || (mode === 'signup' && (!isPasswordValid || !passwordsMatch))}
                  className="inline-flex items-center justify-center px-8 py-2 rounded-full text-xs font-medium bg-[#242426] hover:bg-[#151516] text-white transition-all shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'signup'
                    ? 'Create Account'
                    : mode === 'forgot'
                    ? 'Send Reset Link'
                    : mode === 'reset'
                    ? 'Update Password'
                    : 'Log in'}
                </button>
              </div>

              {/* Back to Login link if in forgot or reset mode */}
              {(mode === 'forgot' || mode === 'reset') && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleMode('login')}
                    className="text-xs text-[#77777A] hover:text-[#1E1E1E] transition-colors inline-flex items-center gap-1"
                  >
                    ← Back to Log In
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
