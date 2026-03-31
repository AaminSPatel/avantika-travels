import { getServerSideSitemap } from 'next-sitemap'

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return encodeURI(url).replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%40/g, '@');
}

function formatDate(date) {
  if (!date) return new Date().toISOString();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export async function GET(request) {
  try {
    const baseUrl = 'https://avantikatravels.com'
    let allEntries = [];

    // 1. Static Pages
    const staticRoutes = [
      { path: '', freq: 'daily', priority: 1.0 },
      { path: '/about', freq: 'monthly', priority: 0.8 },
      { path: '/contact', freq: 'monthly', priority: 0.8 },
      { path: '/places', freq: 'weekly', priority: 0.9 },
      { path: '/packages', freq: 'weekly', priority: 0.9 },
      { path: '/blogs', freq: 'daily', priority: 0.8 },
      { path: '/services', freq: 'monthly', priority: 0.7 },
      { path: '/booking', freq: 'weekly', priority: 0.8 },
      { path: '/gallery', freq: 'weekly', priority: 0.8 },
      { path: '/privacy-policy', freq: 'yearly', priority: 0.3 },
      { path: '/terms-and-conditions', freq: 'yearly', priority: 0.3 },
    ];

    allEntries.push(...staticRoutes.map(route => ({
      loc: sanitizeUrl(`${baseUrl}${route.path}`),
      lastmod: formatDate(new Date()),
      changefreq: route.freq,
      priority: route.priority,
    })));

    // 2. Dynamic Content Fetching
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const [placesRes, packagesRes, blogsRes, galleriesRes] = await Promise.allSettled([
        fetch(`${apiUrl}/places`, { next: { revalidate: 3600 } }),
        fetch(`${apiUrl}/packages`, { next: { revalidate: 3600 } }),
        fetch(`${apiUrl}/blogs`, { next: { revalidate: 3600 } }),
        fetch(`${apiUrl}/galleries`, { next: { revalidate: 3600 } })
      ]);

      if (placesRes.status === 'fulfilled' && placesRes.value.ok) {
        const places = await placesRes.value.json();
        places.forEach(p => {
          if (p.slug) allEntries.push({
            loc: sanitizeUrl(`${baseUrl}/places/${p.slug}`),
            lastmod: formatDate(p.updatedAt || p.createdAt),
            changefreq: 'weekly',
            priority: 0.8
          });
        });
      }

      if (packagesRes.status === 'fulfilled' && packagesRes.value.ok) {
        const pkgs = await packagesRes.value.json();
        pkgs.forEach(pkg => {
          if (pkg.slug) allEntries.push({
            loc: sanitizeUrl(`${baseUrl}/packages/${pkg.slug}`),
            lastmod: formatDate(pkg.updatedAt || pkg.createdAt),
            changefreq: 'weekly',
            priority: 0.8
          });
        });
      }

      // Dynamic Galleries
      if (galleriesRes.status === 'fulfilled' && galleriesRes.value.ok) {
        const galleries = await galleriesRes.value.json();
        galleries.forEach(gallery => {
          if (gallery.slug) allEntries.push({
            loc: sanitizeUrl(`${baseUrl}/gallery/${gallery.slug}`),
            lastmod: formatDate(gallery.updatedAt || gallery.createdAt),
            changefreq: 'weekly',
            priority: 0.7
          });
        });
      }

      // Categories
      const categories = ['holiday', 'adventure', 'honeymoon', 'pilgrimage', 'family', 'weekend'];
      categories.forEach(cat => {
        allEntries.push({
          loc: sanitizeUrl(`${baseUrl}/packages?type=${cat}`),
          lastmod: formatDate(new Date()),
          changefreq: 'weekly',
          priority: 0.7
        });
      });

    } catch (apiErr) {
      console.error('Dynamic fetch error:', apiErr);
    }

    // Google ke liye fields ko exact standard tags mein map karna
    const finalSitemap = allEntries.map(entry => ({
      loc: entry.loc,
      lastmod: entry.lastmod,
      changefreq: entry.changefreq,
      priority: entry.priority,
    }));

    return getServerSideSitemap(finalSitemap);

  } catch (error) {
    console.error('Sitemap fatal error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}