import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, initDatabase } from '@/app/lib/db';
import { DEFAULT_PROJECTS } from '@/app/defaultData';
import { ProjectData } from '@/app/types';
import { verifyAdminRequest } from '@/app/lib/auth';
import { getApiCacheAsync, setApiCacheAsync, invalidateApiCacheAsync } from '@/app/lib/cache';
import { sanitizeTextInput, sanitizeUrl, sanitizeEmbedUrl } from '@/app/lib/security';

import { getProjectsWithFallback } from '@/app/lib/serverData';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

/**
 * GET /api/projects
 * Lấy danh sách các dự án
 */
export async function GET() {
  try {
    const cached = await getApiCacheAsync<ProjectData[]>('projects');
    if (cached) {
      return NextResponse.json({ success: true, source: 'cache', data: cached }, { headers: CACHE_HEADERS });
    }

    const projects = await getProjectsWithFallback();
    const source = projects === DEFAULT_PROJECTS ? 'fallback' : 'mysql';
    await setApiCacheAsync('projects', projects);
    return NextResponse.json({ success: true, source, data: projects }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/projects GET] Fallback to default:', message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: DEFAULT_PROJECTS,
    }, { headers: CACHE_HEADERS });
  }
}

/**
 * POST /api/projects
 * Cập nhật danh sách dự án (Yêu cầu quyền Admin)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error || 'Quyền truy cập bị từ chối. Vui lòng đăng nhập Admin.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const isFullList = Array.isArray(body.projects) || Array.isArray(body);
    const projectsToSave: ProjectData[] = Array.isArray(body.projects)
      ? body.projects
      : Array.isArray(body)
      ? body
      : [body];

    if (!projectsToSave.length) {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu dự án trống.' },
        { status: 400 }
      );
    }

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: false,
          source: 'local',
          message: 'Hệ thống CSDL MySQL không khả dụng. Vui lòng kiểm tra lại cấu hình.',
          data: projectsToSave,
        },
        { status: 503 }
      );
    }

    await initDatabase();

    const placeholders: string[] = [];
    const values: any[] = [];

    for (let i = 0; i < projectsToSave.length; i++) {
      const proj = projectsToSave[i];

      if (!proj.id || typeof proj.id !== 'string' || proj.id.trim().length === 0 || proj.id.length > 100) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Mã dự án (id) không hợp lệ hoặc vượt quá 100 ký tự: "${proj.id || ''}". Yêu cầu độ dài 1-100 ký tự.` 
          },
          { status: 400 }
        );
      }

      const cleanId = sanitizeTextInput(proj.id, 100);
      const cleanTitle = sanitizeTextInput(proj.title, 255);
      const cleanDesc = sanitizeTextInput(proj.desc, 10000);
      const cleanImg = proj.img ? sanitizeUrl(sanitizeTextInput(proj.img, 1000)) : '';
      const cleanDemoUrl = proj.demoUrl ? sanitizeUrl(sanitizeTextInput(proj.demoUrl, 1000)) : '';
      const cleanGithubUrl = proj.githubUrl ? sanitizeUrl(sanitizeTextInput(proj.githubUrl, 1000)) : '';
      const cleanEmbedUrl = proj.embedUrl ? sanitizeEmbedUrl(sanitizeTextInput(proj.embedUrl, 1000)) : '';
      const cleanProblem = sanitizeTextInput(proj.problem, 10000);
      const cleanMethod = sanitizeTextInput(proj.method, 10000);
      const cleanInsight = sanitizeTextInput(proj.insight, 10000);
      const cleanContent = proj.content ? sanitizeTextInput(proj.content, 50000) : '';
      const cleanMetrics = proj.metrics ? JSON.stringify(proj.metrics) : null;
      const cleanTools = proj.tools ? JSON.stringify(proj.tools) : null;

      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      values.push(
        cleanId,
        cleanTitle,
        cleanDesc,
        JSON.stringify((proj.tags || []).map((tag: string) => sanitizeTextInput(tag, 100))),
        cleanImg,
        cleanDemoUrl,
        cleanGithubUrl,
        cleanEmbedUrl,
        proj.featured ? 1 : 0,
        cleanProblem,
        cleanMethod,
        cleanInsight,
        cleanContent,
        cleanMetrics,
        cleanTools,
        i,
      );
    }

    if (placeholders.length > 0) {
      if (isFullList) {
        // Full list write runs inside a transaction: clear table, then atomically insert sanitized list
        const conn = await pool.getConnection();
        try {
          await conn.beginTransaction();
          await conn.query('DELETE FROM portfolio_projects');
          const sql = `
            INSERT INTO portfolio_projects 
              (id, title, desc_text, tags_json, img, demo_url, github_url, embed_url, featured, problem, method, insight, content, metrics_json, tools_json, sort_order)
            VALUES 
              ${placeholders.join(', ')}
          `;
          await conn.query(sql, values);
          await conn.commit();
        } catch (txErr) {
          await conn.rollback();
          throw txErr;
        } finally {
          conn.release();
        }
      } else {
        // Legacy single-project write retains upsert behavior
        const sql = `
          INSERT INTO portfolio_projects 
            (id, title, desc_text, tags_json, img, demo_url, github_url, embed_url, featured, problem, method, insight, content, metrics_json, tools_json, sort_order)
          VALUES 
            ${placeholders.join(', ')}
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            desc_text = VALUES(desc_text),
            tags_json = VALUES(tags_json),
            img = VALUES(img),
            demo_url = VALUES(demo_url),
            github_url = VALUES(github_url),
            embed_url = VALUES(embed_url),
            featured = VALUES(featured),
            problem = VALUES(problem),
            method = VALUES(method),
            insight = VALUES(insight),
            content = VALUES(content),
            metrics_json = VALUES(metrics_json),
            tools_json = VALUES(tools_json),
            sort_order = VALUES(sort_order)
        `;
        await pool.query(sql, values);
      }
    }

    await invalidateApiCacheAsync('projects');

    return NextResponse.json({
      success: true,
      source: 'mysql',
      message: `Đã lưu thành công ${projectsToSave.length} dự án vào MySQL!`,
      data: projectsToSave,
    });
  } catch (error: unknown) {
    console.error('[API /api/projects POST] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi lưu dự án vào cơ sở dữ liệu. Vui lòng thử lại sau.',
      },
      { status: 500 }
    );
  }
}
