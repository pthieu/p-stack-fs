import { Providers } from './providers';
import NavBar from '~/components/NavBar';
import { css } from '~/styles/css';

import './global.css';

export const metadata = {
  title: 'p-stack-fs',
  description: 'A boilerplate for TypeScript, Next.js, and PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className={css({ minH: '100vh' })}>
            <NavBar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
