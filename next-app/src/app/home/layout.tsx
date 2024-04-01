import NavBar from '~/components/nav-bar';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
