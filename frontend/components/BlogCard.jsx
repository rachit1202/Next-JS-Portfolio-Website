import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export default function BlogCard({ blog, variant = 'vertical' }) {
  if (!blog) return null;

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  if (variant === 'horizontal') {
    return (
      <Link href={`/blogs/${blog.slug}`} className="flex gap-4 p-3 rounded-2xl group transition-all duration-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200'}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-xs font-semibold gradient-text">{blog.category || 'Tech'}</p>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {blog.title}
          </h4>
          {formattedDate && <p className="text-xs text-slate-500">{formattedDate}</p>}
        </div>
      </Link>
    );
  }

  // Main list card layout (Figma style)
  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden group border border-slate-200 dark:border-white/5">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative sm:w-48 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-900">
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3) 100%)' }} />
          {/* Category pill */}
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white sm:hidden shadow"
            style={{ background: 'linear-gradient(135deg, #9333ea, #6366f1)' }}
          >
            {blog.category || 'Tech'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Meta */}
            <div className="flex items-center gap-3">
              <span
                className="hidden sm:inline px-2.5 py-0.5 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/10 border border-purple-500/20"
              >
                {blog.category || 'Tech'}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                {blog.readTime || '5 min read'}
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
              {blog.summary}
            </p>
          </div>

          {/* Tags + Read More */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-1.5">
              {blog.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Link
              href={`/blogs/${blog.slug}`}
              className="flex items-center gap-1.5 text-xs font-bold transition-colors flex-shrink-0 ml-2"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Read More <ArrowRight className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
