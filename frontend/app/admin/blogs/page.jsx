'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Loader2, FileText, Eye, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Web Development',
    summary: '',
    content: '',
    coverImage: '',
    tagsStr: 'Next.js, Node.js, Fastify',
    readTime: '5 min read',
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
    keywordsStr: 'Next.js, SEO, Fastify'
  });
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const loadBlogs = async () => {
    try {
      const res = await api.getAdminBlogs();
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadBlogs();
  }, [router]);

  const openCreateDrawer = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Web Development',
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
      tagsStr: 'Next.js, Fastify, Node.js',
      readTime: '5 min read',
      isPublished: true,
      metaTitle: '',
      metaDescription: '',
      keywordsStr: 'Web Development, Node.js, Next.js'
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Web Development',
      summary: blog.summary || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      tagsStr: blog.tags ? blog.tags.join(', ') : '',
      readTime: blog.readTime || '5 min read',
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      keywordsStr: blog.keywords ? blog.keywords.join(', ') : ''
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog article?')) return;
    try {
      await api.deleteBlog(id);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Error deleting blog');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      tags: formData.tagsStr.split(',').map(s => s.trim()).filter(Boolean),
      keywords: formData.keywordsStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingBlog) {
        await api.updateBlog(editingBlog._id, payload);
      } else {
        await api.createBlog(payload);
      }
      setDrawerOpen(false);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter blogs by search query and category
  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category || 'Tech')))];

  const filteredBlogs = blogs.filter(blog => {
    const q = searchTerm.toLowerCase().trim();
    const matchCat = categoryFilter === 'All' || blog.category === categoryFilter;
    const matchSearch = !q ||
      blog.title?.toLowerCase().includes(q) ||
      blog.slug?.toLowerCase().includes(q) ||
      blog.category?.toLowerCase().includes(q) ||
      blog.summary?.toLowerCase().includes(q) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-400" /> Blogs &amp; Articles CMS
            </h1>
            <p className="text-xs text-slate-400">Publish articles, customize permalinks, and manage SEO meta tags</p>
          </div>
          <button
            onClick={openCreateDrawer}
            className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Blog Article
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-card p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles by title, slug, category, topic tag, or summary..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blogs Table */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Article Title ({filteredBlogs.length})</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                      No blog articles found matching &ldquo;{searchTerm}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/50">
                    <td className="p-4 font-semibold text-white">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">{b.title}</div>
                        <Link
                          href={`/blogs/${b.slug}`}
                          target="_blank"
                          className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 hover:underline"
                        >
                          <Eye className="w-3 h-3" /> /blogs/{b.slug}
                        </Link>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-cyan-400">{b.viewsCount || 0}</td>
                    <td className="p-4">
                      {b.isPublished ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">Published</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditDrawer(b)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 border border-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLIDE-OUT SIDE PANEL DRAWER */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    {editingBlog ? 'Edit Blog Article' : 'Create Blog Article'}
                  </h3>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="blog-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Custom Slug / Permalink</label>
                      <input
                        type="text"
                        placeholder="auto-generated-if-empty"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Read Time</label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={formData.tagsStr}
                        onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Summary / Excerpt *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Full Article Body Content (Markdown supported) *</label>
                    <textarea
                      required
                      rows={7}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-3">
                    <h4 className="font-bold text-cyan-400 text-xs">SEO &amp; Metadata Controls</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">SEO Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">SEO Keywords (comma separated)</label>
                        <input
                          type="text"
                          value={formData.keywordsStr}
                          onChange={(e) => setFormData({ ...formData, keywordsStr: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-900 text-purple-600"
                      />
                      <span>Publish Immediately</span>
                    </label>
                  </div>
                </form>
              </div>

              {/* Drawer Footer Buttons */}
              <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="blog-form"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Blog Post
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
