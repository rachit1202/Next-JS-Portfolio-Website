'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';
import { api, defaultSiteConfig } from '@/lib/api';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blogs' },
  { name: 'Contact', path: '/contact' },
];

export default function Footer() {
  const pathname = usePathname();
  const [config, setConfig] = useState(defaultSiteConfig);

  useEffect(() => {
    api.getSiteConfig()
      .then((res) => {
        if (res?.data) setConfig(res.data);
      })
      .catch(() => { });
  }, []);

  // Isolate footer from /admin routes
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  // Extract skills dynamically from Site & Profile CMS
  const displaySkills = config.skills && config.skills.length > 0
    ? config.skills.map((s) => (typeof s === 'string' ? s : s.name))
    : ['Next.js 14', 'React.js', 'Node.js', 'Fastify', 'MongoDB', 'WordPress & PHP', 'MySQL', 'REST APIs', 'Tailwind CSS', 'TypeScript'];

  // Parse Footer Heading lines for gradient styling on second line
  const headingLines = (config.footerHeading || "Have a project in mind?\nLet's build it together.").split('\n');

  const socialLinks = [
    { href: config.linkedinUrl || 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4 text-cyan-400" /> },
    { href: config.githubUrl || 'https://github.com/rachit1202', label: 'GitHub', icon: <GithubIcon className="w-4 h-4 text-purple-400" /> },
    { href: `mailto:${config.email || 'rachitaggarwal1202@gmail.com'}`, label: 'Email', icon: <Mail className="w-4 h-4 text-indigo-400" /> },
    {
      href: `https://wa.me/${(config.whatsapp || '+919873088907').replace(/[^0-9]/g, '')}`,
      label: 'WhatsApp',
      icon: (
        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 dark:border-white/5 pt-10 sm:pt-14 pb-8">
      {/* Background glow orbs */}
      <div className="glow-orb glow-purple w-80 h-80 -bottom-20 -left-20 opacity-20 absolute" />
      <div className="glow-orb glow-cyan w-80 h-80 -top-10 right-0 opacity-15 absolute" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top CTA Banner */}
        <div
          className="rounded-3xl p-6 sm:p-10 mb-10 sm:mb-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <div className="glow-orb glow-purple w-64 h-64 -top-20 -right-20 opacity-30 absolute" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <p className="section-label mb-2">{config.footerTagline || "// LET'S COLLABORATE"}</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {headingLines[0]}
                {headingLines.length > 1 && (
                  <>
                    <br />
                    <span className="gradient-text">
                      {headingLines.slice(1).join(' ')}
                    </span>
                  </>
                )}
              </h3>
            </div>
            <Link
              href={config.footerButtonUrl || "/contact"}
              className="btn-primary flex items-center gap-2 px-7 py-3.5 text-sm shrink-0"
            >
              {config.footerButtonText || "Start a Project"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-white/5">

          {/* Col 1: Brand (Logo + Dynamic Short Bio + Socials) */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center group">
              <div className="relative w-40 h-30 shrink-0">
                <Image
                  src="/final-logo.png"
                  alt="Rachit Aggarwal Logo"
                  fill
                  sizes="500px"
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {config.footerShortBio || config.shortBio || "Senior Web Developer crafting fast, elegant, and scalable digital solutions using Next.js, Node.js, Fastify & WordPress."}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase mb-5 text-cyan-600 dark:text-cyan-400 font-mono">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 rounded-full transition-all duration-200 shrink-0 bg-cyan-500 dark:bg-cyan-400" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Expertise Tech Skills (Dynamic from Site & Profile CMS) */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase mb-5 text-purple-600 dark:text-purple-400 font-mono">Core Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase mb-5 text-indigo-600 dark:text-indigo-400 font-mono">Get In Touch</h4>
            <div className="space-y-3.5">
              {[
                { icon: <Mail className="w-4 h-4 shrink-0 text-purple-500 dark:text-purple-400" />, text: config.email || 'rachitaggarwal1202@gmail.com', href: `mailto:${config.email || 'rachitaggarwal1202@gmail.com'}` },
                { icon: <Phone className="w-4 h-4 shrink-0 text-cyan-500 dark:text-cyan-400" />, text: config.phone || '+91 9873088907', href: `tel:${config.phone || '+919873088907'}` },
                { icon: <MapPin className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />, text: config.location || 'Rohini, New Delhi 110085, India', href: null },
              ].map(({ icon, text, href }) => (
                <div key={text} className="flex items-start gap-2.5">
                  {icon}
                  {href ? (
                    <a href={href} className="text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-300 transition-colors leading-relaxed break-all font-medium">{text}</a>
                  ) : (
                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {config.footerCopyrightText
              ? config.footerCopyrightText.replace('{year}', new Date().getFullYear())
              : `© ${new Date().getFullYear()} ${config.name || 'Rachit Aggarwal'}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <Link href="/sitemap.xml" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
              Sitemap <ArrowUpRight className="w-3 h-3" />
            </Link>
            <Link href="/admin/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

