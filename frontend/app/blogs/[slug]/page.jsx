import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Eye, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { getItemMetadata } from '@/lib/seoHelper';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogRes = await api.getBlogBySlug(slug).catch(() => null);
  const blog = blogRes?.data;
  if (!blog) return { title: 'Article Not Found | Rachit Aggarwal' };

  return getItemMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.summary,
    coverImage: blog.coverImage,
    path: `/blogs/${slug}`,
    tags: [...(blog.keywords || []), ...(blog.tags || []), blog.category],
    type: 'article'
  });
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blogRes = await api.getBlogBySlug(slug).catch(() => null);
  const blog = blogRes?.data;
  if (!blog) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.summary,
    image: blog.coverImage,
    author: { '@type': 'Person', name: blog.author || 'Rachit Aggarwal' },
    publisher: { '@type': 'Person', name: 'Rachit Aggarwal' },
    datePublished: blog.publishedAt || blog.createdAt,
  };

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Header */}
      <div className="space-y-5">
        {/* Category */}
        {blog.category && (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          )}
          {blog.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
              {blog.readTime}
            </span>
          )}
          {blog.viewsCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {blog.viewsCount} views
            </span>
          )}
          <span className="font-semibold" style={{ color: '#a78bfa' }}>
            By {blog.author || 'Rachit Aggarwal'}
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-[420px] object-cover"
          />
        </div>
      )}

      {/* Summary lead */}
      {blog.summary && (
        <p className="text-base sm:text-lg font-semibold text-slate-300 leading-relaxed border-l-4 pl-4"
          style={{ borderColor: '#7c3aed' }}>
          {blog.summary}
        </p>
      )}

      {/* Article Body */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="article-content text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Tag className="w-3 h-3" style={{ color: '#a78bfa' }} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Author Card */}
      <div
        className="glass-card rounded-2xl p-6 flex items-center gap-5"
        style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
        >
          RA
        </div>
        <div>
          <p className="font-bold text-white">{blog.author || 'Rachit Aggarwal'}</p>
          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
            Senior Web Developer · Next.js · Node.js · Fastify · WordPress
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Articles
        </Link>
      </div>

    </article>
  );
}
