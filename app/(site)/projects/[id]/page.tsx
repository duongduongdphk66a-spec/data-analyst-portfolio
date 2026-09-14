import React from 'react';
import type { Metadata } from 'next';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';
import { getDbPool } from '@/app/lib/db';
import { getProjectByIdWithFallback } from '@/app/lib/serverData';
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

  let project = await getProjectByIdWithFallback(id);

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
  const project = await getProjectByIdWithFallback(id);

  return <ProjectDetailClient id={id} project={project} />;
}
