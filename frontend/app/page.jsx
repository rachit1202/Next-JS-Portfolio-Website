import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles, Send } from 'lucide-react';
import HomeSlider from '@/components/HomeSlider';
import BlogsSlider from '@/components/BlogsSlider';
import ServicesTabs from '@/components/ServicesTabs';
import TechArsenal from '@/components/TechArsenal';
import WhyMe from '@/components/WhyMe';
import ScrollReveal from '@/components/ScrollReveal';
import { api, defaultSiteConfig } from '@/lib/api';
import { getPageMetadata } from '@/lib/seoHelper';

export const revalidate = 60;

export async function generateMetadata() {
  return getPageMetadata('home', {
    title: 'Rachit Aggarwal | Senior Web Developer & Full-Stack Engineer',
    description: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.'
  });
}

export default async function HomePage() {
  const [projectsRes, blogsRes, servicesRes, siteConfigRes] = await Promise.allSettled([
    api.getProjects('featured=true&limit=6'),
    api.getBlogs('limit=6'),
    api.getServices(),
    api.getSiteConfig(),
  ]);

  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data : [];
  const blogs = blogsRes.status === 'fulfilled' ? blogsRes.value.data : [];
  const services = servicesRes.status === 'fulfilled' ? servicesRes.value.data : [];
  const config = siteConfigRes.status === 'fulfilled' ? siteConfigRes.value.data : defaultSiteConfig;

  return (
    <div className="overflow-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex items-center py-10 sm:py-14">
        {/* Background glow orbs */}
        <div className="glow-orb glow-purple absolute w-[550px] h-[550px] -top-32 -left-32 opacity-25" />
        <div className="glow-orb glow-cyan absolute w-[450px] h-[450px] top-10 right-0 opacity-20" />
        <div className="glow-orb glow-blue absolute w-[350px] h-[350px] bottom-0 left-1/3 opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

            {/* Left: Dynamic Content */}
            <div className="space-y-6 sm:space-y-7 animate-fade-in">
              {/* Availability Badge */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">
                  {config.availabilityStatus || 'Available for freelance work'}
                </span>
              </div>

              {/* 2-Line Headline */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-white">
                  <span className="text-white">{config.heroTitleWord1 || 'Building'}</span>{' '}
                  <span className="gradient-text">{config.heroTitleWord2 || 'digital'}</span>
                  <br />
                  <span className="text-white">{config.heroTitleWord3 || 'excellence.'}</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-lg">
                {config.heroDescription || config.shortBio}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  View Work <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="btn-ghost flex items-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Get in Touch
                </Link>
              </div>

              {/* Dynamic Stats Row */}
              <div className="flex items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200 dark:border-white/10">
                {[
                  { value: config.experienceYears || '3+', label: 'Years Exp.' },
                  { value: config.completedProjects || '25+', label: 'Projects' },
                  { value: config.happyClients || '20+', label: 'Clients' },
                  { value: config.satisfactionRate || '99%', label: 'Satisfaction' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <span className="block text-xl sm:text-2xl font-black gradient-text">{value}</span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-400 font-bold tracking-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Code Editor Mockup */}
            <div className="relative lg:ml-8 animate-fade-in-up">
              {/* Floating Badge Top */}
              <div
                className="absolute -top-4 -right-4 z-20 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-float shadow-xl"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  backdropFilter: 'blur(12px)',
                  color: '#fbbf24',
                }}
              >
                <span className="text-base">⭐</span>
                <div>
                  <div className="font-bold">Top Rated Developer</div>
                  <div className="text-[10px] opacity-80">{config.completedProjects || '25+'} successful deliveries</div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="code-editor">
                <div className="code-editor-header">
                  <span className="editor-dot dot-red" />
                  <span className="editor-dot dot-yellow" />
                  <span className="editor-dot dot-green" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">rachit-profile.ts</span>
                </div>
                <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-cyan-300">developer</span>{' '}
                  <span className="text-white">= {'{'}</span>
                  <div className="pl-4 space-y-1 mt-1">
                    <div>
                      <span className="text-pink-400">name</span>
                      <span className="text-white">: </span>
                      <span className="text-emerald-400">&quot;{config.name || 'Rachit Aggarwal'}&quot;</span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-pink-400">role</span>
                      <span className="text-white">: </span>
                      <span className="text-emerald-400">&quot;{config.role || 'Senior Web Developer'}&quot;</span>
                      <span className="text-white">,</span>
                    </div>
                    <div>
                      <span className="text-pink-400">stack</span>
                      <span className="text-white">: [</span>
                      <div className="pl-4 space-y-0.5">
                        <div>
                          <span className="text-amber-300">&quot;Next.js 14&quot;</span><span className="text-white">, </span>
                          <span className="text-amber-300">&quot;Fastify&quot;</span><span className="text-white">,</span>
                        </div>
                        <div>
                          <span className="text-amber-300">&quot;MongoDB&quot;</span><span className="text-white">, </span>
                          <span className="text-amber-300">&quot;WordPress/PHP&quot;</span>
                        </div>
                      </div>
                      <span className="text-white">],</span>
                    </div>
                    <div>
                      <span className="text-pink-400">available</span>
                      <span className="text-white">: </span>
                      <span className="text-cyan-400">true</span>
                    </div>
                  </div>
                  <span className="text-white">{'}'}</span>

                  <div className="mt-4 text-slate-400 text-xs">
                    <span className="text-purple-400">// </span>
                    <span className="text-slate-300">Let&apos;s engineer something extraordinary </span>
                    <span className="animate-blink text-cyan-400">▊</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge Bottom */}
              <div
                className="absolute -bottom-4 left-4 z-20 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 text-white shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #06b6d4)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Open for Hire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECHNICAL SKILLS ARSENAL ===== */}
      <ScrollReveal>
        <section className="py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-6 sm:mb-8">
              <p className="section-label">// TECHNICAL ARSENAL</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Full-Stack Core Competencies</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Modern tools, architectures, and libraries I leverage to build production-grade web solutions.
              </p>
            </div>
            <TechArsenal skills={config.skills || defaultSiteConfig.skills} />
          </div>
        </section>
      </ScrollReveal>

      {/* ===== FEATURED PROJECTS SLIDER (3 BOXES DESKTOP, 1 MOBILE) ===== */}
      {projects.length > 0 && (
        <ScrollReveal>
          <section className="py-8 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <p className="section-label">// CASE STUDIES</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-0.5">Featured Projects</h2>
                </div>
                <Link
                  href="/projects"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold gradient-text hover:opacity-80 transition-opacity"
                >
                  View All Projects <ChevronRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
              <HomeSlider projects={projects} />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== SERVICES TABS ===== */}
      {services.length > 0 && (
        <ScrollReveal>
          <section className="py-8 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <p className="section-label">// WHAT I OFFER</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-0.5">Services &amp; Solutions</h2>
                </div>
                <Link
                  href="/services"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold gradient-text hover:opacity-80 transition-opacity"
                >
                  All Services <ChevronRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
              <ServicesTabs services={services} />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== BLOGS SLIDER (3 BOXES DESKTOP, 1 MOBILE) ===== */}
      {blogs.length > 0 && (
        <ScrollReveal>
          <section className="py-8 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <p className="section-label">// INSIGHTS &amp; CODE</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-0.5">Latest Articles</h2>
                </div>
                <Link
                  href="/blogs"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold gradient-text hover:opacity-80 transition-opacity"
                >
                  Read All Blogs <ChevronRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>
              <BlogsSlider blogs={blogs} />
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== WHY ME ===== */}
      <ScrollReveal>
        <section className="py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-8 sm:mb-10">
              <p className="section-label">// WHY CHOOSE ME</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">The Engineering Standard</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
                Code quality, speed, and client satisfaction — delivering scalable digital solutions that drive business results.
              </p>
            </div>
            <WhyMe config={config} />
          </div>
        </section>
      </ScrollReveal>

      {/* ===== CTA SECTION ===== */}
      <ScrollReveal>
        <section className="py-10 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="relative rounded-3xl p-8 sm:p-14 overflow-hidden glass-card"
              style={{
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div className="glow-orb glow-purple absolute w-64 h-64 -top-20 -right-20 opacity-30" />
              <div className="glow-orb glow-cyan absolute w-48 h-48 -bottom-10 -left-10 opacity-20" />
              <div className="relative z-10 space-y-5">
                <p className="section-label">// LET&apos;S BUILD TOGETHER</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  {config.ctaHeading || 'Ready to bring your vision to life?'}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  {config.ctaSubtitle || "Whether it's a startup MVP, enterprise platform, or WordPress site — let's make it happen."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    href="/contact"
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    Start a Project <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="btn-ghost flex items-center gap-2 text-sm"
                  >
                    About My Experience
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
