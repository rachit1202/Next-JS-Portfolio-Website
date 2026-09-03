import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft, User, Code2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Layers, Cpu } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';
import { api } from '@/lib/api';
import { getItemMetadata } from '@/lib/seoHelper';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const projectRes = await api.getProjectBySlug(slug).catch(() => null);
  const project = projectRes?.data;

  if (!project) {
    return { title: 'Project Not Found | Rachit Aggarwal' };
  }

  return getItemMetadata({
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.shortDescription,
    coverImage: project.coverImage,
    path: `/projects/${slug}`,
    tags: [...(project.techStack || []), project.category, 'Web Project', 'Next.js', 'Fastify'],
    type: 'website'
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const [projectRes, siteConfigRes] = await Promise.all([
    api.getProjectBySlug(slug).catch(() => null),
    api.getSiteConfig().catch(() => null)
  ]);
  const project = projectRes?.data;
  const config = siteConfigRes?.data || {};

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Projects
      </Link>

      {/* Main Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)' }}
          >
            {project.category || 'Full-Stack'}
          </span>
          {project.clientName && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-white/5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Client: {project.clientName}
            </span>
          )}
          {project.role && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-white/5">
              <Code2 className="w-3.5 h-3.5 text-purple-400" /> Role: {project.role}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap gap-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Visit Live Project <ExternalLink className="w-4 h-4 text-cyan-300" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <GithubIcon className="w-4 h-4 text-purple-400" /> GitHub Repository
            </a>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200'}
          alt={project.title}
          className="w-full max-h-[520px] object-cover"
        />
      </div>

      {/* Details & Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Case Study */}
        <div className="md:col-span-2 space-y-6 glass-card p-8 rounded-3xl border border-white/5">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Project Overview & Architecture</h2>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line article-content">
            {project.fullDescription}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Technologies Used</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery & Highlights */}
          <div className="glass-card p-6 rounded-3xl space-y-3.5 border border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Engineering Quality</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {project.engineeringQuality || 'Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata.'}
            </p>
          </div>
        </div>

      </div>

      {/* High-Converting CTA Banner */}
      <div
        className="rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center space-y-6"
        style={{
          background: 'linear-gradient(135deg, rgba(147,51,234,0.18) 0%, rgba(99,102,241,0.12) 50%, rgba(6,182,212,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
        }}
      >
        <div className="glow-orb glow-purple w-64 h-64 -top-20 -right-20 opacity-30 absolute" />
        <div className="glow-orb glow-cyan w-64 h-64 -bottom-20 -left-20 opacity-20 absolute" />

        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <p className="section-label">{config.projectCtaTagline || '// INTERESTED IN SIMILAR WORK?'}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {project.customCtaHeading || (
              config.projectCtaHeading && config.projectCtaHeading.includes('{title}') ? (
                config.projectCtaHeading.split('{title}').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="gradient-text">{project.title}</span>}
                  </span>
                ))
              ) : (
                config.projectCtaHeading || <>Need a high-impact platform like <span className="gradient-text">{project.title}</span>?</>
              )
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {project.customCtaSubtitle || config.projectCtaSubtitle || "Let's build something exceptional for your business or startup."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {config.projectCtaPrimaryBtn || 'Start a Conversation'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              {config.projectCtaSecondaryBtn || 'Explore More Projects'}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
