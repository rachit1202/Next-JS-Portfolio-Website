import Link from 'next/link';
import { Briefcase, GraduationCap, Mail, ArrowRight, ChevronRight, Download, MapPin, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { api, defaultSiteConfig } from '@/lib/api';
import { getPageMetadata } from '@/lib/seoHelper';

export async function generateMetadata() {
  return getPageMetadata('about', {
    title: 'About Rachit Aggarwal | Senior Web Developer & Architect',
    description: 'Career overview, work experience, education, and technical capabilities of Rachit Aggarwal. Full-Stack developer specializing in Next.js, Fastify, Node.js, and WordPress.'
  });
}

export default async function AboutPage() {
  const siteConfigRes = await api.getSiteConfig().catch(() => null);
  const config = siteConfigRes?.data || defaultSiteConfig;

  const experiences = config.experiences || defaultSiteConfig.experiences;
  const education = config.education || defaultSiteConfig.education;
  const bioParagraphs = config.aboutBio && config.aboutBio.length > 0 ? config.aboutBio : defaultSiteConfig.aboutBio;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

      {/* ===== HERO / ABOUT ME ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        {/* Left: Content */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in">
          <div>
            <p className="section-label mb-3">// ABOUT ME</p>
            <h1 className="text-4xl font-black text-white leading-tight">
              {config.aboutHeadline || 'Crafting the web with precision & passion.'}
            </h1>
          </div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            {bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/contact"
              className="btn-primary flex items-center gap-2 text-sm px-6 py-3"
            >
              Hire Me <ArrowRight className="w-4 h-4" />
            </Link>
            {config.cvUrl && (
              <a
                href={config.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost flex items-center gap-2 text-sm px-6 py-3"
              >
                <Download className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                Download CV
              </a>
            )}
          </div>
        </div>

        {/* Right: Profile Image with Floating Badges */}
        <div className="lg:col-span-2 relative animate-fade-in-up">
          <div className="relative">
            {/* Projects Badge */}
            <div
              className="absolute -top-4 -left-4 z-20 px-4 py-2 rounded-2xl text-xs font-bold animate-float text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {config.completedProjects || '25+'} Projects Delivered ✦
            </div>

            {/* Profile Avatar / Image */}
            <div
              className="rounded-3xl overflow-hidden shadow-2xl bg-slate-900"
              style={{ border: '2px solid rgba(99,102,241,0.25)' }}
            >
              <img
                src={config.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'}
                alt={`${config.name || 'Rachit Aggarwal'} - Senior Web Developer`}
                className="w-full h-120 lg:h-[450px] object-cover"
              />
            </div>

            {/* Years Experience Badge */}
            <div
              className="absolute -bottom-4 -right-4 z-20 px-5 py-3.5 rounded-2xl text-center glass-card shadow-2xl"
            >
              <span
                className="block text-2xl sm:text-3xl font-black gradient-text"
              >
                {config.experienceYears || '3+'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">
                Years of<br />Experience
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EXECUTIVE QUICK CONTACT & STATUS HUB (2x2 Mobile, 4-Col Desktop) ===== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 animate-fade-in">
        {/* Card 1: Email */}
        <div className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#07080f] border border-purple-500/20 hover:border-purple-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[135px] sm:min-h-[155px] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-purple-500/15 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10 shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold whitespace-nowrap">
              Direct Mail
            </span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono font-semibold">Email Address</p>
            <a
              href={`mailto:${config.email || 'rachitaggarwal1202@gmail.com'}`}
              className="text-[11px] sm:text-[13px] font-bold text-white hover:text-purple-300 transition-colors break-all block leading-tight"
              title={config.email || 'rachitaggarwal1202@gmail.com'}
            >
              {config.email || 'rachitaggarwal1202@gmail.com'}
            </a>
          </div>
        </div>

        {/* Card 2: Phone */}
        <div className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#07080f] border border-cyan-500/20 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[135px] sm:min-h-[155px] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10 shrink-0">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold whitespace-nowrap">
              WhatsApp
            </span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono font-semibold">Contact Phone</p>
            <a
              href={`tel:${config.phone || '+919873088907'}`}
              className="text-[11px] sm:text-[13px] font-bold text-white hover:text-cyan-300 transition-colors block leading-tight whitespace-nowrap"
            >
              {config.phone || '+91 9873088907'}
            </a>
          </div>
        </div>

        {/* Card 3: Location */}
        <div className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#07080f] border border-indigo-500/20 hover:border-indigo-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[135px] sm:min-h-[155px] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10 shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold whitespace-nowrap">
              Delhi, India
            </span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono font-semibold">Location</p>
            <p className="text-[11px] sm:text-[13px] font-bold text-white leading-tight">
              {config.location || 'Rohini, New Delhi 110085, India'}
            </p>
          </div>
        </div>

        {/* Card 4: Availability */}
        <div className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#07080f] border border-emerald-500/20 hover:border-emerald-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between min-h-[135px] sm:min-h-[155px] overflow-hidden">
          <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono font-semibold">Work Status</p>
            <p className="text-[11px] sm:text-[13px] font-bold text-emerald-300 leading-tight">
              {config.availabilityStatus || 'Available for freelance work'}
            </p>
          </div>
        </div>
      </section>

      {/* ===== TECHNICAL SKILLS ===== */}
      <ScrollReveal>
        <section className="space-y-6">
          <div>
            <p className="section-label mb-2">// EXPERTISE</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Core Technologies &amp; Tools</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {(config.skills || defaultSiteConfig.skills).map((skill) => (
              <div
                key={skill.name}
                className="px-4 py-2.5 rounded-2xl bg-[#0e0e1a]/90 hover:bg-[#151528] border border-indigo-500/20 hover:border-cyan-400/50 flex items-center gap-4 transition-all duration-300 hover:scale-105 shadow-lg shadow-black/40 group cursor-default"
                style={{
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors">{skill.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ===== WORK EXPERIENCE ===== */}
      <ScrollReveal>
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)', color: '#c084fc' }}
            >
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="section-label">// CAREER TIMELINE</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Work Experience</h2>
            </div>
          </div>

          <div className="relative">
            {/* Glowing Gradient Timeline line */}
            <div
              className="absolute left-3.5 sm:left-4 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #9333ea 0%, #6366f1 50%, #06b6d4 100%)',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.6), 0 0 30px rgba(6, 182, 212, 0.3)',
              }}
            />

            <div className="space-y-8">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative flex items-start group">
                  {/* Perfectly Centered Glowing Directional Arrow Badge on the Line */}
                  <div className="w-7 sm:w-8 shrink-0 flex items-center justify-center pt-6 z-10">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-115 shadow-xl"
                      style={{
                        background: '#0a0a14',
                        border: idx === 0 ? '2px solid #06b6d4' : '2px solid rgba(99, 102, 241, 0.6)',
                        boxShadow: idx === 0
                          ? '0 0 16px rgba(6,182,212,0.8), inset 0 0 8px rgba(6,182,212,0.3)'
                          : '0 0 12px rgba(99,102,241,0.5)',
                      }}
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 ${idx === 0 ? 'text-cyan-400' : 'text-purple-400 group-hover:text-cyan-300'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Experience Card */}
                  <div className="flex-1 ml-4 sm:ml-6 glass-card rounded-3xl p-7 space-y-4 border border-indigo-500/15 hover:border-indigo-500/35 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-indigo-950/20">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{exp.role}</h3>
                        <p className="text-xs sm:text-sm font-semibold gradient-text mt-0.5">
                          @ {exp.company}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{exp.location}</p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1.5">
                        <span
                          className="px-3.5 py-1 rounded-full text-xs font-bold w-fit text-white shadow-lg"
                          style={{
                            background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          {exp.period}
                        </span>
                        {exp.type && (
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold w-fit text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          >
                            {exp.type}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{exp.description}</p>

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        {exp.highlights.map((h, hi) => (
                          <span
                            key={hi}
                            className="flex items-center gap-1.5 text-xs text-slate-200 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ===== EDUCATION ===== */}
      <ScrollReveal>
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}
            >
              <GraduationCap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="section-label">// ACADEMIC BACKGROUND</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Education &amp; Qualifications</h2>
            </div>
          </div>

          <div className="relative">
            {/* Glowing Gradient Timeline line for Education */}
            <div
              className="absolute left-3.5 sm:left-4 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #06b6d4 0%, #6366f1 50%, #9333ea 100%)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
              }}
            />

            <div className="space-y-8">
              {education.map((edu, idx) => (
                <div key={idx} className="relative flex items-start group">
                  {/* Perfectly Centered Glowing Directional Arrow Badge on the Line */}
                  <div className="w-7 sm:w-8 shrink-0 flex items-center justify-center pt-6 z-10">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-115 shadow-xl"
                      style={{
                        background: '#0a0a14',
                        border: idx === 0 ? '2px solid #06b6d4' : '2px solid rgba(6, 182, 212, 0.5)',
                        boxShadow: idx === 0
                          ? '0 0 16px rgba(6,182,212,0.8), inset 0 0 8px rgba(6,182,212,0.3)'
                          : '0 0 12px rgba(6,182,212,0.4)',
                      }}
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 ${idx === 0 ? 'text-cyan-400' : 'text-cyan-300 group-hover:text-white'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Education Card */}
                  <div className="flex-1 ml-4 sm:ml-6 glass-card rounded-3xl p-7 space-y-3 border border-cyan-500/15 hover:border-cyan-500/35 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-cyan-950/20">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {edu.institution}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold gradient-text mt-0.5">{edu.degree}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{edu.field}</p>
                      </div>
                      <span
                        className="px-3.5 py-1 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 w-fit shadow-md shrink-0"
                      >
                        {edu.period}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 border-t border-white/5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
