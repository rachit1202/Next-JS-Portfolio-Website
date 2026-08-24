'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import Pagination from '@/components/Pagination';
import { Layers } from 'lucide-react';

const ALL = 'All';

export default function ProjectsPageClient({
  projects = [],
  allProjects = [],
  pagination = { total: 0, page: 1, limit: 18, totalPages: 1 },
  activeCategory = ALL
}) {
  const router = useRouter();

  // Extract unique categories from full catalog
  const categories = useMemo(() => {
    const catalog = allProjects.length > 0 ? allProjects : projects;
    const cats = Array.from(new Set(catalog.map((p) => p.category || 'Full-Stack')));
    return [ALL, ...cats];
  }, [allProjects, projects]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams();
    if (cat !== ALL) {
      params.set('category', cat);
    }
    // Reset to page 1 on category change
    const qs = params.toString();
    router.push(qs ? `/projects?${qs}` : '/projects');
  };

  return (
    <div className="space-y-8">
      {/* Clean Standalone Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const catalog = allProjects.length > 0 ? allProjects : projects;
          const count = cat === ALL ? catalog.length : catalog.filter((p) => (p.category || 'Full-Stack') === cat).length;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
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

      {/* Projects Grid with Staggered Fade/Scale Animation */}
      <div
        key={`${activeCategory}-page-${pagination.page}`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-fade-in-up"
      >
        {projects.map((project, idx) => (
          <div
            key={project._id || project.slug || idx}
            className="h-full flex flex-col"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 space-y-3 glass-card rounded-2xl p-8">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">
            No projects found in category &ldquo;{activeCategory}&rdquo;.
          </p>
        </div>
      )}

      {/* Server-Side Pagination Controls */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        basePath="/projects"
        searchParams={{
          category: activeCategory !== ALL ? activeCategory : undefined
        }}
      />
    </div>
  );
}

