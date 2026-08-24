import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Refresh sitemap every minute

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static Core Pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // 2. Fetch Dynamic Services, Projects, and Blogs
    const [servicesRes, projectsRes, blogsRes] = await Promise.allSettled([
      api.getServices(),
      api.getProjects(),
      api.getBlogs(),
    ]);

    const services = servicesRes.status === 'fulfilled' ? servicesRes.value.data || [] : [];
    const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data || [] : [];
    const blogs = blogsRes.status === 'fulfilled' ? blogsRes.value.data || [] : [];

    // Map Dynamic Service URLs
    const serviceUrls = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // Map Dynamic Project URLs
    const projectUrls = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // Map Dynamic Blog URLs
    const blogUrls = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: b.updatedAt || b.publishedAt ? new Date(b.updatedAt || b.publishedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    return [...staticPages, ...serviceUrls, ...projectUrls, ...blogUrls];
  } catch (error) {
    console.error('[Sitemap Generation Error]', error);
    return staticPages;
  }
}
