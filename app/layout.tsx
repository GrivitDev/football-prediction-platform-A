import type { Metadata } from 'next';

import './globals.css';

import QueryProvider from '@/providers/query-provider';

import {
  AuthProvider,
} from '@/providers/auth-provider';

import { SEO } from '@/config/seo';
import { ThemeProvider } from '@/providers/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL(
    SEO.url,
  ),

  title: {
    default: SEO.title,

    template:
      `%s | ${SEO.title}`,
  },

  description:
    SEO.description,

  keywords: SEO.keywords,

  openGraph: {
    title: SEO.title,

    description:
      SEO.description,

    url: SEO.url,

    siteName: SEO.title,

    images: [
      {
        url: SEO.image,

        width: 1200,

        height: 630,
      },
    ],

    locale: 'en_US',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title: SEO.title,

    description:
      SEO.description,

    images: [SEO.image],
  },

  applicationName:
  'Sure Predict Pro',

appleWebApp: {
  capable: true,

  statusBarStyle:
    'black-translucent',

  title:
    'Sure Predict Pro',
},

formatDetection: {
  telephone: false,
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
>
      <body className="bg-slate-950">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
            {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}