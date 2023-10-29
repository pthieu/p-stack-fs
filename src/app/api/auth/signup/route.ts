import { clerkClient, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

import { ROUTES } from '~/constants';
import * as User from '~/db/models/user';
import { convertReqUrlToReqHostUrl } from '~/lib/server';

export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirectToSignIn();
  }

  const redirectUrl = convertReqUrlToReqHostUrl(req.url, req.headers);

  if (clerkUser.publicMetadata.userId) {
    redirectUrl.pathname = ROUTES.HOME;
    return NextResponse.redirect(redirectUrl.toString());
  }

  const existingUser = await User.getByAuthId(clerkUser.id);
  if (!existingUser) {
    console.log(`Creating user for ${clerkUser.id}`);
    const email = clerkUser.emailAddresses[0].emailAddress;
    const user = (
      await User.create({
        email,
        clerkId: clerkUser.id,
      }).returning()
    )?.[0];

    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: { userId: user.id },
    });
  }

  redirectUrl.pathname = ROUTES.SIGNUP_COMPLETE_UI;
  redirectUrl.search = '';
  return redirect(redirectUrl.toString());
}
