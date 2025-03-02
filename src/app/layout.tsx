import type { Metadata } from 'next';
import './globals.css';
import { fonts } from '../utils/fonts';
import { Providers } from './providers';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fonts.geistMono.variable} ${fonts.geistSans.variable}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
