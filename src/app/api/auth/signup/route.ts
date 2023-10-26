import { clerkClient, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import * as User from '~/db/models/user';

export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirectToSignIn();
  }

  const redirectUrl = new URL(req.url);

  if (clerkUser.publicMetadata.userId) {
    redirectUrl.pathname = '/home';
    return NextResponse.redirect(redirectUrl.toString());
  }

  const existingUser = await User.getByAuthId(clerkUser.id);
  if (!existingUser) {
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

  redirectUrl.pathname = '/complete-signup';
  return NextResponse.redirect(redirectUrl.toString());
}
