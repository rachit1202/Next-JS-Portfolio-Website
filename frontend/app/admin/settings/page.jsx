'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { api, defaultSiteConfig } from '@/lib/api';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestStatus, setEmailTestStatus] = useState(null);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadConfig();
  }, [router]);

  const loadConfig = async () => {
    try {
      const res = await api.getSiteConfig();
      if (res.data) {
        setConfig(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await api.updateSiteConfig(config);
      setSuccess('Site settings & profile updated successfully!');
      if (res.data) {
        setConfig(res.data);
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestStatus(null);
    try {
      // First save configuration so latest values are stored
      await api.updateSiteConfig(config);

      const target = (config.leadNotificationEmails || 'aggarwalrachit1202@gmail.com').split(',')[0].trim();
      const res = await api.testEmail({
        targetEmail: target,
        customConfig: {
          smtpHost: config.smtpHost || 'smtp.gmail.com',
          smtpPort: config.smtpPort || 465,
          smtpUser: config.smtpUser || 'aggarwalrachit1202@gmail.com',
          smtpPass: config.smtpPass || ''
        }
      });
      if (res.success) {
        setEmailTestStatus({ ok: true, msg: res.message || `Test email delivered successfully to ${target}!` });
      } else {
        setEmailTestStatus({ ok: false, msg: res.message || 'Failed to send test email.' });
      }
    } catch (err) {
      setEmailTestStatus({ ok: false, msg: err.message || 'Error communicating with mail server.' });
    } finally {
      setTestingEmail(false);
    }
  };

  // About Bio paragraphs management
  const addBioParagraph = () => {
    setConfig({
      ...config,
      aboutBio: [...(config.aboutBio || []), '']
    });
  };

  const updateBioParagraph = (index, value) => {
    const updated = [...(config.aboutBio || [])];
    updated[index] = value;
    setConfig({ ...config, aboutBio: updated });
  };

  const removeBioParagraph = (index) => {
    setConfig({
      ...config,
      aboutBio: (config.aboutBio || []).filter((_, i) => i !== index)
    });
  };

  // Skill management
  const addSkill = () => {
    setConfig({
      ...config,
      skills: [...(config.skills || []), { name: 'New Skill', category: 'Frontend', level: 90, icon: 'Code2' }]
    });
  };

  const updateSkill = (index, field, value) => {
    const updated = [...(config.skills || [])];
    updated[index][field] = value;
    setConfig({ ...config, skills: updated });
  };

  const removeSkill = (index) => {
    setConfig({
      ...config,
      skills: (config.skills || []).filter((_, i) => i !== index)
    });
  };

  // Experience management
  const addExperience = () => {
    setConfig({
      ...config,
      experiences: [
        {
          company: 'New Company',
          role: 'Web Developer',
          period: '2025 – Present',
          location: 'Delhi, India',
          type: 'Full-time',
          description: 'Role overview and key deliverables.',
          highlights: ['Next.js microservices', 'Database architecture']
        },
        ...(config.experiences || [])
      ]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...(config.experiences || [])];
    updated[index][field] = value;
    setConfig({ ...config, experiences: updated });
  };

  const addHighlight = (expIndex) => {
    const updated = [...(config.experiences || [])];
    updated[expIndex].highlights = [...(updated[expIndex].highlights || []), ''];
    setConfig({ ...config, experiences: updated });
  };

  const updateHighlight = (expIndex, hlIndex, value) => {
    const updated = [...(config.experiences || [])];
    const highlights = [...(updated[expIndex].highlights || [])];
    highlights[hlIndex] = value;
    updated[expIndex].highlights = highlights;
    setConfig({ ...config, experiences: updated });
  };

  const removeHighlight = (expIndex, hlIndex) => {
    const updated = [...(config.experiences || [])];
    updated[expIndex].highlights = (updated[expIndex].highlights || []).filter((_, i) => i !== hlIndex);
    setConfig({ ...config, experiences: updated });
  };

  const removeExperience = (index) => {
    setConfig({
      ...config,
      experiences: (config.experiences || []).filter((_, i) => i !== index)
    });
  };

  // Education management
  const addEducation = () => {
    setConfig({
      ...config,
      education: [
        ...(config.education || []),
        {
          institution: 'University Name',
          degree: 'Degree Name',
          field: 'Information Technology',
          period: '2025 – 2028',
          description: ''
        }
      ]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...(config.education || [])];
    updated[index][field] = value;
    setConfig({ ...config, education: updated });
  };

  const removeEducation = (index) => {
    setConfig({
      ...config,
      education: (config.education || []).filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#07080f] text-slate-100">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:p-8 space-y-6 overflow-y-auto w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" /> Site &amp; Profile CMS
            </h1>
            <p className="text-xs text-slate-400">
              Manage personal info, contact details, home banners, skills, and resume without touching code
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </button>
        </div>

        {/* Notifications */}
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'profile', label: 'Personal & Avatar' },
            { id: 'contact', label: 'Contact & Socials' },
            { id: 'cta', label: 'CTA & Conversion Banners' },
            { id: 'footer', label: 'Footer CMS' },
            { id: 'home', label: 'Home Page Texts' },
            { id: 'skills', label: 'Technical Skills' },
            { id: 'experience', label: 'Work Experience' },
            { id: 'education', label: 'Education' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                  ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Glass Card Form Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">

          {/* TAB 1: Profile & Avatar */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                    <input
                      type="text"
                      value={config.name || ''}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Professional Role / Title</label>
                    <input
                      type="text"
                      value={config.role || ''}
                      onChange={(e) => setConfig({ ...config, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Avatar / Photo URL</label>
                    <input
                      type="text"
                      value={config.avatarUrl || ''}
                      onChange={(e) => setConfig({ ...config, avatarUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="https://... or /logo.webp"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">CV / Resume Link (PDF or Drive)</label>
                    <input
                      type="text"
                      value={config.cvUrl || ''}
                      onChange={(e) => setConfig({ ...config, cvUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="https://... or /resume.pdf"
                    />
                  </div>
                </div>

                {/* Metrics 4-Grid */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Metrics &amp; Achievement Counters</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Experience</label>
                      <input
                        type="text"
                        value={config.experienceYears || ''}
                        onChange={(e) => setConfig({ ...config, experienceYears: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Completed Projects</label>
                      <input
                        type="text"
                        value={config.completedProjects || ''}
                        onChange={(e) => setConfig({ ...config, completedProjects: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Happy Clients</label>
                      <input
                        type="text"
                        value={config.happyClients || ''}
                        onChange={(e) => setConfig({ ...config, happyClients: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Satisfaction Rate</label>
                      <input
                        type="text"
                        value={config.satisfactionRate || ''}
                        onChange={(e) => setConfig({ ...config, satisfactionRate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Short Bio (Hero &amp; Footer)</label>
                  <textarea
                    rows={2}
                    value={config.shortBio || ''}
                    onChange={(e) => setConfig({ ...config, shortBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">About Page Headline</label>
                  <input
                    type="text"
                    value={config.aboutHeadline || ''}
                    onChange={(e) => setConfig({ ...config, aboutHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* About Bio Paragraphs Editor */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">About Page Bio Paragraphs</span>
                    <button
                      type="button"
                      onClick={addBioParagraph}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add Paragraph
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">These paragraphs appear in the About Me section on the /about page. Each entry is a separate paragraph.</p>
                  <div className="space-y-2">
                    {(config.aboutBio || []).map((para, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="flex-shrink-0 w-5 h-5 mt-2 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[9px] font-bold text-purple-300">
                          {idx + 1}
                        </div>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => updateBioParagraph(idx, e.target.value)}
                          placeholder={`Paragraph ${idx + 1}...`}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeBioParagraph(idx)}
                          className="flex-shrink-0 mt-1.5 p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                          title="Remove paragraph"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {(!config.aboutBio || config.aboutBio.length === 0) && (
                      <p className="text-center text-slate-500 text-[11px] py-4">No paragraphs yet. Click &ldquo;Add Paragraph&rdquo; to begin.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Avatar & Brand Card Preview */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Profile Card Preview</span>

                  <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl shadow-purple-500/20 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={config.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'}
                      alt={config.name || 'Rachit Aggarwal'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{config.name || 'Rachit Aggarwal'}</h3>
                    <p className="text-xs text-purple-400 font-medium">{config.role || 'Full-Stack Developer'}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {config.availabilityStatus || 'Available for freelance work'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-900 pt-3">
                    &ldquo;{config.shortBio || 'Senior Web Developer crafting fast, elegant web apps.'}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Contact & Socials */}
          {activeTab === 'contact' && (
            <div className="space-y-6 text-xs">
              {/* Direct Channels */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" /> Direct Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      value={config.email || ''}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      value={config.phone || ''}
                      onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">WhatsApp Number</label>
                    <input
                      type="text"
                      value={config.whatsapp || ''}
                      onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Location / Address</label>
                    <input
                      type="text"
                      value={config.location || ''}
                      onChange={(e) => setConfig({ ...config, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Website Destination URL</label>
                    <input
                      type="text"
                      value={config.websiteUrl || ''}
                      onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
                      placeholder="https://rachitaggarwal.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Website Display Label</label>
                    <input
                      type="text"
                      value={config.websiteLabel || ''}
                      onChange={(e) => setConfig({ ...config, websiteLabel: e.target.value })}
                      placeholder="rachitaggarwal.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Connect Online (Socials) */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" /> Connect Online Profiles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={config.githubUrl || ''}
                      onChange={(e) => setConfig({ ...config, githubUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">GitHub Display Handle</label>
                    <input
                      type="text"
                      value={config.githubUsername || ''}
                      onChange={(e) => setConfig({ ...config, githubUsername: e.target.value })}
                      placeholder="@rachit1202"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={config.linkedinUrl || ''}
                      onChange={(e) => setConfig({ ...config, linkedinUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">LinkedIn Display Handle</label>
                    <input
                      type="text"
                      value={config.linkedinUsername || ''}
                      onChange={(e) => setConfig({ ...config, linkedinUsername: e.target.value })}
                      placeholder="in/rachit-aggarwal-b9492b248"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Twitter / X URL</label>
                  <input
                    type="text"
                    value={config.twitterUrl || ''}
                    onChange={(e) => setConfig({ ...config, twitterUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Lead Notification Email & SMTP Configuration */}
              <div className="space-y-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400" /> Lead Notification Email(s) &amp; SMTP Setup
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Configure recipient email addresses and connect your Gmail/SMTP server for instant real-time lead delivery
                    </p>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    {(config.leadNotificationEmails || 'aggarwalrachit1202@gmail.com').split(',').filter(Boolean).length} Active Recipient(s)
                  </span>
                </div>

                {/* Recipient Emails */}
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Recipient Notification Email(s) <span className="text-slate-400 font-normal">(comma-separated for multiple addresses)</span>
                  </label>
                  <input
                    type="text"
                    value={config.leadNotificationEmails || ''}
                    onChange={(e) => setConfig({ ...config, leadNotificationEmails: e.target.value })}
                    placeholder="aggarwalrachit1202@gmail.com, team@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Jab bhi koi client website par contact form fill karega, lead CMS inbox ke sath sath in sabhi emails par real-time dispatch hogi.
                  </p>
                </div>

                {/* SMTP Credentials */}
                <div className="pt-2 border-t border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      ⚡ SMTP / Gmail Sender Configuration
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Standard: <code className="text-purple-300">smtp.gmail.com:465</code>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 mb-1 font-semibold">Sender Email / Gmail Address</label>
                      <input
                        type="text"
                        value={config.smtpUser || ''}
                        onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                        placeholder="aggarwalrachit1202@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">SMTP Host</label>
                      <input
                        type="text"
                        value={config.smtpHost || 'smtp.gmail.com'}
                        onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 mb-1 font-semibold">
                        Gmail App Password / SMTP Password <span className="text-amber-400 text-[10px]">(16-Digit App Password)</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showSmtpPass ? 'text' : 'password'}
                          value={config.smtpPass || ''}
                          onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                          placeholder="xxxx xxxx xxxx xxxx"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPass(!showSmtpPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                          title={showSmtpPass ? 'Hide password' : 'Show password'}
                        >
                          {showSmtpPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Port</label>
                      <input
                        type="number"
                        value={config.smtpPort || 465}
                        onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                        placeholder="465"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Gmail App Password Guide Note */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                    <strong className="text-purple-300 flex items-center gap-1.5">
                      💡 Gmail App Password kaise generate karein (30 seconds):
                    </strong>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                      <li>Apne Google Account (<a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">myaccount.google.com/security</a>) par jayein.</li>
                      <li><strong>2-Step Verification</strong> on hona chahiye.</li>
                      <li>Search bar me <strong>&ldquo;App passwords&rdquo;</strong> search karein.</li>
                      <li>App Name me &ldquo;Portfolio Website&rdquo; likhkar <strong>Create</strong> karein &mdash; 16-letter password copy karke upar paste kar dein.</li>
                    </ol>
                  </div>

                  {/* Test Email Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      {testingEmail ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing Connection...
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" /> Send Test Email Now
                        </>
                      )}
                    </button>

                    {emailTestStatus && (
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-xl border ${
                        emailTestStatus.ok
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {emailTestStatus.ok ? '✅ ' : '❌ '} {emailTestStatus.msg}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability & Working Hours */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Availability &amp; Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Availability Status Badge</label>
                    <input
                      type="text"
                      value={config.availabilityStatus || ''}
                      onChange={(e) => setConfig({ ...config, availabilityStatus: e.target.value })}
                      placeholder="Available for freelance work"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Working Hours / Timezone</label>
                    <input
                      type="text"
                      value={config.workingHours || ''}
                      onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
                      placeholder="Mon–Sat: 9AM – 8PM IST"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Form Dynamic Dropdowns */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Contact Form Dropdown Fields
                </h3>
                <p className="text-[11px] text-slate-400">
                  Customize the options available in the &ldquo;Service Required&rdquo; and &ldquo;Estimated Budget&rdquo; dropdown menus. Enter each option on a new line or separated by commas.
                </p>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">&ldquo;Service Required&rdquo; Options (1 per line)</label>
                  <textarea
                    rows={4}
                    value={Array.isArray(config.contactFormServices) ? config.contactFormServices.join('\n') : (config.contactFormServices || '')}
                    onChange={(e) => setConfig({ ...config, contactFormServices: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Full-Stack Web Development&#10;Custom WordPress & PHP Solutions&#10;UI/UX Design & High-Fidelity Figma&#10;Cyber Security Hardening & Penetration Testing&#10;SEO & Search Engine Dominance&#10;Website Maintenance & Speed Optimization"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">&ldquo;Estimated Budget&rdquo; Options (1 per line)</label>
                  <textarea
                    rows={3}
                    value={Array.isArray(config.contactFormBudgets) ? config.contactFormBudgets.join('\n') : (config.contactFormBudgets || '')}
                    onChange={(e) => setConfig({ ...config, contactFormBudgets: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Under ₹40K&#10;₹40K - ₹1.2L&#10;₹1.2L - ₹2.5L&#10;₹2.5L+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CTA & Conversion Banners */}
          {activeTab === 'cta' && (
            <div className="space-y-6 text-xs">
              {/* Project Detail Page CTA Banner */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-400" /> Single Project Detail CTA Banner
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Appears at the bottom of every project case study page (`/projects/[slug]`). Use <code className="text-cyan-300 font-mono">&#123;title&#125;</code> as placeholder for the dynamic project title.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Top Tagline</label>
                    <input
                      type="text"
                      value={config.projectCtaTagline || ''}
                      onChange={(e) => setConfig({ ...config, projectCtaTagline: e.target.value })}
                      placeholder="// INTERESTED IN SIMILAR WORK?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Main Headline Template</label>
                    <input
                      type="text"
                      value={config.projectCtaHeading || ''}
                      onChange={(e) => setConfig({ ...config, projectCtaHeading: e.target.value })}
                      placeholder="Need a high-impact platform like {title}?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Sub-heading / Description</label>
                  <textarea
                    rows={2}
                    value={config.projectCtaSubtitle || ''}
                    onChange={(e) => setConfig({ ...config, projectCtaSubtitle: e.target.value })}
                    placeholder="Let's build something exceptional for your business or startup."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Primary Button Text (Links to Contact)</label>
                    <input
                      type="text"
                      value={config.projectCtaPrimaryBtn || ''}
                      onChange={(e) => setConfig({ ...config, projectCtaPrimaryBtn: e.target.value })}
                      placeholder="Start a Conversation"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Secondary Button Text (Links to Projects)</label>
                    <input
                      type="text"
                      value={config.projectCtaSecondaryBtn || ''}
                      onChange={(e) => setConfig({ ...config, projectCtaSecondaryBtn: e.target.value })}
                      placeholder="Explore More Projects"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Service Detail Page CTA Banner */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Single Service Detail CTA Banner
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Appears at the bottom of every service offering page (`/services/[slug]`). Use <code className="text-cyan-300 font-mono">&#123;title&#125;</code> as placeholder for the dynamic service title.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Top Tagline</label>
                    <input
                      type="text"
                      value={config.serviceCtaTagline || ''}
                      onChange={(e) => setConfig({ ...config, serviceCtaTagline: e.target.value })}
                      placeholder="// GET STARTED"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Main Headline Template</label>
                    <input
                      type="text"
                      value={config.serviceCtaHeading || ''}
                      onChange={(e) => setConfig({ ...config, serviceCtaHeading: e.target.value })}
                      placeholder="Ready to build with {title}?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Sub-heading / Description</label>
                  <textarea
                    rows={2}
                    value={config.serviceCtaSubtitle || ''}
                    onChange={(e) => setConfig({ ...config, serviceCtaSubtitle: e.target.value })}
                    placeholder="Let's schedule a quick call to discuss your exact project specs, timeline, and deliverables."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Primary Button Text</label>
                    <input
                      type="text"
                      value={config.serviceCtaPrimaryBtn || ''}
                      onChange={(e) => setConfig({ ...config, serviceCtaPrimaryBtn: e.target.value })}
                      placeholder="Start Your Project"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Secondary Button Text</label>
                    <input
                      type="text"
                      value={config.serviceCtaSecondaryBtn || ''}
                      onChange={(e) => setConfig({ ...config, serviceCtaSecondaryBtn: e.target.value })}
                      placeholder="Email Directly"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Home Page Bottom CTA Banner */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" /> Home Page Bottom CTA Banner
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Headline</label>
                    <input
                      type="text"
                      value={config.ctaHeading || ''}
                      onChange={(e) => setConfig({ ...config, ctaHeading: e.target.value })}
                      placeholder="Ready to bring your vision to life?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Subtitle</label>
                    <input
                      type="text"
                      value={config.ctaSubtitle || ''}
                      onChange={(e) => setConfig({ ...config, ctaSubtitle: e.target.value })}
                      placeholder="Whether it's a startup MVP, enterprise platform, or WordPress site — let's make it happen."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Footer CMS */}
          {activeTab === 'footer' && (
            <div className="space-y-6 text-xs">
              {/* Footer Top CTA Banner */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Footer Top CTA Banner
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Appears at the top of the footer across every page. (Tip: Enter text with 2 lines to highlight the second line with a glowing gradient).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Top Tagline</label>
                    <input
                      type="text"
                      value={config.footerTagline || ''}
                      onChange={(e) => setConfig({ ...config, footerTagline: e.target.value })}
                      placeholder="// LET'S COLLABORATE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Button Text</label>
                    <input
                      type="text"
                      value={config.footerButtonText || ''}
                      onChange={(e) => setConfig({ ...config, footerButtonText: e.target.value })}
                      placeholder="Start a Project"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Main Heading (Use 2 lines for gradient on line 2)</label>
                  <textarea
                    rows={2}
                    value={config.footerHeading || ''}
                    onChange={(e) => setConfig({ ...config, footerHeading: e.target.value })}
                    placeholder="Have a project in mind?&#10;Let's build it together."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Button Destination Link</label>
                  <input
                    type="text"
                    value={config.footerButtonUrl || ''}
                    onChange={(e) => setConfig({ ...config, footerButtonUrl: e.target.value })}
                    placeholder="/contact"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Footer Brand & Copyright */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" /> Brand Bio &amp; Copyright Notice
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Short Bio (Displayed under the logo in footer)</label>
                  <textarea
                    rows={2}
                    value={config.footerShortBio || ''}
                    onChange={(e) => setConfig({ ...config, footerShortBio: e.target.value })}
                    placeholder="Senior Web Developer crafting fast, elegant, and scalable digital solutions using Next.js, Node.js, Fastify & WordPress."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Copyright Line (Use &#123;year&#125; for dynamic current year)</label>
                  <input
                    type="text"
                    value={config.footerCopyrightText || ''}
                    onChange={(e) => setConfig({ ...config, footerCopyrightText: e.target.value })}
                    placeholder="© {year} Rachit Aggarwal. All rights reserved."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Note about Dynamic Skills */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <div>
                  <p className="font-bold text-white">Dynamic &ldquo;Core Expertise&rdquo; Skills:</p>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    The skill badges in the Footer (&ldquo;Core Expertise&rdquo;) are automatically synchronized from the <strong>Technical Skills</strong> tab. Whenever you add or edit skills there, the footer updates instantly!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Home Page Texts */}
          {activeTab === 'home' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hero Word 1</label>
                  <input
                    type="text"
                    value={config.heroTitleWord1 || ''}
                    onChange={(e) => setConfig({ ...config, heroTitleWord1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hero Word 2 (Gradient)</label>
                  <input
                    type="text"
                    value={config.heroTitleWord2 || ''}
                    onChange={(e) => setConfig({ ...config, heroTitleWord2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Hero Word 3</label>
                  <input
                    type="text"
                    value={config.heroTitleWord3 || ''}
                    onChange={(e) => setConfig({ ...config, heroTitleWord3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Hero Lead Description</label>
                <textarea
                  rows={2}
                  value={config.heroDescription || ''}
                  onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Bottom CTA Headline</label>
                  <input
                    type="text"
                    value={config.ctaHeading || ''}
                    onChange={(e) => setConfig({ ...config, ctaHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Bottom CTA Subtitle</label>
                  <input
                    type="text"
                    value={config.ctaSubtitle || ''}
                    onChange={(e) => setConfig({ ...config, ctaSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Technical Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Manage technical skills shown in the Technical Arsenal section</p>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(config.skills || []).map((skill, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                          placeholder="Skill Name"
                        />
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                        >
                          <option>Frontend</option>
                          <option>Backend</option>
                          <option>Database</option>
                          <option>CMS</option>
                          <option>Architecture</option>
                          <option>Styling</option>
                          <option>DevOps</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">Proficiency:</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(idx, 'level', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-center"
                        />
                        <span className="text-slate-400 text-[10px]">%</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Work Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Manage career experience shown on the About page</p>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {(config.experiences || []).map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">Position #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Period (e.g. 2025 – Present)"
                        value={exp.period}
                        onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Description of responsibilities and impact"
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />

                    {/* Highlights / Bullet Points */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Highlights (Bullet Points)</span>
                        <button
                          type="button"
                          onClick={() => addHighlight(idx)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold cursor-pointer transition-all"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add Highlight
                        </button>
                      </div>
                      {(exp.highlights || []).map((hl, hlIdx) => (
                        <div key={hlIdx} className="flex gap-2 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => updateHighlight(idx, hlIdx, e.target.value)}
                            placeholder="e.g. Next.js & Fastify microservices"
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeHighlight(idx, hlIdx)}
                            className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!exp.highlights || exp.highlights.length === 0) && (
                        <p className="text-[10px] text-slate-600 italic">No highlights yet. Add bullet points shown below the experience description.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Education */}
          {activeTab === 'education' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Manage academic qualifications shown on the About page</p>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              </div>

              <div className="space-y-4">
                {(config.education || []).map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-400">Degree #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Institution / University"
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Degree Name"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Period (e.g. 2025 – 2028)"
                        value={edu.period}
                        onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Details about course or achievements"
                      value={edu.description || ''}
                      onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
