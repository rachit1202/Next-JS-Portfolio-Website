'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, MessageCircle, Zap, Code2, Palette, Shield, Globe, Settings, HeadphonesIcon, Layers } from 'lucide-react';

const CATEGORY_ICONS = {
  Development: <Code2 className="w-5 h-5" />,
  Designing: <Palette className="w-5 h-5" />,
  Maintenance: <Settings className="w-5 h-5" />,
  'Cyber Security': <Shield className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  SEO: <Globe className="w-5 h-5" />,
  Consultation: <HeadphonesIcon className="w-5 h-5" />,
};

const CATEGORY_COLORS = {
  Development: '#a855f7',
  Designing: '#06b6d4',
  Maintenance: '#f59e0b',
  'Cyber Security': '#10b981',
  Security: '#10b981',
  SEO: '#6366f1',
  Consultation: '#ec4899',
};

export default function ServicesTabs({ services = [] }) {
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category || 'Development')))];
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? services
    : services.filter((s) => (s.category || 'Development') === activeTab);

  return (
    <div className="space-y-8">
      {/* Clean Standalone Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          const count = cat === 'All' ? services.length : services.filter((s) => (s.category || 'Development') === cat).length;
          const color = CATEGORY_COLORS[cat] || '#a855f7';

          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-white dark:border-white/5'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 50%, #06b6d4 100%)',
                    }
                  : {}
              }
            >
              {cat !== 'All' && (
                <span className={isActive ? 'text-white' : ''} style={!isActive ? { color } : {}}>
                  {CATEGORY_ICONS[cat] ? <span className="scale-75 inline-block">{CATEGORY_ICONS[cat]}</span> : null}
                </span>
              )}
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Grid with Animation */}
      <div
        key={activeTab}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
      >
        {filtered.map((service, idx) => {
          const color = CATEGORY_COLORS[service.category] || '#a855f7';
          return (
            <div
              key={service._id || service.slug || idx}
              className="glass-card glass-card-hover rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden border border-slate-200 dark:border-white/5"
            >
              {/* Category accent line on top */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, #9333ea, #6366f1, #06b6d4)',
                }}
              />

              <div className="space-y-4">
                {/* Header: Icon + Category Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      color: color,
                    }}
                  >
                    {CATEGORY_ICONS[service.category] || <Zap className="w-5 h-5 text-cyan-400" />}
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  >
                    {service.category || 'General'}
                  </span>
                </div>

                {/* Title & Short Description */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2 leading-relaxed line-clamp-3">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Features Checklist */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
                    {service.features.slice(0, 3).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-[11px] text-slate-500 font-medium pl-5">
                        +{service.features.length - 3} more capabilities
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/5 mt-6 flex items-center justify-between gap-3">
                {/* Read More / View Service Detail */}
                <Link
                  href={`/services/${service.slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Explore Service <ArrowRight className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                </Link>

                {/* Contact CTA */}
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-white hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                  }}
                >
                  <MessageCircle className="w-3 h-3" />
                  Hire Me
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-3 glass-card rounded-2xl p-8">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">
            No services found in category &ldquo;{activeTab}&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
