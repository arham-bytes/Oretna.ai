import React from 'react';
import type { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Sign Up — Oretna',
  description: 'Create your Oretna account and start exploring ideas, discovering research, and connecting the dots.',
};

export default function SignupPage() {
  return <AuthCard initialMode="signup" />;
}
