/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image Optimization ──────────────────────────────────────────────────────
  images: {
    // Allow Next.js to serve optimized WebP/AVIF images from these domains
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'web-apex.com' },
      { protocol: 'https', hostname: '**.onrender.com' },
    ],
    // Serve modern AVIF first, then WebP — huge size savings vs PNG/JPEG
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching: 30 days for optimized images
    minimumCacheTTL: 2592000,
    // Allow serving from local public folder
    unoptimized: false,
  },

  // ── Compression ──────────────────────────────────────────────────────────────
  compress: true,

  // ── Performance ──────────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Headers: Add caching for static assets ──────────────────────────────────
  async headers() {
    return [
      {
        // Cache all static files (JS, CSS, images, fonts) for 1 year
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public folder assets for 7 days
        source: '/:path*.(png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
