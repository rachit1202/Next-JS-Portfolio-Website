'use client';

import { usePathname } from 'next/navigation';

export default function SiteFooter({ children }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  return children;
}
