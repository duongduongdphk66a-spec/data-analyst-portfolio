import { MetadataRoute } from 'next';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROJECTS } from './defaultData';
import { getDbPool } from './lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mavanhung-portfolio.vercel.app';
  const currentDate = new Date().toISOString();

  let projectUrls: Array<{ id: string; lastModified: string }> = DEFAULT_PROJECTS.map((p) => ({
    id: p.id,
    lastModified: currentDate,
  }));

  try {
    const pool = getDbPool();
    if (pool) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT id, updated_at FROM portfolio_projects');
      if (Array.isArray(rows) && rows.length > 0) {
        projectUrls = rows.map((r) => ({
          id: r.id,
          lastModified: r.updated_at ? new Date(r.updated_at).toISOString() : currentDate,
        }));
      }
    }
  } catch {
    // Fallback to static defaults
  }

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...projectUrls.map((p) => ({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: p.lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
