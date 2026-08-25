import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, Globe, Clock, Send, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';
import ScrollReveal from '@/components/ScrollReveal';
import { api, defaultSiteConfig } from '@/lib/api';

export const metadata = {
  title: 'Contact Rachit Aggarwal | Get In Touch',
  description: 'Get in touch with Rachit Aggarwal for custom full-stack web development, WordPress CMS, Fastify API development, or technical consulting.'
};

export default async function ContactPage() {
  const siteConfigRes = await api.getSiteConfig().catch(() => null);
  const config = siteConfigRes?.data || defaultSiteConfig;

  const contactInfo = [
    { icon: <Mail className="w-4 h-4 text-purple-400" />, label: 'Email', value: config.email || 'rachitaggarwal1202@gmail.com', href: `mailto:${config.email || 'rachitaggarwal1202@gmail.com'}` },
    { icon: <Phone className="w-4 h-4 text-cyan-400" />, label: 'Phone', value: config.phone || '+91 9873088907', href: `tel:${config.phone || '+919873088907'}` },
    { icon: <MapPin className="w-4 h-4 text-indigo-400" />, label: 'Location', value: config.location || 'Rohini, New Delhi 110085, India', href: null },
    { icon: <Globe className="w-4 h-4 text-emerald-400" />, label: 'Website', value: config.websiteLabel || config.websiteUrl || 'rachitaggarwal.dev', href: config.websiteUrl ? (config.websiteUrl.startsWith('http') ? config.websiteUrl : `https://${config.websiteUrl}`) : '#' },
  ];

  const socialLinks = [
    { icon: <GithubIcon className="w-4 h-4 text-purple-400" />, label: 'GitHub', value: config.githubUsername || '@rachit1202', href: config.githubUrl || 'https://github.com/rachit1202' },
    { icon: <LinkedinIcon className="w-4 h-4 text-cyan-400" />, label: 'LinkedIn', value: config.linkedinUsername || 'in/rachit-aggarwal-b9492b248', href: config.linkedinUrl || 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/' },
    {
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: 'WhatsApp',
      value: config.whatsapp || '+91 9873088907',
      href: `https://wa.me/${(config.whatsapp || '+919873088907').replace(/[^0-9]/g, '')}`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <p className="section-label">// GET IN TOUCH</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Contact</h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-xl">
          Have a project in mind? Let&apos;s build something exceptional together.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* Left: Contact Form */}
        <div className="lg:col-span-3">
          <ContactForm
            servicesOptions={config.contactFormServices}
            budgetOptions={config.contactFormBudgets}
          />
        </div>

        {/* Right: Info Sidebar */}
        <div className="lg:col-span-2 space-y-5">

          {/* Contact Info Card */}
          <div className="glass-card rounded-3xl p-7 space-y-5 border border-white/5">
            <h3 className="font-bold text-white text-base">Direct Channels</h3>
            <div className="space-y-4">
              {contactInfo.map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-xs text-slate-200 hover:text-cyan-300 transition-colors break-all font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect Online Card */}
          <div className="glass-card rounded-3xl p-7 space-y-4 border border-white/5">
            <h3 className="font-bold text-white text-base">Connect Online</h3>
            <div className="space-y-2.5">
              {socialLinks.map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl transition-all hover:scale-[1.02] bg-white/5 hover:bg-white/10 border border-white/5"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Currently Available Card */}
          <div
            className="rounded-3xl p-6 flex flex-col gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.06))',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs text-emerald-400">
                {config.availabilityStatus || 'Currently Available for New Projects'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{config.workingHours || 'Mon–Sat: 9AM – 8PM IST'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
