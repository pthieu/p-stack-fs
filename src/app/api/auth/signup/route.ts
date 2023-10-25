import { clerkClient, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import * as User from '~/db/models/user';

export async function GET(req: Request) {
  const clerkUser = await currentUser();

  const redirectUrl = new URL(req.url);
  redirectUrl.pathname = '/home';

  if (!clerkUser) {
    return redirectToSignIn();
  }

  if (clerkUser.publicMetadata.userId) {
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

  return NextResponse.redirect(redirectUrl.toString());
}
