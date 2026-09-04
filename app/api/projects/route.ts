import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { getDbPool, initDatabase } from '@/app/lib/db';
import { DEFAULT_PROJECTS } from '@/app/defaultData';
import { ProjectData } from '@/app/types';
import { verifyAdminRequest } from '@/app/lib/auth';
import { getApiCacheAsync, setApiCacheAsync, invalidateApiCacheAsync } from '@/app/lib/cache';
import { sanitizeTextInput, sanitizeUrl } from '@/app/lib/security';

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

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: true,
          source: 'default',
          data: DEFAULT_PROJECTS,
          message: 'MySQL pool not configured, returning static default projects.',
        },
        { headers: CACHE_HEADERS }
      );
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM portfolio_projects ORDER BY sort_order ASC, updated_at DESC'
    );

    if (!rows || rows.length === 0) {
      await initDatabase();
      const [newRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM portfolio_projects ORDER BY sort_order ASC, updated_at DESC'
      );
      if (newRows && newRows.length > 0) {
        const projects = mapRowsToProjects(newRows);
        await setApiCacheAsync('projects', projects);
        return NextResponse.json({ success: true, source: 'mysql', data: projects }, { headers: CACHE_HEADERS });
      }
      return NextResponse.json({ success: true, source: 'default', data: DEFAULT_PROJECTS }, { headers: CACHE_HEADERS });
    }

    const projects = mapRowsToProjects(rows);
    await setApiCacheAsync('projects', projects);
    return NextResponse.json({ success: true, source: 'mysql', data: projects }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/projects GET] Fallback to default:', message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: DEFAULT_PROJECTS,
      error: message,
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
      const cleanEmbedUrl = proj.embedUrl ? sanitizeUrl(sanitizeTextInput(proj.embedUrl, 1000)) : '';
      const cleanProblem = sanitizeTextInput(proj.problem, 10000);
      const cleanMethod = sanitizeTextInput(proj.method, 10000);
      const cleanInsight = sanitizeTextInput(proj.insight, 10000);

      placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
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
        i,
      );
    }

    if (placeholders.length > 0) {
      const sql = `
        INSERT INTO portfolio_projects 
          (id, title, desc_text, tags_json, img, demo_url, github_url, embed_url, featured, problem, method, insight, sort_order)
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
          sort_order = VALUES(sort_order)
      `;

      await pool.query(sql, values);
    }

    await invalidateApiCacheAsync('projects');

    return NextResponse.json({
      success: true,
      source: 'mysql',
      message: `Đã lưu thành công ${projectsToSave.length} dự án vào MySQL!`,
      data: projectsToSave,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API /api/projects POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi lưu dự án vào MySQL: ${message}`,
      },
      { status: 500 }
    );
  }
}

function mapRowsToProjects(rows: RowDataPacket[]): ProjectData[] {
  // Tìm default project mapping để giữ content/metrics nếu chưa có trong DB
  const defaultMap = new Map(DEFAULT_PROJECTS.map((p) => [p.id, p]));

  return rows.map((row) => {
    const defaultProj = defaultMap.get(row.id);
    let tags: string[] = [];
    try {
      tags = row.tags_json
        ? typeof row.tags_json === 'string'
          ? JSON.parse(row.tags_json)
          : row.tags_json
        : defaultProj?.tags || [];
    } catch {
      tags = defaultProj?.tags || [];
    }

    return {
      id: row.id,
      title: row.title,
      desc: row.desc_text,
      tags,
      img: row.img || defaultProj?.img || '',
      demoUrl: row.demo_url || defaultProj?.demoUrl,
      githubUrl: row.github_url || defaultProj?.githubUrl,
      embedUrl: row.embed_url || defaultProj?.embedUrl,
      featured: Boolean(row.featured),
      content: defaultProj?.content,
      metrics: defaultProj?.metrics,
      tools: defaultProj?.tools,
      problem: row.problem || defaultProj?.problem,
      method: row.method || defaultProj?.method,
      insight: row.insight || defaultProj?.insight,
    };
  });
}
