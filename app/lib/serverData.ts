import { cookies } from 'next/headers';
import { translations, TranslationKey } from '../data/translations';
import { getDbPool, initDatabase } from './db';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { ProfileData, ProjectData } from '../types';
import { RowDataPacket } from 'mysql2';

export async function getServerLanguage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get('portfolio_lang')?.value || 'vi') as 'en' | 'vi';
  const isEn = lang === 'en';

  const dynamicTexts = (await getTextsWithFallback(lang)) as Record<string, string>;

  const t = (key: string, fallback?: string): string => {
    if (dynamicTexts && key in dynamicTexts) {
      return dynamicTexts[key];
    }

    const dict = isEn ? translations.en : translations.vi;
    if (dict && key in dict) {
      return (dict as any)[key];
    }
    
    // Fallback to vi
    const viDict = translations.vi;
    if (viDict && key in viDict) {
      return (viDict as any)[key];
    }

    return fallback || key;
  };

  return { language: lang, isEn, t };
}

function mapRowToProject(row: RowDataPacket): ProjectData {
  return {
    id: row.id,
    title: row.title,
    desc: row.desc_text || '',
    tags: row.tags_json ? (typeof row.tags_json === 'string' ? JSON.parse(row.tags_json) : row.tags_json) : [],
    img: row.img,
    demoUrl: row.demo_url,
    githubUrl: row.github_url,
    embedUrl: row.embed_url,
    featured: Boolean(row.featured),
    problem: row.problem,
    method: row.method,
    insight: row.insight,
    content: row.content,
    metrics: row.metrics_json ? (typeof row.metrics_json === 'string' ? JSON.parse(row.metrics_json) : row.metrics_json) : [],
    tools: row.tools_json ? (typeof row.tools_json === 'string' ? JSON.parse(row.tools_json) : row.tools_json) : [],
  };
}

export function mapRowToProfile(row: RowDataPacket): ProfileData {
  return {
    name: row.name,
    subtitle: row.subtitle,
    title: row.title,
    bio: row.bio,
    careerGoal: row.career_goal,
    avatarUrl: row.avatar_url,
    email: row.email,
    github: row.github,
    linkedin: row.linkedin,
    skills: row.skills_json
      ? typeof row.skills_json === 'string'
        ? JSON.parse(row.skills_json)
        : row.skills_json
      : DEFAULT_PROFILE.skills,
    experiences: row.experiences_json
      ? typeof row.experiences_json === 'string'
        ? JSON.parse(row.experiences_json)
        : row.experiences_json
      : DEFAULT_PROFILE.experiences,
    careerGoalsList: row.career_goals_json
      ? typeof row.career_goals_json === 'string'
        ? JSON.parse(row.career_goals_json)
        : row.career_goals_json
      : DEFAULT_PROFILE.careerGoalsList,
  };
}

/**
 * Fetch profile from MySQL with fallback to DEFAULT_PROFILE.
 */
export async function getProfileWithFallback(): Promise<ProfileData> {
  try {
    const pool = getDbPool();
    if (!pool) return DEFAULT_PROFILE;

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_profile WHERE id = 1 LIMIT 1');
    if (rows && rows.length > 0) {
      return mapRowToProfile(rows[0]);
    }
  } catch (err) {
    console.warn('[getProfileWithFallback] Fallback to DEFAULT_PROFILE:', err);
  }
  return DEFAULT_PROFILE;
}

/**
 * Fetch all projects from MySQL with fallback to DEFAULT_PROJECTS.
 */
export async function getProjectsWithFallback(): Promise<ProjectData[]> {
  try {
    const pool = getDbPool();
    if (!pool) return DEFAULT_PROJECTS;

    const [projRows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_projects ORDER BY sort_order ASC');
    if (projRows && projRows.length > 0) {
      return projRows.map(mapRowToProject);
    }
  } catch (err) {
    console.warn('[getProjectsWithFallback] Fallback to DEFAULT_PROJECTS:', err);
  }
  return DEFAULT_PROJECTS;
}

/**
 * Fetch single project by ID from MySQL with fallback to DEFAULT_PROJECTS.
 */
export async function getProjectByIdWithFallback(id: string): Promise<ProjectData | undefined> {
  try {
    const pool = getDbPool();
    if (pool) {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_projects WHERE id = ? LIMIT 1', [id]);
      if (rows && rows.length > 0) {
        return mapRowToProject(rows[0]);
      }
    }
  } catch (err) {
    console.warn(`[getProjectByIdWithFallback] Fallback for project ${id}:`, err);
  }
  return DEFAULT_PROJECTS.find((p) => p.id === id);
}

/**
 * Fetch texts from MySQL with fallback to static translations.
 */
export async function getTextsWithFallback(
  lang?: 'vi' | 'en'
): Promise<Record<string, string> | { vi: Record<string, string>; en: Record<string, string> }> {
  try {
    const pool = getDbPool();
    if (!pool) {
      return lang ? (translations as Record<string, Record<string, string>>)[lang] || translations.vi : translations;
    }

    let query = 'SELECT text_key, lang, value_text FROM portfolio_texts';
    const params: string[] = [];
    if (lang) {
      query += ' WHERE lang = ?';
      params.push(lang);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    if (rows && rows.length > 0) {
      if (lang) {
        const result: Record<string, string> = { ...((translations as Record<string, Record<string, string>>)[lang] || translations.vi) };
        for (const r of rows) {
          result[r.text_key] = r.value_text;
        }
        return result;
      }

      const result: { vi: Record<string, string>; en: Record<string, string> } = {
        vi: { ...translations.vi },
        en: { ...translations.en },
      };
      for (const r of rows) {
        if (r.lang === 'vi' || r.lang === 'en') {
          const l = r.lang as 'vi' | 'en';
          result[l][r.text_key] = r.value_text;
        }
      }
      return result;
    }
  } catch (err) {
    console.warn('[getTextsWithFallback] Fallback to static translations:', err);
  }

  return lang ? (translations as Record<string, Record<string, string>>)[lang] || translations.vi : translations;
}

/**
 * Fetch combined portfolio data (profile & projects) for server pages.
 */
export async function getServerPortfolioData(): Promise<{ profile: ProfileData; projects: ProjectData[] }> {
  try {
    const [profile, projects] = await Promise.all([
      getProfileWithFallback(),
      getProjectsWithFallback(),
    ]);
    return { profile, projects };
  } catch (err) {
    console.error('[ServerData] Fallback to default data:', err);
    return { profile: DEFAULT_PROFILE, projects: DEFAULT_PROJECTS };
  }
}

/**
 * Fetch TikTok / Kami Ely live telemetry data from MySQL with fallback.
 */
export async function getKamiElyDataWithFallback() {
  const { getDbTikTokWeeklyTrends, getDbTikTokTopSKUs, getDbTikTokTopAffiliates } = await import('./db');
  const [weeklyTrends, topSkus, topAffiliates] = await Promise.all([
    getDbTikTokWeeklyTrends(),
    getDbTikTokTopSKUs(),
    getDbTikTokTopAffiliates(),
  ]);
  return { weeklyTrends, topSkus, topAffiliates };
}
