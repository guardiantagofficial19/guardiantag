import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Bebas_Neue, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const bebas = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GuardianTag | QR Personal Safety Technology',
  description: 'Biker emergency QR safety tags for helmets and motorcycles with ₹499 one-time pricing and no subscriptions. Instant emergency calling with complete phone number privacy. Kids, luggage, and pet tags coming soon.',
  keywords: ['GuardianTag', 'Biker QR Tag', 'Helmet Emergency QR', 'Biker Safety India', 'Emergency ICE Tag'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GuardianTag'
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${inter.variable} ${bebas.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-white selection:bg-white selection:text-black relative">
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
