'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OretnaLogo from '@/components/OretnaLogo';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdQJHsNInFAbJkEI8EpuGMJtXOjgS1WGAJpINqlNQDY1O5pKw/viewform';

interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function OnboardingSurveyPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasOpenedForm, setHasOpenedForm] = useState(false);

  // Check auth and initial survey status
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch('/api/survey/status');
        if (res.status === 401) {
          router.replace('/login?redirect=/onboarding/survey');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login?redirect=/onboarding/survey');
          return;
        }

        if (isMounted) {
          setUser(data.user);
          if (data.surveyCompleted) {
            setSurveyCompleted(true);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setStatusMessage('Unable to reach server. Please check your connection.');
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Check if survey has been verified by backend
  const checkVerification = async () => {
    setCheckingStatus(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/survey/status');
      const data = await res.json();

      if (data.surveyCompleted) {
        setSurveyCompleted(true);
        setStatusMessage('✓ Your survey response has been verified! You now have access.');
      } else {
        setStatusMessage(
          'Verification pending: We have not received your Google Form submission yet. Please ensure you submitted the form using ' +
            (user?.email || 'your account email') +
            ' and try again in a few moments.'
        );
      }
    } catch {
      setStatusMessage('Verification check failed. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleOpenForm = () => {
    setHasOpenedForm(true);
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F5] text-[#262628] select-none">
        <OretnaLogo size={28} />
        <div className="mt-4 flex items-center gap-2 text-xs text-[#78736B]">
          <div className="w-4 h-4 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin" />
          <span>Loading onboarding...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 sm:p-7 md:p-8 bg-cover bg-center select-none"
      style={{ backgroundImage: `url('/images/auth-bg-signup.jpg')` }}
    >
      {/* Central Large Crisp White Frame with Thin Uniform Border */}
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] sm:min-h-[calc(100vh-64px)] bg-white rounded-none sm:rounded-[2px] shadow-none px-6 py-12 sm:px-12 flex flex-col justify-between items-center relative">
        {/* Top Bar with Logo & Logout */}
        <div className="w-full flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <OretnaLogo size={24} />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-[#8E8B85] hover:text-[#1E1E1E] transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Central Card Content */}
        <div className="w-full max-w-xl mx-auto text-center py-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F1EA] text-[#555558] text-[11px] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E1E] animate-pulse" />
            Pre-Launch Early Access Program
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[38px] sm:text-[46px] md:text-[52px] font-normal leading-[1.08] text-[#1E1E1E] tracking-[-0.015em]">
            Help Us Build
            <br />
            Oretna.ai
          </h1>

          {/* Short description */}
          <p className="mt-4 text-[14px] sm:text-[15px] text-[#555558] max-w-md mx-auto leading-relaxed font-normal">
            We are collecting feedback to prioritise features for our AI research assistant. Please complete the quick survey to unlock your early-access workspace.
          </p>

          {/* Signed-in Account Info Box */}
          {user && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#ECE8E1] text-xs text-[#555558]">
              <span>Signed in as:</span>
              <strong className="text-[#1E1E1E] font-medium">{user.email}</strong>
            </div>
          )}

          {/* Survey Completion Card */}
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-[#FAF9F5] border border-[#E9E4DC] max-w-lg mx-auto text-left">
            {surveyCompleted ? (
              // Verified Success State (Pre-Launch Priority Access Confirmed)
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#1E1E1E]">
                    Thank you for helping us build Oretna.ai!
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#555558] leading-relaxed">
                    Your response has been verified and your spot on the <strong>Early Access Priority List</strong> is confirmed. Our AI research assistant is currently in private pre-launch — we will email you at <strong className="text-[#1E1E1E]">{user?.email}</strong> the moment access opens.
                  </p>
                </div>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#242426] hover:bg-[#151516] text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Back to Oretna.ai Home
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-medium text-[#6B6964] hover:text-[#1E1E1E] border border-[#DDD7CD] transition-all cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              // Survey Pending State
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E1E1E]">
                      Step 1: Fill out the Google Form
                    </h3>
                    <p className="mt-1 text-xs text-[#6B6964] leading-relaxed">
                      Click below to open our survey in a new tab. Please enter{' '}
                      <span className="font-semibold text-[#1E1E1E]">{user?.email}</span> in the email field.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#ECE8E1] text-[10px] font-medium text-[#6B6964] uppercase tracking-wider shrink-0">
                    Required
                  </span>
                </div>

                {/* Prominent Complete Survey Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-medium bg-[#242426] hover:bg-[#151516] text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Complete Survey on Google Forms</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>

                <div className="h-[1px] w-full bg-[#E5DFD5]" />

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E1E1E]">
                      Step 2: Verify Your Submission
                    </h3>
                    <p className="mt-1 text-xs text-[#6B6964] leading-relaxed">
                      After submitting the Google Form, click below to confirm your response and unlock the application.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={checkVerification}
                    disabled={checkingStatus}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F3EFE9] text-[#1E1E1E] border border-[#DDD7CD] transition-all cursor-pointer disabled:opacity-60"
                  >
                    {checkingStatus ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin" />
                        <span>Checking Google Forms response...</span>
                      </>
                    ) : (
                      <span>Check Verification Status</span>
                    )}
                  </button>
                </div>

                {/* Status or warning alert */}
                {statusMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      statusMessage.startsWith('✓')
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border border-amber-200 text-amber-900'
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mt-6 text-[12px] text-[#8E8B85]">
            Need help? Contact us at{' '}
            <a href="mailto:contact@oretna.ai" className="underline hover:text-[#1E1E1E]">
              contact@oretna.ai
            </a>
          </p>
        </div>

        {/* Bottom copyright footer */}
        <div className="text-[11px] text-[#A19D94] py-2">
          &copy; 2026 Oretna.ai. All rights reserved.
        </div>
      </div>
    </div>
  );
}
