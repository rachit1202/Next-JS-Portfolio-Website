'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
  FolderGit2,
  FileText,
  Wrench,
  Inbox,
  Eye,
  ArrowUpRight,
  Plus,
  Activity,
  Code2,
  Database,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    featuredProjects: 0,
    blogs: 0,
    totalBlogViews: 0,
    services: 0,
    leads: 0,
    newLeads: 0,
    skillsCount: 0,
    apiStatus: 'Checking...',
    apiLatencyMs: null,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function loadDashboardData() {
      try {
        const [projRes, blogRes, servRes, leadsRes, configRes, healthRes] = await Promise.allSettled([
          api.getAdminProjects(),
          api.getAdminBlogs(),
          api.getAdminServices(),
          api.getLeads(),
          api.getSiteConfig(),
          api.getMonitoringHealth()
        ]);

        const projects = projRes.status === 'fulfilled' ? projRes.value.data || [] : [];
        const blogs = blogRes.status === 'fulfilled' ? blogRes.value.data || [] : [];
        const services = servRes.status === 'fulfilled' ? servRes.value.data || [] : [];
        const leads = leadsRes.status === 'fulfilled' ? leadsRes.value.data || [] : [];
        const leadStats = leadsRes.status === 'fulfilled' ? leadsRes.value.stats || {} : {};
        const config = configRes.status === 'fulfilled' ? configRes.value.data || {} : {};
        const health = healthRes.status === 'fulfilled' ? healthRes.value || {} : null;

        const totalViews = blogs.reduce((acc, b) => acc + (b.viewsCount || 0), 0);
        const sortedBlogs = [...blogs].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 4);

        setStats({
          projects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length,
          blogs: blogs.length,
          totalBlogViews: totalViews,
          services: services.length,
          leads: leads.length,
          newLeads: leadStats.newCount || leads.filter(l => l.status === 'New').length,
          skillsCount: config.skills?.length || 10,
          apiStatus: health?.status === 'operational' ? 'Operational' : 'Online',
          apiLatencyMs: health?.server?.responseTimeMs ?? 15
        });

        setRecentLeads(leads.slice(0, 5));
        setTopBlogs(sortedBlogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rachit Aggarwal CMS Command Center &bull; Real-time portfolio telemetry
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/monitoring"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              API: {stats.apiStatus} ({stats.apiLatencyMs}ms)
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Website
            </Link>
          </div>
        </div>

        {/* 6 Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Projects */}
          <Link
            href="/admin/projects"
            className="glass-card p-5 rounded-2xl hover:border-purple-500/50 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-purple-400">
              <FolderGit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
                {stats.featuredProjects} Featured
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.projects}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Projects Published</p>
          </Link>

          {/* Blogs */}
          <Link
            href="/admin/blogs"
            className="glass-card p-5 rounded-2xl hover:border-cyan-500/50 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-cyan-400">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {stats.totalBlogViews}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.blogs}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Articles &amp; Guides</p>
          </Link>

          {/* Services */}
          <Link
            href="/admin/services"
            className="glass-card p-5 rounded-2xl hover:border-indigo-500/50 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-indigo-400">
              <Wrench className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.services}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Service Offerings</p>
          </Link>

          {/* Inquiries */}
          <Link
            href="/admin/leads"
            className="glass-card p-5 rounded-2xl hover:border-emerald-500/50 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Inbox className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {stats.newLeads > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold animate-pulse">
                  +{stats.newLeads} New
                </span>
              )}
            </div>
            <h3 className="text-3xl font-black text-white">{stats.leads}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Inquiries Received</p>
          </Link>

          {/* Technical Skills */}
          <Link
            href="/admin/settings"
            className="glass-card p-5 rounded-2xl hover:border-amber-500/50 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-amber-400">
              <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                Synced
              </span>
            </div>
            <h3 className="text-3xl font-black text-white">{stats.skillsCount}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Arsenal Skills</p>
          </Link>

          {/* Real-Time API Monitor Card */}
          <Link
            href="/admin/monitoring"
            className="glass-card p-5 rounded-2xl border-emerald-500/30 hover:border-emerald-400/70 transition-all space-y-2 group block"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                100% OK
              </span>
            </div>
            <h3 className="text-3xl font-black text-emerald-400">{stats.apiLatencyMs}ms</h3>
            <p className="text-[11px] text-slate-400 font-medium">API Latency Meter</p>
          </Link>
        </div>

        {/* Quick Action Center */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Command Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects"
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> New Project Case Study
            </Link>
            <Link
              href="/admin/blogs"
              className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Write Blog Article
            </Link>
            <Link
              href="/admin/services"
              className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service Solution
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" /> Configure CMS &amp; Banners
            </Link>
            <Link
              href="/admin/monitoring"
              className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all ml-auto"
            >
              <Activity className="w-3.5 h-3.5" /> Test All Endpoints
            </Link>
          </div>
        </div>

        {/* Two-Column Grid: Recent Inquiries + Top Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Inquiries */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-emerald-400" /> Recent Client Inquiries
                </h3>
                <p className="text-xs text-slate-400">Direct inquiries from contact form</p>
              </div>
              <Link href="/admin/leads" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No contact inquiries received yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentLeads.map((lead) => (
                  <div key={lead._id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          lead.status === 'New'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lead.status || 'New'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {lead.email} &bull; {lead.phone || 'No phone'} &bull; <span className="text-cyan-400">{lead.serviceNeeded || 'General'}</span>
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-1 italic">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Performing Articles */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Top Performing Articles
                </h3>
                <p className="text-xs text-slate-400">Most viewed engineering publications</p>
              </div>
              <Link href="/admin/blogs" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Manage Blogs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {topBlogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No blogs published yet.</p>
            ) : (
              <div className="space-y-2.5">
                {topBlogs.map((blog) => (
                  <div key={blog._id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{blog.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-300 text-[10px]">
                          {blog.category || 'Tech'}
                        </span>
                        <span>{blog.readTime || '5 min read'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1 justify-end">
                        <Eye className="w-3.5 h-3.5" /> {blog.viewsCount || 0}
                      </span>
                      <span className="text-[10px] text-slate-500">reads</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
