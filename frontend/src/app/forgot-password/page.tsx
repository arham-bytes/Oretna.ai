import React from 'react';
import type { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Forgot Password — Oretna',
  description: 'Reset your Oretna account password.',
};

export default function ForgotPasswordPage() {
  return <AuthCard initialMode="forgot" />;
}
