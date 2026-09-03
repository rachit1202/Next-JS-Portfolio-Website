'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Search, 
  Save, 
  CheckCircle2, 
  Loader2, 
  Globe, 
  Home, 
  User, 
  Briefcase, 
  Code2, 
  BookOpen, 
  Mail, 
  ExternalLink,
  Sparkles,
  Share2,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';

const PAGE_TABS = [
  { id: 'global', label: 'Global & Defaults', icon: Globe },
  { id: 'home', label: 'Home (/)', icon: Home, path: '/' },
  { id: 'about', label: 'About (/about)', icon: User, path: '/about' },
  { id: 'projects', label: 'Projects (/projects)', icon: Briefcase, path: '/projects' },
  { id: 'services', label: 'Services (/services)', icon: Code2, path: '/services' },
  { id: 'blogs', label: 'Blogs (/blogs)', icon: BookOpen, path: '/blogs' },
  { id: 'contact', label: 'Contact (/contact)', icon: Mail, path: '/contact' },
];

const DEFAULT_PAGES = [
  {
    pageKey: 'home',
    pageName: 'Home Page',
    path: '/',
    title: 'Rachit Aggarwal | Senior Full-Stack & Next.js Web Developer',
    description: 'Official portfolio of Rachit Aggarwal — Senior Full-Stack Developer specializing in high-performance Next.js web applications, Fastify REST APIs, and scalable web solutions.',
    keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js Developer Delhi', 'Fastify Backend Developer', 'MERN Stack Developer', 'WordPress Developer India'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/'
  },
  {
    pageKey: 'about',
    pageName: 'About Me',
    path: '/about',
    title: 'About Rachit Aggarwal | Background, Skills & Full-Stack Experience',
    description: 'Career journey, work experiences, technical capability, education, and development approach of Rachit Aggarwal. 3+ years delivering 25+ client projects.',
    keywords: ['About Rachit Aggarwal', 'Full-Stack Developer Bio', 'Web Developer Experience', 'Next.js Developer Skills', 'Fastify Node.js Architecture'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/about'
  },
  {
    pageKey: 'projects',
    pageName: 'Projects Portfolio',
    path: '/projects',
    title: 'Featured Projects & Case Studies | Rachit Aggarwal Portfolio',
    description: 'Explore live web applications, enterprise portals, custom WordPress platforms, and high-throughput REST API microservices engineered by Rachit Aggarwal.',
    keywords: ['Web Projects Portfolio', 'Next.js Case Studies', 'Full-Stack Web Apps', 'WordPress Development Showcase', 'Fastify REST API Examples'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/projects'
  },
  {
    pageKey: 'services',
    pageName: 'Services & Capabilities',
    path: '/services',
    title: 'Web Development Services & Solutions | Rachit Aggarwal',
    description: 'End-to-end web development services: Next.js 14 web applications, Fastify REST API backends, custom WordPress development, and performance optimization.',
    keywords: ['Web Development Services', 'Hire Next.js Developer', 'Fastify API Development', 'Custom WordPress Developer', 'Freelance Web Developer India'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/services'
  },
  {
    pageKey: 'blogs',
    pageName: 'Tech Blog & Insights',
    path: '/blogs',
    title: 'Engineering Blog & Web Dev Tutorials | Rachit Aggarwal',
    description: 'In-depth articles, tutorials, and architectural insights on modern web development, Next.js 14, Fastify APIs, Node.js performance, and SEO best practices.',
    keywords: ['Web Development Blog', 'Next.js Tutorials', 'Node.js Performance', 'Fastify Guides', 'Technical SEO Delhi'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/blogs'
  },
  {
    pageKey: 'contact',
    pageName: 'Contact & Inquiries',
    path: '/contact',
    title: 'Contact Rachit Aggarwal | Hire a Senior Full-Stack Developer',
    description: 'Get in touch with Rachit Aggarwal for custom software development, freelance projects, technical consulting, or collaborations. Available for hire.',
    keywords: ['Contact Rachit Aggarwal', 'Hire Web Developer Delhi', 'Freelance Web Developer Inquiry', 'Project Consultation'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/contact'
  }
];

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState('global');
  const [seoConfig, setSeoConfig] = useState({
    siteName: 'Rachit Aggarwal | Senior Software Developer',
    defaultTitle: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer',
    defaultDescription: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.',
    keywordsStr: 'Rachit Aggarwal, Senior Web Developer, Full-Stack Developer, Next.js, Fastify, MERN Stack',
    author: 'Rachit Aggarwal',
    ogImage: '/final-logo.png',
    twitterHandle: '@rachitaggarwal',
    linkedinUrl: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/',
    githubUrl: 'https://github.com/rachit1202',
    contactEmail: 'rachitaggarwal1202@gmail.com',
    contactPhone: '+91 9873088907',
    location: 'Rohini, New Delhi, India',
    customHeadScripts: '',
    pages: DEFAULT_PAGES
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    async function loadSeo() {
      try {
        const res = await api.getSeo();
        if (res.data) {
          const d = res.data;
          
          // Merge fetched pages with default pages to guarantee every page exists
          const mergedPages = DEFAULT_PAGES.map(dp => {
            const existing = (d.pages || []).find(p => p.pageKey?.toLowerCase() === dp.pageKey.toLowerCase());
            return existing ? { ...dp, ...existing } : dp;
          });

          setSeoConfig({
            siteName: d.siteName || 'Rachit Aggarwal | Senior Software Developer',
            defaultTitle: d.defaultTitle || '',
            defaultDescription: d.defaultDescription || '',
            keywordsStr: Array.isArray(d.keywords) ? d.keywords.join(', ') : (d.keywords || ''),
            author: d.author || 'Rachit Aggarwal',
            ogImage: d.ogImage || '/final-logo.png',
            twitterHandle: d.twitterHandle || '@rachitaggarwal',
            linkedinUrl: d.linkedinUrl || '',
            githubUrl: d.githubUrl || '',
            contactEmail: d.contactEmail || '',
            contactPhone: d.contactPhone || '',
            location: d.location || '',
            customHeadScripts: d.customHeadScripts || '',
            pages: mergedPages
          });
        }
      } catch (err) {
        console.error('[Load SEO Error]:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSeo();
  }, [router]);

  const updatePageField = (pageKey, field, value) => {
    setSeoConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.pageKey === pageKey) {
          if (field === 'keywordsStr') {
            return {
              ...p,
              keywordsStr: value,
              keywords: value.split(',').map(s => s.trim()).filter(Boolean)
            };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const formattedPages = seoConfig.pages.map(p => ({
      pageKey: p.pageKey,
      pageName: p.pageName,
      path: p.path,
      title: p.title || '',
      description: p.description || '',
      keywords: Array.isArray(p.keywords) ? p.keywords : (p.keywordsStr ? p.keywordsStr.split(',').map(s => s.trim()).filter(Boolean) : []),
      ogImage: p.ogImage || seoConfig.ogImage || '/final-logo.png',
      canonicalUrl: p.canonicalUrl || `https://rachitaggarwal.vercel.app${p.path === '/' ? '' : p.path}`
    }));

    const payload = {
      siteName: seoConfig.siteName,
      defaultTitle: seoConfig.defaultTitle,
      defaultDescription: seoConfig.defaultDescription,
      keywords: typeof seoConfig.keywordsStr === 'string' ? seoConfig.keywordsStr.split(',').map(s => s.trim()).filter(Boolean) : seoConfig.keywords,
      author: seoConfig.author,
      ogImage: seoConfig.ogImage,
      twitterHandle: seoConfig.twitterHandle,
      linkedinUrl: seoConfig.linkedinUrl,
      githubUrl: seoConfig.githubUrl,
      contactEmail: seoConfig.contactEmail,
      contactPhone: seoConfig.contactPhone,
      location: seoConfig.location,
      customHeadScripts: seoConfig.customHeadScripts,
      pages: formattedPages
    };

    try {
      const res = await api.updateSeo(payload);
      setSuccessMsg('SEO & Page-Wise Metadata successfully saved to MongoDB Atlas!');
      if (res.data) {
        const d = res.data;
        const mergedPages = (d.pages && d.pages.length > 0) ? d.pages : formattedPages;
        setSeoConfig(prev => ({
          ...prev,
          siteName: d.siteName || prev.siteName,
          defaultTitle: d.defaultTitle || prev.defaultTitle,
          defaultDescription: d.defaultDescription || prev.defaultDescription,
          keywordsStr: Array.isArray(d.keywords) ? d.keywords.join(', ') : (d.keywords || prev.keywordsStr),
          author: d.author || prev.author,
          ogImage: d.ogImage || prev.ogImage,
          twitterHandle: d.twitterHandle || prev.twitterHandle,
          linkedinUrl: d.linkedinUrl || prev.linkedinUrl,
          githubUrl: d.githubUrl || prev.githubUrl,
          contactEmail: d.contactEmail || prev.contactEmail,
          contactPhone: d.contactPhone || prev.contactPhone,
          location: d.location || prev.location,
          customHeadScripts: d.customHeadScripts || prev.customHeadScripts,
          pages: mergedPages
        }));
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error saving SEO settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const activePageData = seoConfig.pages.find(p => p.pageKey === activeTab);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Search className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white">SEO & Page-Wise Meta Control Panel</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure page titles, descriptions, target keywords, and OpenGraph social preview cards individually per page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving to MongoDB...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save SEO Settings
              </>
            )}
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
          {PAGE_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: GLOBAL BRAND & SOCIAL SETTINGS */}
        {activeTab === 'global' && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 text-xs">
            {/* Section 1: Global Brand */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Globe className="w-4 h-4" /> 1. Global Brand & Fallback Meta
                </h3>
                <span className="text-[10px] text-slate-500">Applies as fallback when individual page meta is empty</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Site Name / Brand</label>
                  <input
                    type="text"
                    value={seoConfig.siteName}
                    onChange={(e) => setSeoConfig({ ...seoConfig, siteName: e.target.value })}
                    placeholder="Rachit Aggarwal | Senior Software Developer"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Author Name</label>
                  <input
                    type="text"
                    value={seoConfig.author}
                    onChange={(e) => setSeoConfig({ ...seoConfig, author: e.target.value })}
                    placeholder="Rachit Aggarwal"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Default Global Document Title</label>
                <input
                  type="text"
                  value={seoConfig.defaultTitle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, defaultTitle: e.target.value })}
                  placeholder="Rachit Aggarwal - Senior Full-Stack & MERN Developer"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Default Global Meta Description</label>
                <textarea
                  rows={2}
                  value={seoConfig.defaultDescription}
                  onChange={(e) => setSeoConfig({ ...seoConfig, defaultDescription: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Global Keywords (comma separated)</label>
                <input
                  type="text"
                  value={seoConfig.keywordsStr}
                  onChange={(e) => setSeoConfig({ ...seoConfig, keywordsStr: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Section 2: OpenGraph & Social Handles */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Share2 className="w-4 h-4" /> 2. Social Profiles & Default OG Banner
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Global Default OG Image (1200x630)</label>
                  <input
                    type="text"
                    value={seoConfig.ogImage}
                    onChange={(e) => setSeoConfig({ ...seoConfig, ogImage: e.target.value })}
                    placeholder="/final-logo.png or https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={seoConfig.twitterHandle}
                    onChange={(e) => setSeoConfig({ ...seoConfig, twitterHandle: e.target.value })}
                    placeholder="@rachitaggarwal"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={seoConfig.linkedinUrl}
                    onChange={(e) => setSeoConfig({ ...seoConfig, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={seoConfig.githubUrl}
                    onChange={(e) => setSeoConfig({ ...seoConfig, githubUrl: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Custom Head Scripts */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4" /> 3. Custom Tracking & Head Scripts
              </h3>
              <p className="text-[11px] text-slate-400">
                Paste raw HTML tags (e.g. Google Search Console &lt;meta name="google-site-verification" ...&gt; or analytics snippets).
              </p>
              <textarea
                rows={4}
                value={seoConfig.customHeadScripts}
                onChange={(e) => setSeoConfig({ ...seoConfig, customHeadScripts: e.target.value })}
                placeholder="<!-- Google tag / verification code -->"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        )}

        {/* TABS 2-7: INDIVIDUAL PAGE METADATA */}
        {activeTab !== 'global' && activePageData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
            {/* Left: Form Fields (7 cols) */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <span>{activePageData.pageName}</span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      {activePageData.path}
                    </span>
                  </h3>
                </div>
                <a
                  href={activePageData.path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                >
                  View Live Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Page Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Page Title (&lt;title&gt; tag)</label>
                  <span className={`text-[10px] font-mono ${(activePageData.title || '').length > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {(activePageData.title || '').length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={activePageData.title || ''}
                  onChange={(e) => updatePageField(activePageData.pageKey, 'title', e.target.value)}
                  placeholder={`Leave blank to inherit global: "${seoConfig.defaultTitle || ''}"`}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-medium placeholder:text-slate-600"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Meta Description</label>
                  <span className={`text-[10px] font-mono ${(activePageData.description || '').length > 160 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {(activePageData.description || '').length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={activePageData.description || ''}
                  onChange={(e) => updatePageField(activePageData.pageKey, 'description', e.target.value)}
                  placeholder="Leave blank to inherit global meta description..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 leading-relaxed placeholder:text-slate-600"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Page Keywords (comma separated)</label>
                <input
                  type="text"
                  value={activePageData.keywordsStr !== undefined ? activePageData.keywordsStr : (Array.isArray(activePageData.keywords) ? activePageData.keywords.join(', ') : '')}
                  onChange={(e) => updatePageField(activePageData.pageKey, 'keywordsStr', e.target.value)}
                  placeholder={`Leave blank to inherit global keywords: "${seoConfig.keywordsStr || ''}"`}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>

              {/* Page-Specific OG Image */}
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Page Social Share Image (OpenGraph URL)</label>
                <input
                  type="text"
                  value={activePageData.ogImage || ''}
                  onChange={(e) => updatePageField(activePageData.pageKey, 'ogImage', e.target.value)}
                  placeholder={`Leave blank to inherit global banner: ${seoConfig.ogImage || '/final-logo.png'}`}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-400 placeholder:text-slate-600"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Canonical URL (Rel="canonical")</label>
                  <span className="text-[10px] text-slate-500 font-mono">Google Indexing Target</span>
                </div>
                <input
                  type="url"
                  value={activePageData.canonicalUrl || ''}
                  onChange={(e) => updatePageField(activePageData.pageKey, 'canonicalUrl', e.target.value)}
                  placeholder={`Auto: https://rachitaggarwal.vercel.app${activePageData.path === '/' ? '' : activePageData.path}`}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Tells Google and search engines the official primary URL of this page to prevent duplicate indexing.
                </p>
              </div>
            </div>

            {/* Right: Live Google SERP & Social Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Google Search Card Preview */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Search SERP Preview</span>
                </div>

                <div className="p-4 rounded-xl bg-[#1f1f1f] border border-slate-700/60 font-sans space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white">
                      R
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">
                      https://rachitaggarwal.vercel.app{activePageData.path}
                    </div>
                  </div>
                  <h4 className="text-base text-[#8ab4f8] hover:underline font-normal cursor-pointer leading-snug break-words">
                    {activePageData.title?.trim() || seoConfig.defaultTitle || 'Page Title'}
                  </h4>
                  <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2 break-words">
                    {activePageData.description?.trim() || seoConfig.defaultDescription || 'Add a compelling meta description to see how it appears on Google searches.'}
                  </p>
                </div>
              </div>

              {/* Social Share Preview Card */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Social Share Preview</span>
                </div>

                <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                  <div className="h-32 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    {activePageData.ogImage?.trim() || seoConfig.ogImage ? (
                      <img
                        src={activePageData.ogImage?.trim() || seoConfig.ogImage}
                        alt="Social preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-xs text-slate-600">No Image Preview</span>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] text-purple-400 uppercase font-mono">rachitaggarwal.vercel.app</span>
                    <h5 className="text-xs font-bold text-white line-clamp-1">
                      {activePageData.title?.trim() || seoConfig.defaultTitle}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {activePageData.description?.trim() || seoConfig.defaultDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving All SEO Settings...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save All SEO Settings
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
