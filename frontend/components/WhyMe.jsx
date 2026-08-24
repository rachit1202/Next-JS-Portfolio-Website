'use client';

import { useEffect, useRef } from 'react';
import { Zap, Code2, HeadphonesIcon, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhyMe({ config = {} }) {
  const sectionRef = useRef(null);

  const stats = [
    { value: config.experienceYears || '3+', label: 'Years Experience' },
    { value: config.completedProjects || '25+', label: 'Projects Delivered' },
    { value: config.happyClients || '20+', label: 'Happy Clients' },
    { value: config.satisfactionRate || '99%', label: 'Satisfaction Rate' },
  ];

  const reasons = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      title: 'Fast Delivery & High Throughput',
      desc: 'Efficient workflows and lightweight architecture ensure projects are delivered on time without technical debt.',
      color: '#f59e0b',
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      title: 'Clean, Scalable Architecture',
      desc: 'Every line written with modularity, type safety, readability, and long-term enterprise maintainability in mind.',
      color: '#9333ea',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />,
      title: 'Built-in Security & Auditing',
      desc: 'JWT authentication, input sanitization, rate limiting, and security best practices implemented by default.',
      color: '#10b981',
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />,
      title: 'Direct Developer Support',
      desc: 'Post-launch support, proactive maintenance, and feature enhancements — I stay with you beyond go-live.',
      color: '#06b6d4',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.why-card').forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-fade-in-up'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    const currentTarget = sectionRef.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, []);

  return (
    <div ref={sectionRef} className="space-y-6 sm:space-y-8">
      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="text-center p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/5"
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.06), rgba(6,182,212,0.04))',
            }}
          >
            <span
              className="block text-3xl sm:text-4xl font-black mb-1.5 gradient-text"
            >
              {value}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{label}</span>
          </div>
        ))}
      </div>

      {/* Reason Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reasons.map(({ icon, title, desc, color }) => (
          <div
            key={title}
            className="why-card glass-card glass-card-hover rounded-3xl p-7 flex items-start gap-5 opacity-0 border border-slate-200 dark:border-white/5"
          >
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}20, rgba(6,182,212,0.1))`,
                border: `1px solid ${color}35`,
              }}
            >
              {icon}
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
          Start Working Together <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
