import { api } from '@/lib/api';

/**
 * Returns dynamic Next.js Metadata for a specific pageKey ('home', 'about', 'projects', 'services', 'blogs', 'contact')
 * Reads from MongoDB Atlas via /api/seo, and merges with global branding & fallbacks.
 */
export async function getPageMetadata(pageKey, fallbackMeta = {}) {
  try {
    const res = await api.getSeo();
    const seo = res?.data;
    const pageData = seo?.pages?.find(p => p.pageKey?.toLowerCase() === pageKey?.toLowerCase());

    const title = pageData?.title || fallbackMeta.title || seo?.defaultTitle || 'Rachit Aggarwal | Senior Web Developer';
    const description = pageData?.description || fallbackMeta.description || seo?.defaultDescription || '';
    const keywords = (pageData?.keywords && pageData.keywords.length > 0)
      ? pageData.keywords
      : (fallbackMeta.keywords || seo?.keywords || []);
    const ogImage = pageData?.ogImage || fallbackMeta.ogImage || seo?.ogImage || '/final-logo.png';
    const siteName = seo?.siteName || 'Rachit Aggarwal | Senior Web Developer';

    return {
      title,
      description,
      keywords,
      authors: [{ name: seo?.author || 'Rachit Aggarwal' }],
      creator: seo?.author || 'Rachit Aggarwal',
      openGraph: {
        title,
        description,
        siteName,
        images: ogImage ? [{ url: ogImage }] : undefined,
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
        creator: seo?.twitterHandle || '@rachitaggarwal'
      }
    };
  } catch (err) {
    return {
      title: fallbackMeta.title || 'Rachit Aggarwal | Senior Web Developer',
      description: fallbackMeta.description || '',
      keywords: fallbackMeta.keywords || []
    };
  }
}
