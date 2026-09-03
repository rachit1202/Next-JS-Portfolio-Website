import { api } from '@/lib/api';

const SITE_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://rachitaggarwal.vercel.app';

/**
 * Returns dynamic Next.js Metadata for standard static pages ('home', 'about', 'projects', 'services', 'blogs', 'contact').
 * Rule: If a page-specific title/description/keywords/ogImage is not set or empty,
 * it automatically falls back to the Global SEO configuration from MongoDB Atlas!
 */
export async function getPageMetadata(pageKey, fallbackMeta = {}) {
  try {
    const res = await api.getSeo();
    const seo = res?.data || {};
    const pageData = (seo?.pages || []).find(p => p.pageKey?.toLowerCase() === pageKey?.toLowerCase()) || {};

    const globalTitle = seo.defaultTitle?.trim() || 'Rachit Aggarwal | Senior Web Developer & Full-Stack Engineer';
    const globalDesc = seo.defaultDescription?.trim() || 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Fastify, Node.js, and WordPress.';
    const globalKeywords = (seo.keywords && seo.keywords.length > 0) ? seo.keywords : ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Engineer'];
    const globalOgImage = seo.ogImage?.trim() || '/final-logo.png';
    const siteName = seo.siteName?.trim() || 'Rachit Aggarwal Portfolio';

    // Page-specific values take precedence; if empty or blank, fallback cleanly to Global Meta
    const title = (pageData.title && pageData.title.trim().length > 0)
      ? pageData.title.trim()
      : (fallbackMeta.title || globalTitle);

    const description = (pageData.description && pageData.description.trim().length > 0)
      ? pageData.description.trim()
      : (fallbackMeta.description || globalDesc);

    const keywords = (pageData.keywords && pageData.keywords.length > 0)
      ? pageData.keywords
      : (fallbackMeta.keywords || globalKeywords);

    const ogImage = (pageData.ogImage && pageData.ogImage.trim().length > 0)
      ? pageData.ogImage.trim()
      : globalOgImage;

    const pagePath = pageData.path || (pageKey === 'home' ? '/' : `/${pageKey}`);
    const canonicalUrl = (pageData.canonicalUrl && pageData.canonicalUrl.trim().length > 0)
      ? pageData.canonicalUrl.trim()
      : `${SITE_BASE_URL}${pagePath}`;

    return {
      title,
      description,
      keywords,
      authors: [{ name: seo.author || 'Rachit Aggarwal' }],
      creator: seo.author || 'Rachit Aggarwal',
      metadataBase: new URL(SITE_BASE_URL),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName,
        images: ogImage ? [{ url: ogImage }] : undefined,
        type: 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : undefined,
        creator: seo.twitterHandle || '@rachitaggarwal'
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

/**
 * Returns dynamic Next.js Metadata for individual items:
 * - Single Project (/projects/[slug]): heading + shortDescription
 * - Single Service (/services/[slug]): heading + shortDesc
 * - Single Blog (/blogs/[slug]): heading + summary
 * Automatically inherits site branding and falls back to global attributes.
 */
export async function getItemMetadata({
  title,
  description,
  coverImage,
  path = '',
  tags = [],
  type = 'article'
}) {
  try {
    const res = await api.getSeo().catch(() => null);
    const seo = res?.data || {};

    const siteName = seo.siteName?.trim() || 'Rachit Aggarwal Portfolio';
    const globalTitle = seo.defaultTitle?.trim() || 'Rachit Aggarwal';
    const globalDesc = seo.defaultDescription?.trim() || '';
    const globalOgImage = seo.ogImage?.trim() || '/final-logo.png';

    const finalTitle = title ? `${title} | Rachit Aggarwal` : globalTitle;
    const finalDesc = description?.trim() || globalDesc;
    const finalImage = coverImage?.trim() || globalOgImage;
    const canonicalUrl = `${SITE_BASE_URL}${path}`;

    const mergedKeywords = Array.from(new Set([
      ...(tags || []),
      ...(seo.keywords || []),
      'Rachit Aggarwal'
    ])).filter(Boolean);

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: mergedKeywords,
      authors: [{ name: seo.author || 'Rachit Aggarwal' }],
      creator: seo.author || 'Rachit Aggarwal',
      metadataBase: new URL(SITE_BASE_URL),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        url: canonicalUrl,
        siteName,
        images: finalImage ? [{ url: finalImage }] : undefined,
        type: type === 'article' ? 'article' : 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
        images: finalImage ? [finalImage] : undefined,
        creator: seo.twitterHandle || '@rachitaggarwal',
      }
    };
  } catch (err) {
    return {
      title: `${title || 'Rachit Aggarwal'} | Rachit Aggarwal`,
      description: description || '',
    };
  }
}
