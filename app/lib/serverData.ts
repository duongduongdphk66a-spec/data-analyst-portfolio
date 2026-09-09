import { cookies } from 'next/headers';
import { translations, TranslationKey } from '../data/translations';
import { getDbPool, initDatabase } from './db';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { ProfileData, ProjectData } from '../types';
import { RowDataPacket } from 'mysql2';

export async function getServerLanguage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('portfolio_lang')?.value || 'vi';
  const isEn = lang === 'en';

  const t = (key: string, fallback?: string): string => {
    // We only support static fallback on the server for now
    // Dynamic text overrides can be handled if we fetch them, but keep it simple
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

  return { language: lang as 'en' | 'vi', isEn, t };
}

export async function getServerPortfolioData(): Promise<{ profile: ProfileData; projects: ProjectData[] }> {
  try {
    const pool = getDbPool();
    if (!pool) {
      return { profile: DEFAULT_PROFILE, projects: DEFAULT_PROJECTS };
    }

    // Attempt to fetch Profile
    let profile = DEFAULT_PROFILE;
    const [profRows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_profile WHERE id = 1 LIMIT 1');
    if (profRows && profRows.length > 0) {
      const row = profRows[0];
      profile = {
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
    } else {
      await initDatabase(); // Ensure DB is initialized if empty
    }

    // Attempt to fetch Projects
    let projects = DEFAULT_PROJECTS;
    const [projRows] = await pool.query<RowDataPacket[]>('SELECT * FROM portfolio_projects ORDER BY sort_order ASC');
    if (projRows && projRows.length > 0) {
      projects = projRows.map((row) => ({
        id: row.id,
        title: row.title,
        desc: row.desc_text,
        tags: row.tags_json ? JSON.parse(row.tags_json) : [],
        img: row.img,
        demoUrl: row.demo_url,
        githubUrl: row.github_url,
        embedUrl: row.embed_url,
        featured: Boolean(row.featured),
        problem: row.problem,
        method: row.method,
        insight: row.insight,
        content: row.content,
        metrics: row.metrics_json ? JSON.parse(row.metrics_json) : [],
        tools: row.tools_json ? JSON.parse(row.tools_json) : [],
      }));
    }

    return { profile, projects };
  } catch (err) {
    console.error('[ServerData] Fallback to default data:', err);
    return { profile: DEFAULT_PROFILE, projects: DEFAULT_PROJECTS };
  }
}
