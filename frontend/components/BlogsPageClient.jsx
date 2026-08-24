'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Tag } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';

export default function BlogsPageClient({
  blogs = [],
  allBlogs = [],
  pagination = { total: 0, page: 1, limit: 10, totalPages: 1 },
  initialCategory = 'All',
  initialSearch = '',
  initialTag = ''
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  const catalog = allBlogs.length > 0 ? allBlogs : blogs;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(catalog.map((b) => b.category || 'Tech')));
    return ['All', ...cats];
  }, [catalog]);

  const recentPosts = useMemo(() => {
    return catalog.slice(0, 4);
  }, [catalog]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    catalog.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 15);
  }, [catalog]);

  const pushNavigation = (cat, q, t) => {
    const params = new URLSearchParams();
    if (cat && cat !== 'All') params.set('category', cat);
    if (q) params.set('search', q);
    if (t) params.set('tag', t);
    const qs = params.toString();
    router.push(qs ? `/blogs?${qs}` : '/blogs');
  };

  const handleCategoryClick = (cat) => {
    pushNavigation(cat, search, initialTag);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      pushNavigation(initialCategory, search, initialTag);
    }
  };

  const handleTagClick = (t) => {
    pushNavigation('All', '', t);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/blogs');
  };

  return (
    <div className="space-y-6">

      {/* ===== MOBILE TOP SEARCH & CATEGORY BAR (Visible on Mobile/Tablet before blogs) ===== */}
      <div className="lg:hidden space-y-4">
        {/* Mobile Search Box */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search articles by title or keyword... (Press Enter)"
            className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm text-slate-900 dark:text-slate-200 glass-card border border-slate-200 dark:border-white/10 focus:outline-none focus:border-purple-500 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); pushNavigation(initialCategory, '', initialTag); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const isActive = initialCategory === cat;
            const count = cat === 'All' ? catalog.length : catalog.filter((b) => (b.category || 'Tech') === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-md shadow-indigo-500/25'
                    : 'glass-card text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea, #06b6d4)',
                      }
                    : {}
                }
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/5 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN GRID (Desktop: 2/3 Main + 1/3 Sidebar) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        {/* Main Articles List with Pagination */}
        <div className="lg:col-span-2 space-y-6">
          {blogs.length > 0 ? (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} />
              ))}

              {/* Server-Side Pagination Controls */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                basePath="/blogs"
                searchParams={{
                  category: initialCategory !== 'All' ? initialCategory : undefined,
                  search: initialSearch || undefined,
                  tag: initialTag || undefined
                }}
              />
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-3xl p-8 space-y-3">
              <p className="text-slate-700 dark:text-slate-300 font-bold text-base">No articles found</p>
              <p className="text-slate-500 text-xs">Try searching with a different keyword or resetting category filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs font-bold gradient-text cursor-pointer"
              >
                Clear Search &amp; Filters
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden lg:block space-y-6 sticky top-24">

          {/* Search Box */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-white/5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Search Articles</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search & hit Enter..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm text-slate-900 dark:text-slate-200 glass-card border border-slate-200 dark:border-white/10 focus:outline-none focus:border-purple-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(''); pushNavigation(initialCategory, '', initialTag); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-white/5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = initialCategory === cat;
                const count = cat === 'All' ? catalog.length : catalog.filter((b) => (b.category || 'Tech') === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    style={
                      isActive
                        ? {
                            background: 'linear-gradient(135deg, #9333ea, #06b6d4)',
                          }
                        : {}
                    }
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-white/5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Posts</h3>
            <div className="space-y-2">
              {recentPosts.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} variant="horizontal" />
              ))}
            </div>
          </div>

          {/* Tags Cloud */}
          {allTags.length > 0 && (
            <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-white/5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> Topic Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      initialTag === tag
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

    </div>
  );
}

