'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  basePath = '',
  queryParamName = 'page',
  searchParams = {}
}) {
  if (totalPages <= 1) return null;

  const current = Number(currentPage) || 1;
  const total = Number(totalPages) || 1;

  const buildUrl = (page) => {
    const params = new URLSearchParams();

    // Preserve existing search params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (key !== queryParamName && val !== undefined && val !== null && val !== '') {
        params.set(key, String(val));
      }
    });

    if (page > 1) {
      params.set(queryParamName, String(page));
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // how many pages before and after current

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== '...' &&
        (i < current - delta || i > current + delta)
      ) {
        pages.push('...');
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-200 dark:border-white/5"
    >
      {/* Page Info */}
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Showing Page <span className="font-bold text-slate-900 dark:text-white">{current}</span> of{' '}
        <span className="font-bold text-slate-900 dark:text-white">{total}</span>
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        {current > 1 ? (
          <Link
            href={buildUrl(current - 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 glass-card hover:text-purple-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all duration-200 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-600 glass-card opacity-50 cursor-not-allowed border border-slate-200 dark:border-white/5">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500"
                >
                  &hellip;
                </span>
              );
            }

            const isActive = p === current;
            return (
              <Link
                key={`page-${p}`}
                href={buildUrl(p)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-700 dark:text-slate-300 glass-card hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-purple-500/40'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 50%, #06b6d4 100%)',
                      }
                    : {}
                }
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {current < total ? (
          <Link
            href={buildUrl(current + 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 glass-card hover:text-purple-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all duration-200 shadow-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-600 glass-card opacity-50 cursor-not-allowed border border-slate-200 dark:border-white/5">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
