'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, ExternalLink, X, Loader2, FolderGit2, Eye, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Full-Stack',
    shortDescription: '',
    fullDescription: '',
    engineeringQuality: 'Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata.',
    customCtaHeading: '',
    customCtaSubtitle: '',
    coverImage: '',
    liveUrl: '',
    githubUrl: '',
    techStackStr: 'Next.js, Node.js, MongoDB',
    clientName: '',
    role: 'Senior Web Developer',
    featured: false,
    isPublished: true
  });
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const loadProjects = async () => {
    try {
      const res = await api.getAdminProjects();
      setProjects(res.data || []);
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
    loadProjects();
  }, [router]);

  const openCreateDrawer = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Full-Stack',
      shortDescription: '',
      fullDescription: '',
      engineeringQuality: 'Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata.',
      customCtaHeading: '',
      customCtaSubtitle: '',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
      liveUrl: '',
      githubUrl: '',
      techStackStr: 'Next.js 14, Fastify, MongoDB, Tailwind CSS, TypeScript',
      clientName: '',
      role: 'Senior Web Developer',
      featured: false,
      isPublished: true
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'Full-Stack',
      shortDescription: proj.shortDescription || '',
      fullDescription: proj.fullDescription || '',
      engineeringQuality: proj.engineeringQuality || 'Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata.',
      customCtaHeading: proj.customCtaHeading || '',
      customCtaSubtitle: proj.customCtaSubtitle || '',
      coverImage: proj.coverImage || '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      techStackStr: proj.techStack ? proj.techStack.join(', ') : '',
      clientName: proj.clientName || '',
      role: proj.role || 'Senior Web Developer',
      featured: proj.featured || false,
      isPublished: proj.isPublished !== undefined ? proj.isPublished : true
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      loadProjects();
    } catch (err) {
      alert(err.message || 'Error deleting project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      techStack: formData.techStackStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingProject) {
        await api.updateProject(editingProject._id, payload);
      } else {
        await api.createProject(payload);
      }
      setDrawerOpen(false);
      loadProjects();
    } catch (err) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter projects by search query and category
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'Full-Stack')))];
  
  const filteredProjects = projects.filter(proj => {
    const q = searchTerm.toLowerCase().trim();
    const matchCat = categoryFilter === 'All' || proj.category === categoryFilter;
    const matchSearch = !q ||
      proj.title?.toLowerCase().includes(q) ||
      proj.slug?.toLowerCase().includes(q) ||
      proj.category?.toLowerCase().includes(q) ||
      proj.clientName?.toLowerCase().includes(q) ||
      (proj.techStack && proj.techStack.some(t => t.toLowerCase().includes(q))) ||
      proj.shortDescription?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-cyan-400" /> Projects Management
            </h1>
            <p className="text-xs text-slate-400">Manage case studies, live links, and portfolio items</p>
          </div>
          <button
            onClick={openCreateDrawer}
            className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Project
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
              placeholder="Search projects by title, slug, tech stack, client name..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
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
                    ? 'bg-purple-600/30 text-cyan-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Project ({filteredProjects.length})</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tech Stack</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      No projects found matching &ldquo;{searchTerm}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-slate-900/50">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <img src={proj.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=100'} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800" />
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-white">{proj.title}</div>
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 hover:underline"
                          >
                            <Eye className="w-3 h-3" /> /projects/{proj.slug}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300">
                        {proj.category}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate">{proj.techStack?.join(', ')}</td>
                    <td className="p-4">
                      {proj.featured ? (
                        <span className="text-cyan-400 font-bold">Featured ★</span>
                      ) : (
                        <span className="text-slate-500">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      {proj.isPublished ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">Published</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold">Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditDrawer(proj)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(proj._id)}
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
            <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-cyan-400" />
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="project-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Project Title *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <label className="block text-slate-300 mb-1 font-semibold">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        value={formData.techStackStr}
                        onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        placeholder="Next.js 14, Node.js, Fastify, MongoDB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Cover Image URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Live Project URL</label>
                      <input
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Client Name</label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Your Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Short Description (Cards view) *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Full Case Study / Architecture Overview *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Engineering Quality &amp; Highlights (Sidebar Badge Note)</label>
                    <textarea
                      rows={3}
                      value={formData.engineeringQuality}
                      onChange={(e) => setFormData({ ...formData, engineeringQuality: e.target.value })}
                      placeholder="Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Optional Custom CTA Override */}
                  <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <label className="block text-slate-200 font-semibold text-[11px]">Optional: Custom CTA Banner Override for this Project</label>
                    <input
                      type="text"
                      value={formData.customCtaHeading}
                      onChange={(e) => setFormData({ ...formData, customCtaHeading: e.target.value })}
                      placeholder="Custom Heading (leave empty to use default template)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                      rows={2}
                      value={formData.customCtaSubtitle}
                      onChange={(e) => setFormData({ ...formData, customCtaSubtitle: e.target.value })}
                      placeholder="Custom Subtitle (leave empty to use default template)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-900 text-purple-600"
                      />
                      <span>Featured on Home Page</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-900 text-purple-600"
                      />
                      <span>Is Published</span>
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
                  form="project-form"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
