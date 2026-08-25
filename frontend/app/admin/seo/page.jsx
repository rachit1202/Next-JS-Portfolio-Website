'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Search, Save, CheckCircle2, Loader2, Code, Globe, Shield } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminSeoPage() {
  const [seoConfig, setSeoConfig] = useState({
    siteName: '',
    defaultTitle: '',
    defaultDescription: '',
    keywordsStr: '',
    author: '',
    ogImage: '',
    twitterHandle: '',
    linkedinUrl: '',
    githubUrl: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    customHeadScripts: ''
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
          setSeoConfig({
            siteName: d.siteName || '',
            defaultTitle: d.defaultTitle || '',
            defaultDescription: d.defaultDescription || '',
            keywordsStr: d.keywords ? d.keywords.join(', ') : '',
            author: d.author || '',
            ogImage: d.ogImage || '',
            twitterHandle: d.twitterHandle || '',
            linkedinUrl: d.linkedinUrl || '',
            githubUrl: d.githubUrl || '',
            contactEmail: d.contactEmail || '',
            contactPhone: d.contactPhone || '',
            location: d.location || '',
            customHeadScripts: d.customHeadScripts || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSeo();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const payload = {
      ...seoConfig,
      keywords: seoConfig.keywordsStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await api.updateSeo(payload);
      setSuccessMsg('SEO & Site Meta Settings updated successfully!');
    } catch (err) {
      alert('Error updating SEO settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">SEO & Metadata Control Panel</h1>
            <p className="text-xs text-slate-400">Manage site titles, default OpenGraph images, keywords, search tags & custom scripts</p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 text-xs">
          
          {/* Main Title & Brand */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">1. Global Brand & Default Meta Tags</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Site Name</label>
                <input
                  type="text"
                  value={seoConfig.siteName}
                  onChange={(e) => setSeoConfig({ ...seoConfig, siteName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={seoConfig.author}
                  onChange={(e) => setSeoConfig({ ...seoConfig, author: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Default Document Meta Title (Google Search Result Title)</label>
              <input
                type="text"
                value={seoConfig.defaultTitle}
                onChange={(e) => setSeoConfig({ ...seoConfig, defaultTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Default Meta Description</label>
              <textarea
                rows={3}
                value={seoConfig.defaultDescription}
                onChange={(e) => setSeoConfig({ ...seoConfig, defaultDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Target Keywords (comma separated for SEO ranking)</label>
              <input
                type="text"
                value={seoConfig.keywordsStr}
                onChange={(e) => setSeoConfig({ ...seoConfig, keywordsStr: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Social Sharing & OpenGraph */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono">2. OpenGraph & Social Sharing Meta</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Default OpenGraph Image URL (Social Share Banner)</label>
                <input
                  type="url"
                  value={seoConfig.ogImage}
                  onChange={(e) => setSeoConfig({ ...seoConfig, ogImage: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Twitter / X Handle</label>
                <input
                  type="text"
                  value={seoConfig.twitterHandle}
                  onChange={(e) => setSeoConfig({ ...seoConfig, twitterHandle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={seoConfig.linkedinUrl}
                  onChange={(e) => setSeoConfig({ ...seoConfig, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={seoConfig.githubUrl}
                  onChange={(e) => setSeoConfig({ ...seoConfig, githubUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">3. Global Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={seoConfig.contactEmail}
                  onChange={(e) => setSeoConfig({ ...seoConfig, contactEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={seoConfig.contactPhone}
                  onChange={(e) => setSeoConfig({ ...seoConfig, contactPhone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Location / Address</label>
                <input
                  type="text"
                  value={seoConfig.location}
                  onChange={(e) => setSeoConfig({ ...seoConfig, location: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save SEO Settings
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
