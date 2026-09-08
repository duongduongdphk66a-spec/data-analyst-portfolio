import React from 'react';
import type { Metadata } from 'next';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';
import { getDbPool } from '@/app/lib/db';
import { ProjectData } from '@/app/types';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const pool = getDbPool();
    if (pool) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM portfolio_projects');
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r) => ({ id: r.id }));
      }
    }
  } catch {
    // Fallback to static default projects
  }

  return DEFAULT_PROJECTS.map((project) => ({
    id: project.id,
  }));
}

const PROJECT_METADATA: Record<string, { title: string; desc: string; keywords?: string[] }> = {
  'proj-kami-ely': {
    title: 'Kami Ely: TikTok Shop Performance & Affiliate Analytics | Ma Văn Hùng',
    desc: 'Phân tích hiệu suất bán hàng TikTok Shop, mạng lưới 1,000+ creator affiliates, và tối ưu chi phí hoa hồng cho ngành Sports & Outdoor. SQL, Python, Power BI.',
    keywords: ['TikTok Shop', 'Affiliate Analytics', 'E-Commerce', 'Python', 'SQL', 'Power BI', 'GMV Optimization'],
  },
  'proj-heritage-japan': {
    title: 'Du lịch Di sản Nhật Bản: Phân tích Chuỗi Thời Gian | Ma Văn Hùng',
    desc: 'Phân tích chuỗi thời gian 20 năm du lịch di sản Nhật Bản: lượng khách quốc tế, chi tiêu, chính sách bảo tồn Kyoto-Nara. JNTO data, time-series modeling.',
    keywords: ['Time Series', 'Heritage Tourism', 'Japan JNTO', 'Data Modeling', 'Data Storytelling', 'Python'],
  },
  'proj-library-bus': {
    title: 'Library Bus System: Database Architecture & Optimization | Ma Văn Hùng',
    desc: 'Thiết kế kiến trúc CSDL quan hệ, Redis cache, Celery workers cho hệ thống thư viện lưu động 50,000+ người dùng. Giảm 93.7% latency, 0% xung đột dữ liệu.',
    keywords: ['PostgreSQL', 'Redis', 'Celery', 'Database Architecture', 'System Optimization', 'ACID'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // 1. Prioritize querying MySQL database for latest real-time CMS edits
  let project: ProjectData | undefined;
  try {
    const pool = getDbPool();
    if (pool) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_projects WHERE id = ? LIMIT 1', [id]);
      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        project = {
          id: r.id,
          title: r.title,
          desc: r.desc_text || '',
          tags: typeof r.tags_json === 'string' ? JSON.parse(r.tags_json) : r.tags || [],
          demoUrl: r.demo_url,
          githubUrl: r.github_url,
          embedUrl: r.embed_url,
          img: r.img,
          problem: r.problem,
          method: r.method,
          insight: r.insight,
        };
      }
    }
  } catch {
    // Database query fallback
  }

  // 2. If not found in DB or DB not connected, check custom metadata then static defaults
  if (!project) {
    const customMeta = PROJECT_METADATA[id];
    if (customMeta) {
      return {
        title: customMeta.title,
        description: customMeta.desc,
        openGraph: {
          title: customMeta.title,
          description: customMeta.desc,
          type: 'article',
        },
        keywords: customMeta.keywords,
      };
    }
    project = DEFAULT_PROJECTS.find((p) => p.id === id);
  }

  if (!project) {
    return {
      title: 'Dự Án Data Analytics | Ma Văn Hùng Portfolio',
      description: 'Phân tích dữ liệu, trực quan hoá dashboard và nghiên cứu tình huống kinh doanh.',
    };
  }

  return {
    title: `${project.title} | Ma Văn Hùng - Data Analyst Case Study`,
    description: project.desc,
    openGraph: {
      title: project.title,
      description: project.desc,
      type: 'article',
      images: project.img ? [{ url: project.img }] : undefined,
    },
    keywords: project.tags,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}
