import Link from 'next/link';
import { ExternalLink, Eye } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

export default function ProjectCard({ project }) {
  if (!project) return null;

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-white/5">
      {/* Image Container with Top-Aligned Crop */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900 shrink-0">
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800'}
          alt={project.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
        />

        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {project.category || 'Full-Stack'}
        </span>

        {/* Hover Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              title="Live Demo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
              title="GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Content Area - Equal Height Flex */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2 min-h-[34px]">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10"
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* View Project Link (Pinned to bottom) */}
        <Link
          href={`/projects/${project.slug}`}
          className="flex items-center gap-2 text-xs font-semibold pt-3 border-t border-slate-200 dark:border-white/5 transition-colors mt-auto"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          View Project
        </Link>
      </div>
    </div>
  );
}
