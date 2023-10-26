import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { ClerkMetadata } from './types';

export default authMiddleware({
  publicRoutes: ['/', '/login(.*)', '/signup(.*)'],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (
      auth.userId &&
      !(auth?.sessionClaims?.metadata as ClerkMetadata)?.userId &&
      // XXX(Phong): this is a protected route, so we don't want to hit an
      // infinite redirect loop
      !req.url.match('/api/auth/signup') &&
      !req.url.match('/complete-signup')
    ) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = '/api/auth/signup';
      return NextResponse.redirect(redirectUrl.toString());
    }

    return NextResponse.next();
  },
});

// This protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
