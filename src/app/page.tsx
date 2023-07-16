import Image from 'next/image';

import { css } from '~/styles/css';
import { flex } from '~/styles/patterns';

export default function Home() {
  return (
    <main>
      <div
        className={css({
          display: 'flex',
          minH: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <div
          className={flex({
            flexDirection: 'column',
            alignItems: 'center',
          })}
        >
          <div>
            <Image
              src="/next.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
              priority
            />
          </div>
          <div>{process.env.NEXT_PUBLIC_FOO}</div>
        </div>
      </div>
    </main>
  );
}
