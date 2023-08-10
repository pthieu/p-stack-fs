import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/logout"
      afterSignInUrl="/home"
      // should create user in the DB, redirect user to /setup
      afterSignUpUrl="/post-signup"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'transparent',
          colorBackground: 'transparent',
        },
        elements: {
          formButtonPrimary:
            'bg-foreground text-background hover:text-inherit hover:bg-inherit hover:border hover:border-inherit hover:border-solid',
          card: 'border-inherit border border-solid',
          socialButtonsBlockButton: 'border-inherit border border-solid',
          formFieldInput: 'bg-inherit border-inherit border border-solid',
          footerActionLink: 'text-inherit hover:text-foreground',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
