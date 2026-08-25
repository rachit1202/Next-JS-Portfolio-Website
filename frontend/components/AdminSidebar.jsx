'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Wrench,
  Inbox,
  Search,
  LogOut,
  Code2,
  Globe,
  Activity,
  ShieldCheck,
  Users,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    api.getMe()
      .then((res) => {
        if (res.user) setCurrentUser(res.user);
      })
      .catch(() => {});
  }, []);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const allNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', matchPrefix: ['/admin', '/admin/dashboard'], icon: LayoutDashboard },
    { name: 'API Monitoring', path: '/admin/monitoring', matchPrefix: ['/admin/monitoring'], icon: Activity, isLive: true, adminOnly: true },
    { name: 'Site & Profile CMS', path: '/admin/settings', matchPrefix: ['/admin/settings'], icon: Code2 },
    { name: 'Projects CMS', path: '/admin/projects', matchPrefix: ['/admin/projects'], icon: FolderGit2 },
    { name: 'Blogs & Articles', path: '/admin/blogs', matchPrefix: ['/admin/blogs'], icon: FileText },
    { name: 'Services CMS', path: '/admin/services', matchPrefix: ['/admin/services'], icon: Wrench },
    { name: 'Leads & Inquiries', path: '/admin/leads', matchPrefix: ['/admin/leads'], icon: Inbox },
    { name: 'Users & Team', path: '/admin/users', matchPrefix: ['/admin/users'], icon: Users, adminOnly: true },
    { name: 'SEO & Meta Config', path: '/admin/seo', matchPrefix: ['/admin/seo'], icon: Search },
  ];

  // Filter items: if role is 'editor', hide adminOnly items
  const navItems = allNavItems.filter(item => {
    if (item.adminOnly && currentUser && currentUser.role === 'editor') {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('rachit_admin_token');
    router.push('/admin/login');
  };

  const isCurrentActive = (item) => {
    if (item.path === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(item.path);
  };

  // Nav list content
  const navContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-[140px]">
                {currentUser?.name || currentUser?.username || 'CMS Command'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                  currentUser?.role === 'editor'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {currentUser?.role || 'admin'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {/* Close button inside mobile slide drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.isLive && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse shrink-0">
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-2 pt-4 border-t border-slate-800/80">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
        >
          <Globe className="w-4 h-4 shrink-0" /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" /> Logout Session
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== MOBILE TOP BAR (< md) ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#07080f]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-purple-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">CMS Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1.5"
            title="View Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ===== MOBILE SLIDE-OVER DRAWER (< md) ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#07080f] border-r border-slate-800/80 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      {/* ===== DESKTOP SIDEBAR (>= md) ===== */}
      <aside className="hidden md:flex w-64 bg-[#07080f] border-r border-slate-800/80 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>
    </>
  );
}
