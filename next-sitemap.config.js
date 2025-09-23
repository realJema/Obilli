/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://obilli.com';

async function fetchDynamicPaths() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase env vars are missing. Skipping dynamic paths.');
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch categories with slugs
    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('slug');
    if (catErr) {
      console.warn('Failed to fetch categories:', catErr.message);
    }

    // Fetch listings with related category slug (no slug column on listings)
    const { data: listings, error: listErr } = await supabase
      .from('listings')
      .select('id, category:categories(slug)')
      .eq('status', 'published');
    if (listErr) {
      console.warn('Failed to fetch listings:', listErr.message);
    }

    const catUrls = (categories || [])
      .filter((c) => !!c.slug)
      .map((c) => ({ loc: `${SITE_URL}/${c.slug}` }));

    const listingUrls = (listings || [])
      .filter((l) => l?.category?.slug)
      .map((l) => {
        const categorySlug = l.category.slug;
        const listingSegment = l.id; // fall back to ID
        return { loc: `${SITE_URL}/${categorySlug}/${listingSegment}` };
      });

    return [...catUrls, ...listingUrls];
  } catch (e) {
    console.warn('Error building dynamic paths for sitemap:', e);
    return [];
  }
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  exclude: ['/api/*'],
  additionalPaths: async (config) => {
    // Static routes detected from src/app
    const staticRoutes = [
      '/',
      '/login',
      '/search',
      '/sell/new',
      '/sell/success',
      '/dashboard',
      '/admin',
      '/profile/settings',
      '/boost/success',
    ];

    const staticUrls = staticRoutes.map((p) => ({ loc: `${SITE_URL}${p}` }));
    const dynamicUrls = await fetchDynamicPaths();

    return [...staticUrls, ...dynamicUrls];
  },
};
