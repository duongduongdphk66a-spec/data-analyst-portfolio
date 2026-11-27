import React from 'react';
import type { Metadata } from 'next';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROJECTS } from '../../../defaultData';
import ProjectDetailClient from './ProjectDetailClient';
import { getDbPool } from '@/app/lib/db';
import { getProjectByIdWithFallback } from '@/app/lib/serverData';

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
    title: 'Kami Ely: Phân tích hiệu suất TikTok Shop và mạng lưới Affiliate | Ma Văn Hùng',
    desc: 'Đánh giá thực nghiệm 231 ngày vận hành (15,01 tỷ VNĐ, 101.896 sản phẩm) từ dữ liệu ước tính FastMoss cho gian hàng thời trang nữ và đồ bơi: cơ cấu kênh, hồi quy OLS mùa vụ, Cohort 302 KOC và chỉ số HHI.',
    keywords: ['TikTok Shop', 'Affiliate Analytics', 'E-Commerce', 'Python', 'SQL', 'OLS Regression', 'Cohort Retention'],
  },
  'proj-heritage-japan': {
    title: 'Du lịch Di sản Nhật Bản: Kiểm toán Dữ liệu & Chuỗi Thời Gian | Ma Văn Hùng',
    desc: 'Kiểm toán 6 chuỗi dữ liệu gốc tiếng Nhật (JNTO, MLIT, Kyoto, Nara): hiệu chỉnh 5 lỗi số liệu, chỉ ra chi tiêu bình quân/khách giảm -14,6% sau 2015 và ước lượng kịch bản quản trị quá tải.',
    keywords: ['Time Series', 'Data Audit', 'Heritage Tourism', 'Japan JNTO', 'Python', 'SQL'],
  },
  'proj-library-bus': {
    title: 'Library Bus: Technical BA, Mô hình Dữ liệu (ERD) & Tracking Plan | Ma Văn Hùng',
    desc: 'Hồ sơ Technical BA cho mạng lưới xe thư viện lưu động: As-Is/To-Be, 5 Stakeholder, phân pha MoSCoW, 4 quy tắc BR-01..04, Mini-BRD/RTM, ERD lõi 7 bảng, Tracking Plan 8 sự kiện và 11 cặp màn hình.',
    keywords: ['Technical BA', 'Mini-BRD', 'MoSCoW', 'ERD', 'Tracking Plan', 'Wireframe'],
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

  // All 3 flagship case studies read directly from verified static SSOT modules
  // (metrics_v2.json, heritageJapanData.ts, library-bus/*.ts), avoiding redundant
  // per-request MySQL queries and unused RSC payload serialization.
  return (
    <ProjectDetailClient
      id={id}
      project={project}
    />
  );
}

