import React from 'react';
import type { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Log In — Oretna',
  description: 'Log into your Oretna research workspace and continue your inquiry.',
};

export default function LoginPage() {
  return <AuthCard initialMode="login" />;
}
