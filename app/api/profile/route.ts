import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import { getDbPool, initDatabase } from '@/app/lib/db';
import { DEFAULT_PROFILE } from '@/app/defaultData';
import { ProfileData } from '@/app/types';
import { verifyAdminRequest } from '@/app/lib/auth';
import { getApiCacheAsync, setApiCacheAsync, invalidateApiCacheAsync } from '@/app/lib/cache';
import { sanitizeTextInput, sanitizeUrl } from '@/app/lib/security';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET() {
  try {
    const cached = await getApiCacheAsync<ProfileData>('profile');
    if (cached) {
      return NextResponse.json({ success: true, source: 'cache', data: cached }, { headers: CACHE_HEADERS });
    }

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: true,
          source: 'default',
          data: DEFAULT_PROFILE,
          message: 'MySQL pool not configured, returning default static profile.',
        },
        { headers: CACHE_HEADERS }
      );
    }

    // Try querying profile
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_profile WHERE id = 1 LIMIT 1');
    if (!rows || rows.length === 0) {
      // Auto initialize if empty
      await initDatabase();
      const [newRows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_profile WHERE id = 1 LIMIT 1');
      if (newRows && newRows.length > 0) {
        const row = newRows[0];
        const profile: ProfileData = {
          name: row.name,
          subtitle: row.subtitle,
          title: row.title,
          bio: row.bio,
          careerGoal: row.career_goal,
          avatarUrl: row.avatar_url,
          email: row.email,
          github: row.github,
          linkedin: row.linkedin,
          skills: row.skills_json ? JSON.parse(row.skills_json) : DEFAULT_PROFILE.skills,
          experiences: row.experiences_json ? JSON.parse(row.experiences_json) : DEFAULT_PROFILE.experiences,
          careerGoalsList: row.career_goals_json ? JSON.parse(row.career_goals_json) : DEFAULT_PROFILE.careerGoalsList,
        };
        await setApiCacheAsync('profile', profile);
        return NextResponse.json({ success: true, source: 'mysql', data: profile }, { headers: CACHE_HEADERS });
      }
      return NextResponse.json({ success: true, source: 'default', data: DEFAULT_PROFILE }, { headers: CACHE_HEADERS });
    }

    const row = rows[0];
    const profile: ProfileData = {
      name: row.name,
      subtitle: row.subtitle,
      title: row.title,
      bio: row.bio,
      careerGoal: row.career_goal,
      avatarUrl: row.avatar_url,
      email: row.email,
      github: row.github,
      linkedin: row.linkedin,
      skills: row.skills_json ? (typeof row.skills_json === 'string' ? JSON.parse(row.skills_json) : row.skills_json) : DEFAULT_PROFILE.skills,
      experiences: row.experiences_json ? (typeof row.experiences_json === 'string' ? JSON.parse(row.experiences_json) : row.experiences_json) : DEFAULT_PROFILE.experiences,
      careerGoalsList: row.career_goals_json ? (typeof row.career_goals_json === 'string' ? JSON.parse(row.career_goals_json) : row.career_goals_json) : DEFAULT_PROFILE.careerGoalsList,
    };

    await setApiCacheAsync('profile', profile);
    return NextResponse.json({ success: true, source: 'mysql', data: profile }, { headers: CACHE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('[API /api/profile GET] Falling back to default profile:', message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: DEFAULT_PROFILE,
    }, { headers: CACHE_HEADERS });
  }
}

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
    const profileData: Partial<ProfileData> = body;

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: false,
          source: 'local',
          message: 'Hệ thống CSDL MySQL không khả dụng. Vui lòng kiểm tra lại cấu hình.',
          data: profileData,
        },
        { status: 503 }
      );
    }

    // Ensure database table exists
    await initDatabase();

    const sql = `
      INSERT INTO portfolio_profile 
        (id, name, subtitle, title, bio, career_goal, avatar_url, email, github, linkedin, skills_json, experiences_json, career_goals_json)
      VALUES 
        (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        subtitle = VALUES(subtitle),
        title = VALUES(title),
        bio = VALUES(bio),
        career_goal = VALUES(career_goal),
        avatar_url = VALUES(avatar_url),
        email = VALUES(email),
        github = VALUES(github),
        linkedin = VALUES(linkedin),
        skills_json = VALUES(skills_json),
        experiences_json = VALUES(experiences_json),
        career_goals_json = VALUES(career_goals_json)
    `;

    const cleanName = sanitizeTextInput(profileData.name || DEFAULT_PROFILE.name, 255);
    const cleanSubtitle = sanitizeTextInput(profileData.subtitle || '', 500);
    const cleanTitle = sanitizeTextInput(profileData.title || DEFAULT_PROFILE.title, 255);
    const cleanBio = sanitizeTextInput(profileData.bio || DEFAULT_PROFILE.bio, 10000);
    const cleanCareerGoal = sanitizeTextInput(profileData.careerGoal || DEFAULT_PROFILE.careerGoal, 10000);
    const cleanAvatarUrl = profileData.avatarUrl ? sanitizeUrl(sanitizeTextInput(profileData.avatarUrl, 1000)) : '';
    const cleanEmail = sanitizeTextInput(profileData.email || '', 255);
    const cleanGithub = profileData.github ? sanitizeUrl(sanitizeTextInput(profileData.github, 500)) : '';
    const cleanLinkedin = profileData.linkedin ? sanitizeUrl(sanitizeTextInput(profileData.linkedin, 500)) : '';

    await pool.query(sql, [
      cleanName,
      cleanSubtitle,
      cleanTitle,
      cleanBio,
      cleanCareerGoal,
      cleanAvatarUrl,
      cleanEmail,
      cleanGithub,
      cleanLinkedin,
      JSON.stringify(profileData.skills || DEFAULT_PROFILE.skills),
      JSON.stringify(profileData.experiences || DEFAULT_PROFILE.experiences),
      JSON.stringify(profileData.careerGoalsList || DEFAULT_PROFILE.careerGoalsList),
    ]);

    await invalidateApiCacheAsync('profile');

    return NextResponse.json({
      success: true,
      source: 'mysql',
      message: 'Thông tin cá nhân đã được lưu thành công vào MySQL!',
      data: profileData,
    });
  } catch (error: unknown) {
    console.error('[API /api/profile POST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi lưu thông tin vào cơ sở dữ liệu. Vui lòng thử lại sau.',
      },
      { status: 500 }
    );
  }
}
