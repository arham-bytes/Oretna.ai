import type { Metadata } from 'next';
import { Inter, PT_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Oretna — Every question opens a world of ideas',
  description: 'Explore the unfamiliar. Follow the evidence. Discover connections you never knew existed.',
  icons: {
    icon: [
      { url: '/favicon.svg?v=oretna1', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=oretna1', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=oretna1', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=oretna1', sizes: 'any' },
    ],
    shortcut: '/favicon.ico?v=oretna1',
    apple: '/apple-icon.png?v=oretna1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg?v=oretna1" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png?v=oretna1" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon.ico?v=oretna1" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=oretna1" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=oretna1" />
      </head>
      <body className="min-h-full w-full bg-[#FFFFFF] text-[#262628] font-sans selection:bg-[#DDF2FD] selection:text-[#18181B]">
        {children}
      </body>
    </html>
  );
}
