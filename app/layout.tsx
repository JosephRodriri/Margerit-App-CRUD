// app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

/* =========  FUENTES LOCALES (Geist)  ========= */
const geistSans = localFont({
  src: '../public/Geist-VariableFont_wght.ttf',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: '../public/GeistMono-VariableFont_wght.ttf',
  variable: '--font-geist-mono',
  weight: '100 900',
});

/* =========  METADATOS  ========= */
export const metadata: Metadata = {
  title: 'MAGERIT - Gestión de Riesgos de Seguridad',
  description:
    'Aplicación para la gestión de riesgos de seguridad de la información basada en la metodología MAGERIT',
};

/* =========  LAYOUT  ========= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}