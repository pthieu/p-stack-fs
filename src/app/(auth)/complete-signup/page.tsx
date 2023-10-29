'use client';

import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '~/constants';

export default function CompletSsignup() {
  const { user, isLoaded } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    checkUser();
    async function checkUser() {
      if (!isLoaded) {
        return;
      }

      if (user) {
        await user.reload();
        return push(ROUTES.HOME);
      }

      return push(ROUTES.LOGIN);
    }
  }, [isLoaded]);

  return (
    <div className="flex flex-col items-center">
      <Loader2 size={96} className="animate-spin" />
      <span className="text-3xl">Please wait...</span>
    </div>
  );
}
