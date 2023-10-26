'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      if (user) {
        await user.reload();
        push('/home');
      }
    })();
  }, [user]);

  return <>Please wait...</>;
}
