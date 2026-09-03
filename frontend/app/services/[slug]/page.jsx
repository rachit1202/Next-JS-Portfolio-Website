import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Mail,
  Zap,
  Code2,
  Palette,
  Shield,
  Globe,
  Settings,
  HeadphonesIcon,
  Layers,
  Sparkles,
  Cpu,
  Clock,
  Send
} from 'lucide-react';
import { api } from '@/lib/api';
import { getItemMetadata } from '@/lib/seoHelper';

const CATEGORY_ICONS = {
  Development: <Code2 className="w-6 h-6 text-purple-400" />,
  Designing: <Palette className="w-6 h-6 text-cyan-400" />,
  Maintenance: <Settings className="w-6 h-6 text-amber-400" />,
  Security: <Shield className="w-6 h-6 text-emerald-400" />,
  SEO: <Globe className="w-6 h-6 text-indigo-400" />,
  Consultation: <HeadphonesIcon className="w-6 h-6 text-pink-400" />,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const serviceRes = await api.getServiceBySlug(slug).catch(() => null);
  const service = serviceRes?.data;
  if (!service) return { title: 'Service Not Found | Rachit Aggarwal' };

  return getItemMetadata({
    title: service.title,
    description: service.shortDesc || service.fullDesc,
    path: `/services/${slug}`,
    tags: [service.category, ...(service.techStack || []), 'Web Development Service', 'Freelance Developer'],
    type: 'website'
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const [serviceRes, siteConfigRes] = await Promise.all([
    api.getServiceBySlug(slug).catch(() => null),
    api.getSiteConfig().catch(() => null)
  ]);
  const service = serviceRes?.data;
  const config = siteConfigRes?.data || {};

  if (!service) notFound();

  const icon = CATEGORY_ICONS[service.category] || <Zap className="w-6 h-6 text-cyan-400" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Services
      </Link>

      {/* Hero Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)' }}
          >
            {service.category || 'Development'}
          </span>
          {service.priceEstimate && (
            <span className="px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
              Pricing: {service.priceEstimate}
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(6,182,212,0.15))',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {icon}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {service.shortDesc}
            </p>
          </div>
        </div>

        {/* Quick CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" /> Hire for This Service
          </Link>
          <a
            href="https://wa.me/919873088907"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* SECTION 1: Tech Stack Used */}
      {service.techStack && service.techStack.length > 0 && (
        <div className="glass-card rounded-3xl p-8 space-y-5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Technology Stack & Tools</h2>
          </div>
          <p className="text-xs text-slate-400">
            Enterprise-grade technologies and frameworks leveraged to engineer this solution:
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(147,51,234,0.1), rgba(6,182,212,0.08))',
                  border: '1px solid rgba(99,102,241,0.25)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: What We Provide & Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Features Checklist */}
        <div className="glass-card rounded-3xl p-8 space-y-5 border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">What&apos;s Included</h2>
            </div>
            <p className="text-xs text-slate-400">
              Key capabilities and features built into this offering:
            </p>
            <ul className="space-y-3 pt-2">
              {(service.features && service.features.length > 0 ? service.features : [
                `Tailored ${service.title} Architecture`,
                'High Performance & Responsive Delivery',
                'Comprehensive Testing & Verification',
                'Clean, Documented & Maintainable Code'
              ]).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tangible Deliverables */}
        <div className="glass-card rounded-3xl p-8 space-y-5 border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Deliverables &amp; Guarantees</h2>
            </div>
            <p className="text-xs text-slate-400">
              Tangible assets handed over upon project completion:
            </p>
            <ul className="space-y-3 pt-2">
              {(service.deliverables && service.deliverables.length > 0 ? service.deliverables : [
                `Production Ready ${service.title} Assets`,
                'Full Source Code & Architecture Notes',
                'Dedicated Support & Milestone Reviews'
              ]).map((del, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 mt-1.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-4 rounded-2xl space-y-1.5"
            style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.18)' }}
          >
            <p className="text-xs font-bold text-cyan-300">100% Quality &amp; Satisfaction Guarantee</p>
            <p className="text-[11px] text-slate-400">
              Customized specifically for {service.title}. Delivered with full QA testing and post-launch support.
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 3: Step-by-Step Execution Process */}
      {service.processSteps && service.processSteps.length > 0 && (
        <div className="space-y-6">
          <div>
            <p className="section-label mb-1">// WORKFLOW</p>
            <h2 className="text-2xl font-black text-white">How We Deliver This Service</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 space-y-3 border border-white/5 relative overflow-hidden"
              >
                <span
                  className="text-4xl font-black opacity-15 absolute top-3 right-4 select-none"
                  style={{ color: '#06b6d4' }}
                >
                  0{step.stepNumber || idx + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow"
                  style={{ background: 'linear-gradient(135deg, #9333ea, #06b6d4)' }}
                >
                  {step.stepNumber || idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: In-Depth Description */}
      {service.fullDesc && (
        <div className="glass-card rounded-3xl p-8 space-y-4 border border-white/5">
          <h2 className="text-xl font-bold text-white">Comprehensive Overview</h2>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
            {service.fullDesc}
          </div>
        </div>
      )}

      {/* SECTION 5: High-Converting CTA Banner */}
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
          <p className="section-label">{config.serviceCtaTagline || '// GET STARTED'}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {config.serviceCtaHeading && config.serviceCtaHeading.includes('{title}') ? (
              config.serviceCtaHeading.split('{title}').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="gradient-text">{service.title}</span>}
                </span>
              ))
            ) : (
              config.serviceCtaHeading || <>Ready to build with <span className="gradient-text">{service.title}</span>?</>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {config.serviceCtaSubtitle || "Let's schedule a quick call to discuss your exact project specs, timeline, and deliverables."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              {config.serviceCtaPrimaryBtn || 'Start Your Project'} <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`mailto:${config.email || 'rachitaggarwal1202@gmail.com'}`}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Mail className="w-4 h-4" /> {config.serviceCtaSecondaryBtn || 'Email Directly'}
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
