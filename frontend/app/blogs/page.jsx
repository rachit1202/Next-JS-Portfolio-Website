import BlogsPageClient from '@/components/BlogsPageClient';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Tech Blog | Rachit Aggarwal — Thoughts & Tutorials',
  description: 'In-depth articles on web development, Next.js, Fastify APIs, Node.js performance, MongoDB optimization, and SEO best practices.'
};

export default async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page, 10) || 1);
  const activeCategory = resolvedSearchParams.category || 'All';
  const tag = resolvedSearchParams.tag || '';
  const search = resolvedSearchParams.search || '';

  // Fetch paginated blogs (10 per page) + full catalog for sidebar recent posts & counts
  const [paginatedRes, allBlogsRes] = await Promise.all([
    api.getBlogs({
      page: currentPage,
      limit: 10,
      category: activeCategory !== 'All' ? activeCategory : undefined,
      tag: tag || undefined,
      search: search || undefined
    }).catch(() => ({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } })),
    api.getBlogs().catch(() => ({ data: [] }))
  ]);

  const allBlogs = allBlogsRes?.data || [];
  let blogs = paginatedRes?.data || [];

  // Robust fallback: if API returned full list without backend slicing
  const totalCount = paginatedRes?.pagination?.total ?? (allBlogs.length || blogs.length);
  const totalPages = paginatedRes?.pagination?.totalPages ?? (Math.ceil(totalCount / 10) || 1);

  if (!paginatedRes?.pagination && blogs.length > 10) {
    blogs = blogs.slice((currentPage - 1) * 10, currentPage * 10);
  }

  const pagination = {
    total: totalCount,
    page: currentPage,
    limit: 10,
    totalPages: totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <p className="section-label">// THOUGHTS &amp; TUTORIALS</p>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Blog</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
          In-depth articles on web development, architecture, and engineering craft.
        </p>
      </div>

      {/* Main + Sidebar layout with server-side pagination */}
      <BlogsPageClient
        blogs={blogs}
        allBlogs={allBlogs}
        pagination={pagination}
        initialCategory={activeCategory}
        initialSearch={search}
        initialTag={tag}
      />

    </div>
  );
}

