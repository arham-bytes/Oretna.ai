'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OretnaLogo from '@/components/OretnaLogo';

export default function ThankYouPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch('/api/survey/status');
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login');
          return;
        }
        if (!data.surveyCompleted) {
          router.replace('/onboarding/survey');
          return;
        }
        setVerified(true);
        setLoading(false);
      } catch {
        router.replace('/onboarding/survey');
      }
    }
    verify();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F5] text-[#262628] select-none">
        <OretnaLogo size={28} />
        <div className="mt-4 flex items-center gap-2 text-xs text-[#78736B]">
          <div className="w-4 h-4 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin" />
          <span>Verifying submission...</span>
        </div>
      </div>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 sm:p-7 md:p-8 bg-cover bg-center select-none"
      style={{ backgroundImage: `url('/images/auth-bg-signup.jpg')` }}
    >
      <div className="w-full max-w-[1480px] min-h-[calc(100vh-48px)] sm:min-h-[calc(100vh-64px)] bg-white rounded-none sm:rounded-[2px] shadow-none px-6 py-12 sm:px-12 flex flex-col justify-between items-center relative">
        <div className="w-full flex items-center justify-between max-w-xl mx-auto">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <OretnaLogo size={24} />
          </Link>
          <Link
            href="/"
            className="text-xs text-[#8E8B85] hover:text-[#1E1E1E] transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto text-center py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
            Early Access Spot Reserved
          </div>

          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold mb-6">
            ✓
          </div>

          <h1 className="font-serif text-[34px] sm:text-[42px] font-normal leading-[1.12] text-[#1E1E1E] tracking-[-0.015em]">
            Thank you for helping us build Oretna.ai!
          </h1>

          <p className="mt-4 text-[14px] text-[#555558] max-w-sm mx-auto leading-relaxed font-normal">
            Your survey response has been recorded. We appreciate your valuable feedback.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-[#FAF9F5] border border-[#E9E4DC] text-left">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">🔒</span>
              <div>
                <h4 className="text-xs font-semibold text-[#1E1E1E]">Private Pre-Launch Phase</h4>
                <p className="text-[11.5px] text-[#6B6964] mt-1 leading-relaxed">
                  The AI research assistant is currently in private pre-launch while we finalize features. You will be among the first to receive access when public testing begins.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-xs sm:text-sm font-medium bg-[#242426] hover:bg-[#151516] text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Back to Oretna.ai Home
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-[#A19D94] py-2">
          &copy; 2026 Oretna.ai. All rights reserved.
        </div>
      </div>
    </div>
  );
}
