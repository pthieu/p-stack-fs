'use client';

import { AbsoluteCenter, Box } from '@chakra-ui/react';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <Box height={'100vh'}>
        <AbsoluteCenter>
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </AbsoluteCenter>
      </Box>
    </main>
  );
}
