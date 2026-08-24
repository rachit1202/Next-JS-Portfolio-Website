'use client';

import { useState } from 'react';
import { Layout, Server, Database, Globe, Cpu, Palette, Code, Terminal } from 'lucide-react';

const ICON_MAP = {
  Layout: <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 dark:text-cyan-400" />,
  Code2: <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />,
  Server: <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 dark:text-indigo-400" />,
  Database: <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" />,
  Globe: <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" />,
  Cpu: <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 dark:text-pink-400" />,
  Palette: <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400" />,
  Code: <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-300" />,
  Terminal: <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500 dark:text-teal-400" />,
};

export default function TechArsenal({ skills = [] }) {
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category || 'Frontend')))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => (s.category || 'Frontend') === activeCategory);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 sm:px-4.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-[#0e0e1a]/80 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #9333ea, #06b6d4)',
                    }
                  : {}
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skills Layout: 2 boxes per row on mobile, centered flex wrap on desktop */}
      <div
        key={activeCategory}
        className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2.5 sm:gap-4 md:gap-5 animate-fade-in"
      >
        {filtered.map((skill, idx) => (
          <div
            key={skill.name || idx}
            className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3.5 flex flex-col justify-between group md:w-[calc(33.333%-14px)] lg:w-[calc(25%-16px)] md:min-w-[220px] md:max-w-[270px] border border-slate-200 dark:border-white/5"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow"
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                {ICON_MAP[skill.icon] || <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 dark:text-cyan-400" />}
              </div>
              <span className="text-xs font-mono font-black text-cyan-600 dark:text-cyan-400">{skill.level}%</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-purple-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                {skill.name}
              </h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                {skill.category || 'Frontend'}
              </p>

              {/* Progress Bar */}
              <div className="mt-2.5 sm:mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.level}%`,
                    background: 'linear-gradient(90deg, #9333ea, #6366f1, #06b6d4)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
