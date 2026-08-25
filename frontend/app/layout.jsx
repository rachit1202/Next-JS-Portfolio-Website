import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Footer from '@/components/Footer';
import SiteFooter from '@/components/SiteFooter';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Rachit Aggarwal | Senior Web Developer & Full-Stack Engineer',
  description: 'Portfolio of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, WordPress, and high-performance Web APIs.',
  keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js Developer', 'Fastify', 'Node.js', 'WordPress', 'Delhi Software Engineer'],
  authors: [{ name: 'Rachit Aggarwal' }],
  creator: 'Rachit Aggarwal',
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Rachit Aggarwal | Senior Web Developer',
    description: 'Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB & WordPress.',
    type: 'website',
    url: 'http://localhost:3000',
    siteName: 'Rachit Aggarwal Portfolio',
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[#06070d] text-slate-100" suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout footer={<SiteFooter><Footer /></SiteFooter>}>
            {children}
          </ClientLayout>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
