import ServicesTabs from '@/components/ServicesTabs';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Services | Rachit Aggarwal — Web Development & Design Solutions',
  description: 'Full-Stack Next.js development, Fastify API microservices, custom WordPress solutions, UI/UX design, SEO optimization and more by Rachit Aggarwal.'
};

export default async function ServicesPage() {
  const servicesRes = await api.getServices().catch(() => ({ data: [] }));
  const services = servicesRes.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="space-y-4">
        <p className="section-label">// CAPABILITIES & OFFERINGS</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">Services</h1>
        <p className="text-base text-slate-400 leading-relaxed max-w-xl">
          End-to-end digital services tailored to your goals and timeline.
        </p>
      </div>

      {/* Services with Tabs */}
      <ServicesTabs services={services} />

    </div>
  );
}
