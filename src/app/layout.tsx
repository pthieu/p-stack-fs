import type { Metadata } from 'next';
import React from 'react';

import { ThemeProvider } from '~/components/theme-provider';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'p-stack-fs',
  description: 'A boilerplate for TypeScript, Next.js, and PostgreSQL',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
