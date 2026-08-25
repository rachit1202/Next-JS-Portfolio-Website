import Link from 'next/link';
import { Briefcase, GraduationCap, Mail, ArrowRight, ChevronRight, Download, MapPin, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { api, defaultSiteConfig } from '@/lib/api';

export const metadata = {
  title: 'About Rachit Aggarwal | Senior Web Developer',
  description: 'Career overview, work experience, education, and technical capabilities of Rachit Aggarwal. Full-Stack developer specializing in Next.js, Fastify, Node.js, and WordPress.'
};

export default async function AboutPage() {
  const siteConfigRes = await api.getSiteConfig().catch(() => null);
  const config = siteConfigRes?.data || defaultSiteConfig;

  const experiences = config.experiences || defaultSiteConfig.experiences;
  const education = config.education || defaultSiteConfig.education;
  const bioParagraphs = config.aboutBio && config.aboutBio.length > 0 ? config.aboutBio : defaultSiteConfig.aboutBio;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

      {/* ===== HERO / ABOUT ME ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Left: Content */}
        <div className="lg:col-span-3 space-y-8 animate-fade-in">
          <div>
            <p className="section-label mb-3">// ABOUT ME</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              {config.aboutHeadline || 'Crafting the web with precision & passion.'}
            </h1>
          </div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            {bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Mail className="w-4 h-4 text-purple-400" />, label: 'Email', value: config.email || 'rachitaggarwal1202@gmail.com', href: `mailto:${config.email || 'rachitaggarwal1202@gmail.com'}` },
              { icon: <Phone className="w-4 h-4 text-cyan-400" />, label: 'Phone', value: config.phone || '+91 9873088907', href: `tel:${config.phone || '+919873088907'}` },
              { icon: <MapPin className="w-4 h-4 text-indigo-400" />, label: 'Location', value: config.location || 'Rohini, New Delhi 110085', href: null },
              { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, label: 'Availability', value: config.availabilityStatus || 'Open to Freelance / Full-time', href: null },
            ].map(({ icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3.5 rounded-2xl glass-card"
              >
                <div className="mt-0.5">{icon}</div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-xs text-slate-200 hover:text-cyan-300 transition-colors break-all font-medium">{value}</a>
                  ) : (
                    <p className="text-xs text-slate-200 font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              Hire Me <ArrowRight className="w-4 h-4" />
            </Link>
            {config.cvUrl && (
              <a
                href={config.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost flex items-center gap-2 text-sm"
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
