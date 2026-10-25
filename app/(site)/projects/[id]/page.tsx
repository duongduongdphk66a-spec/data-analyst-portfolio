import React from 'react';
import type { Metadata } from 'next';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';
import { getDbPool } from '@/app/lib/db';
import { 
  getProjectByIdWithFallback,
  getKamiElyDataWithFallback,
  getHeritageJapanDataWithFallback,
  getLibraryBusDataWithFallback
} from '@/app/lib/serverData';

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
    title: 'Library Bus: UX/UI Design for a Mobile Library Website | Ma Văn Hùng',
    desc: 'Dự án thiết kế UX/UI cho website xe thư viện lưu động: nghiên cứu, logo và thành phần giao diện, hệ thống lưới, wireframe và UI design cho 20 màn hình desktop kèm bản mobile.',
    keywords: ['UX/UI Design', 'Wireframe', 'Design System', 'Website Design', 'Responsive'],
  },
};

import { redirect } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cleanId = id.replace(/_/g, '-');
  const normalizedId = cleanId.startsWith('proj-') ? cleanId : `proj-${cleanId}`;

  let project = await getProjectByIdWithFallback(id);

  if (!project) {
    const customMeta = PROJECT_METADATA[normalizedId] || PROJECT_METADATA[cleanId] || PROJECT_METADATA[id];
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
  const cleanId = id.replace(/_/g, '-');
  const normalizedId = cleanId.startsWith('proj-') ? cleanId : `proj-${cleanId}`;

  // Redirect non-canonical variations (like proj_heritage_japan) to canonical kebab-case URL
  if (id !== normalizedId && (normalizedId === 'proj-kami-ely' || normalizedId === 'proj-heritage-japan' || normalizedId === 'proj-library-bus')) {
    redirect(`/projects/${normalizedId}`);
  }

  const project = await getProjectByIdWithFallback(id);

  let initialCaseStudyData: any = null;
  try {
    if (normalizedId === 'proj-kami-ely') {
      initialCaseStudyData = await getKamiElyDataWithFallback();
    } else if (normalizedId === 'proj-heritage-japan') {
      initialCaseStudyData = await getHeritageJapanDataWithFallback();
    } else if (normalizedId === 'proj-library-bus') {
      initialCaseStudyData = await getLibraryBusDataWithFallback();
    }
  } catch (err) {
    console.warn(`[ProjectDetailPage] Could not pre-fetch case study data for ${id}:`, err);
  }

  return (
    <ProjectDetailClient 
      id={id} 
      project={project} 
      initialCaseStudyData={initialCaseStudyData} 
    />
  );
}

