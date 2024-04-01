import { authMiddleware, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ClerkMetadata } from '~/types';

import { ROUTES } from '~/constants';
import { convertReqUrlToReqHostUrl } from '~/lib/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    `${ROUTES.LOGIN}(.*)`,
    `${ROUTES.SIGNUP}(.*)`,
    ROUTES.SIGNUP_COMPLETE_UI,
    '/api/webhooks(.*)',
    '/api/internal(.*)',
  ],
  ignoredRoutes: ['/'],
  async afterAuth(auth, req) {
    // XXX(Phong): create user if the currently logged-in user does not have
    // a userId that we issued
    if (
      auth.userId &&
      !(auth?.sessionClaims?.metadata as ClerkMetadata)?.userId &&
      // XXX(Phong): this is a protected route, so we don't want to hit an
      // infinite redirect loop
      !req.url.match(ROUTES.SIGNUP_COMPLETE) &&
      !req.url.match(ROUTES.SIGNUP_COMPLETE_UI)
    ) {
      const clerkUser = await currentUser();
      const redirectUrl = convertReqUrlToReqHostUrl(req.url, req.headers);
      if (clerkUser?.publicMetadata?.userId) {
        // XXX(Phong): means a discrepancy between the user's session, needs to
        // be updated
        redirectUrl.pathname = ROUTES.SIGNUP_COMPLETE_UI;
        return NextResponse.redirect(redirectUrl.toString());
      }

      redirectUrl.pathname = ROUTES.SIGNUP_COMPLETE;
      return NextResponse.redirect(redirectUrl.toString());
    }

    if (!auth.userId && !auth.isPublicRoute) {
      const redirectUrl = convertReqUrlToReqHostUrl(req.url, req.headers);
      return redirectToSignIn({ returnBackUrl: redirectUrl.toString() });
    }
  },
  debug: false,
});

// This protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
