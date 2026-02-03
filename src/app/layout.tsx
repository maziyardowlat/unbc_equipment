import './globals.css';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Management',
  description: 'Manage equipment inventory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Providers>
          <Header />
          <main style={{ flex: 1, padding: '2rem 0' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
