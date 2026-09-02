import ProjectsPageClient from '@/components/ProjectsPageClient';
import { api } from '@/lib/api';
import { getPageMetadata } from '@/lib/seoHelper';

export async function generateMetadata() {
  return getPageMetadata('projects', {
    title: 'Projects Portfolio | Rachit Aggarwal — Selected Work',
    description: 'Browse web applications, WordPress developments, MERN stack platforms, and Fastify REST API backends engineered by Rachit Aggarwal.'
  });
}

export default async function ProjectsPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page, 10) || 1);
  const activeCategory = resolvedSearchParams.category || 'All';

  // Fetch paginated projects (18 per page) + full catalog for global categories/counts
  const [paginatedRes, allProjectsRes] = await Promise.all([
    api.getProjects({
      page: currentPage,
      limit: 18,
      category: activeCategory !== 'All' ? activeCategory : undefined
    }).catch(() => ({ data: [], pagination: { total: 0, page: 1, limit: 18, totalPages: 1 } })),
    api.getProjects().catch(() => ({ data: [] }))
  ]);

  const allProjects = allProjectsRes?.data || [];
  let projects = paginatedRes?.data || [];

  // Robust fallback: if API returned full list without backend slicing
  const totalCount = paginatedRes?.pagination?.total ?? (allProjects.length || projects.length);
  const totalPages = paginatedRes?.pagination?.totalPages ?? (Math.ceil(totalCount / 18) || 1);

  if (!paginatedRes?.pagination && projects.length > 18) {
    projects = projects.slice((currentPage - 1) * 18, currentPage * 18);
  }

  const pagination = {
    total: totalCount,
    page: currentPage,
    limit: 18,
    totalPages: totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <p className="section-label">// PORTFOLIO</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white">Projects</h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-xl">
          A curated selection of work across industries and disciplines.
        </p>
      </div>

      {/* Projects with filter & server-side pagination */}
      <ProjectsPageClient
        projects={projects}
        allProjects={allProjects}
        pagination={pagination}
        activeCategory={activeCategory}
      />

    </div>
  );
}

