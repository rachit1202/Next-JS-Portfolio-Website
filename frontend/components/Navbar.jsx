'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, UserCheck } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (typeof window !== 'undefined') {
      setIsAdminLoggedIn(!!localStorage.getItem('rachit_admin_token'));
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg shadow-black/30 py-2' : 'bg-transparent py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo (Image Only) */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <div className="relative w-30 h-20 flex-shrink-0">
            <Image
              src="/final-logo.png"
              alt="Rachit Aggarwal Logo"
              fill
              sizes="120px"
              className="object-contain group-hover:scale-105 transition-transform duration-200"
              priority
              fetchPriority="high"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg ${isActive(link.path)
                ? 'text-purple-400 font-bold'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #9333ea, #6366f1)' }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {isAdminLoggedIn && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:opacity-80 transition-opacity"
            >
              <UserCheck className="w-3.5 h-3.5" />
              CMS
            </Link>
          )}
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-100 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 50%, #06b6d4 100%)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            Hire Me
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="glass-nav border-t border-slate-200 dark:border-white/5 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${isActive(link.path)
                ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)' }}
            >
              Hire Me <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
