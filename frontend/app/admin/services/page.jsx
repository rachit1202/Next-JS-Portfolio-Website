'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Loader2, ExternalLink, Wrench, Eye, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Development',
    shortDesc: '',
    fullDesc: '',
    featuresStr: '',
    deliverablesStr: '',
    techStackStr: '',
    priceEstimate: 'Custom Quote',
    isPublished: true,
    processSteps: [
      { stepNumber: 1, title: 'Discovery & System Design', description: 'Requirements analysis, schema modeling, API endpoint mapping, and architecture planning.' },
      { stepNumber: 2, title: 'Development & Implementation', description: 'Coding clean, performant modules, endpoints, and reactive interfaces.' },
      { stepNumber: 3, title: 'Testing & Optimization', description: 'Auditing performance, security hardening, and cross-platform validation.' },
      { stepNumber: 4, title: 'Deployment & Launch', description: 'Production deployment, analytics integration, and post-launch verification.' }
    ]
  });
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const loadServices = async () => {
    try {
      const res = await api.getAdminServices();
      setServices(res.data || []);
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
    loadServices();
  }, [router]);

  const openCreateDrawer = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Development',
      shortDesc: '',
      fullDesc: '',
      featuresStr: 'Next.js 14 App Router, High-Throughput Fastify API, JWT Auth & Security, MongoDB Index Optimization',
      deliverablesStr: 'Production Ready Web App, Clean Source Code, Deployment & CI/CD Setup, 30 Days Free Support',
      techStackStr: 'Next.js 14, React.js, Node.js, Fastify, MongoDB, Tailwind CSS',
      priceEstimate: 'Custom Quote',
      isPublished: true,
      processSteps: [
        { stepNumber: 1, title: 'Discovery & System Design', description: 'Requirements analysis, schema modeling, API endpoint mapping, and architecture planning.' },
        { stepNumber: 2, title: 'Core Engineering & Integration', description: 'Developing core APIs, frontend interfaces, and database schemas.' },
        { stepNumber: 3, title: 'Testing & Performance Tuning', description: 'Lighthouse audit, Core Web Vitals optimization, and security audits.' },
        { stepNumber: 4, title: 'Live Deployment & Verification', description: 'Domain routing, SSL configuration, and production launch.' }
      ]
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      category: service.category || 'Development',
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || '',
      featuresStr: service.features ? service.features.join('\n') : '',
      deliverablesStr: service.deliverables ? service.deliverables.join('\n') : '',
      techStackStr: service.techStack ? service.techStack.join(', ') : '',
      priceEstimate: service.priceEstimate || 'Custom Quote',
      isPublished: service.isPublished !== undefined ? service.isPublished : true,
      processSteps: service.processSteps && service.processSteps.length > 0
        ? service.processSteps
        : [
            { stepNumber: 1, title: 'Discovery & System Design', description: 'Requirements analysis and architecture design.' },
            { stepNumber: 2, title: 'Engineering & Development', description: 'Building features with modern industry standards.' },
            { stepNumber: 3, title: 'Quality Assurance & Audit', description: 'Testing performance, responsiveness, and security.' },
            { stepNumber: 4, title: 'Launch & Handoff', description: 'Deploying to live environment and providing documentation.' }
          ]
    });
    setDrawerOpen(true);
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...formData.processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, processSteps: updated });
  };

  const addStep = () => {
    const nextNum = formData.processSteps.length + 1;
    setFormData({
      ...formData,
      processSteps: [
        ...formData.processSteps,
        { stepNumber: nextNum, title: `Phase ${nextNum}`, description: 'Description of this milestone phase.' }
      ]
    });
  };

  const removeStep = (index) => {
    const updated = formData.processSteps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setFormData({ ...formData, processSteps: updated });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service offering?')) return;
    try {
      await api.deleteService(id);
      loadServices();
    } catch (err) {
      alert(err.message || 'Error deleting service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      features: formData.featuresStr
        .split('\n')
        .flatMap(line => line.split(','))
        .map(s => s.trim())
        .filter(Boolean),
      deliverables: formData.deliverablesStr
        .split('\n')
        .flatMap(line => line.split(','))
        .map(s => s.trim())
        .filter(Boolean),
      techStack: formData.techStackStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      processSteps: formData.processSteps
    };

    try {
      if (editingService) {
        await api.updateService(editingService._id, payload);
      } else {
        await api.createService(payload);
      }
      setDrawerOpen(false);
      loadServices();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter services by search query and category
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category || 'Development')))];

  const filteredServices = services.filter(service => {
    const q = searchTerm.toLowerCase().trim();
    const matchCat = categoryFilter === 'All' || service.category === categoryFilter;
    const matchSearch = !q ||
      service.title?.toLowerCase().includes(q) ||
      service.slug?.toLowerCase().includes(q) ||
      service.category?.toLowerCase().includes(q) ||
      service.shortDesc?.toLowerCase().includes(q) ||
      (service.techStack && service.techStack.some(t => t.toLowerCase().includes(q))) ||
      (service.features && service.features.some(f => f.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wrench className="w-6 h-6 text-purple-400" /> Services CMS
            </h1>
            <p className="text-xs text-slate-400">Manage technical service offerings, features, deliverables &amp; tech stack</p>
          </div>
          <button
            onClick={openCreateDrawer}
            className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Service
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
              placeholder="Search services by title, slug, category, tech stack, or feature..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition-all"
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
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
            No services found matching &ldquo;{searchTerm}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((s) => (
            <div key={s._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                      {s.category || 'Development'}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {s.priceEstimate}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{s.shortDesc}</p>
                
                {/* Tech Stack Pills */}
                {s.techStack && s.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {s.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions & View Link */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Link
                  href={`/services/${s.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" /> View Live Page
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditDrawer(s)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 border border-rose-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* SLIDE-OUT SIDE PANEL (DRAWER) */}
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
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="service-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option>Development</option>
                        <option>Designing</option>
                        <option>Maintenance</option>
                        <option>Cyber Security</option>
                        <option>Security</option>
                        <option>SEO</option>
                        <option>Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Price / Estimate Label</label>
                      <input
                        type="text"
                        value={formData.priceEstimate}
                        onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                        placeholder="e.g. Custom Quote / Monthly Retainer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Short Description (Card summary) *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shortDesc}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      value={formData.techStackStr}
                      onChange={(e) => setFormData({ ...formData, techStackStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="Next.js 14, Node.js, Fastify, MongoDB"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">What&apos;s Included / Key Capabilities (1 per line or comma-separated)</label>
                    <textarea
                      rows={3}
                      value={formData.featuresStr}
                      onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Deliverables &amp; Guarantees (1 per line or comma-separated)</label>
                    <textarea
                      rows={3}
                      value={formData.deliverablesStr}
                      onChange={(e) => setFormData({ ...formData, deliverablesStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="Production Ready Web App&#10;Clean Source Code&#10;Deployment & CI/CD Setup"
                    />
                  </div>

                  {/* Dynamic Workflow Process Steps */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-200 font-bold">Execution Workflow Steps</label>
                      <button
                        type="button"
                        onClick={addStep}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold hover:bg-cyan-500/20"
                      >
                        + Add Step
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formData.processSteps.map((step, sIdx) => (
                        <div key={sIdx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Step {sIdx + 1}</span>
                            {formData.processSteps.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStep(sIdx)}
                                className="text-[10px] text-rose-400 hover:text-rose-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleStepChange(sIdx, 'title', e.target.value)}
                            placeholder="Step Title (e.g. Discovery & System Design)"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                          />
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => handleStepChange(sIdx, 'description', e.target.value)}
                            placeholder="Step Description..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-slate-300 mb-1 font-semibold">Full Service Details (In-depth Overview) *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.fullDesc}
                      onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
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
                  form="service-form"
                  disabled={submitting}
                  className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Service
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
