'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ClientLayout({ children, footer }) {
  const pathname = usePathname();
  const isAdmin = Boolean(pathname && pathname.startsWith('/admin'));

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#07080f] text-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      {footer}
    </>
  );
}
