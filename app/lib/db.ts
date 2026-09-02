import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { translations } from '../data/translations';

let pool: Pool | null = null;
let _isInitialized = false;

/**
 * Get or create the MySQL connection pool.
 */
export function getDbPool(): Pool | null {
  if (pool) return pool;

  const dbHost = process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1';
  const dbPort = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10);
  const dbUser = process.env.MYSQL_USER || process.env.DB_USER || 'root';
  const dbPassword = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
  const dbName = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'portfolio_db';
  const databaseUrl = process.env.DATABASE_URL;

  const connectionLimit = parseInt(
    process.env.MYSQL_CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT || '5',
    10
  );

  try {
    const config: PoolOptions = databaseUrl
      ? { uri: databaseUrl, waitForConnections: true, connectionLimit, queueLimit: 0 }
      : {
          host: dbHost,
          port: dbPort,
          user: dbUser,
          password: dbPassword,
          database: dbName,
          waitForConnections: true,
          connectionLimit,
          queueLimit: 0,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
        };

    pool = mysql.createPool(config);
    return pool;
  } catch (err) {
    console.warn('[MySQL] Could not initialize connection pool:', err);
    return null;
  }
}

/**
 * Test MySQL connection
 */
export async function testDbConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const p = getDbPool();
    if (!p) {
      return { connected: false, message: 'MySQL Pool is not available.' };
    }
    await p.query('SELECT 1 + 1 AS solution');
    return {
      connected: true,
      message: 'Successfully connected to MySQL database.',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to connect to MySQL database.';
    return {
      connected: false,
      message,
    };
  }
}

/**
 * Initialize database schema if tables don't exist, and seed default data.
 */
export async function initDatabase(force = false): Promise<{ success: boolean; message: string; tables?: string[] }> {
  if (_isInitialized && !force) {
    return { success: true, message: 'Database already initialized in this process.' };
  }

  const p = getDbPool();
  if (!p) {
    return { success: false, message: 'Cannot initialize: MySQL pool not available.' };
  }

  try {
    // 1. Create Profile Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_profile (
        id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500) DEFAULT '',
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        career_goal TEXT,
        avatar_url VARCHAR(1000) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        github VARCHAR(255) DEFAULT '',
        linkedin VARCHAR(255) DEFAULT '',
        skills_json LONGTEXT,
        experiences_json LONGTEXT,
        career_goals_json LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Create Texts / CMS Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_texts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text_key VARCHAR(150) NOT NULL,
        lang VARCHAR(10) NOT NULL DEFAULT 'vi',
        value_text TEXT NOT NULL,
        section VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_text_lang (text_key, lang)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create Projects Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        desc_text TEXT,
        tags_json LONGTEXT,
        img VARCHAR(1000) DEFAULT '',
        demo_url VARCHAR(1000) DEFAULT '',
        github_url VARCHAR(1000) DEFAULT '',
        embed_url VARCHAR(1000) DEFAULT '',
        featured TINYINT(1) DEFAULT 0,
        problem TEXT,
        method TEXT,
        insight TEXT,
        sort_order INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed Profile if empty
    const [profRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM portfolio_profile WHERE id = 1');
    if (profRows && profRows[0] && profRows[0].count === 0) {
      await p.query(
        `INSERT INTO portfolio_profile 
          (id, name, subtitle, title, bio, career_goal, avatar_url, email, github, linkedin, skills_json, experiences_json, career_goals_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          DEFAULT_PROFILE.name,
          DEFAULT_PROFILE.subtitle || '',
          DEFAULT_PROFILE.title,
          DEFAULT_PROFILE.bio,
          DEFAULT_PROFILE.careerGoal,
          DEFAULT_PROFILE.avatarUrl || '',
          DEFAULT_PROFILE.email || '',
          DEFAULT_PROFILE.github || '',
          DEFAULT_PROFILE.linkedin || '',
          JSON.stringify(DEFAULT_PROFILE.skills || []),
          JSON.stringify(DEFAULT_PROFILE.experiences || []),
          JSON.stringify(DEFAULT_PROFILE.careerGoalsList || []),
        ]
      );
    }

    // Seed Texts if empty
    const [textRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM portfolio_texts');
    if (textRows && textRows[0] && textRows[0].count === 0) {
      // Seed Vietnamese translations
      for (const [key, val] of Object.entries(translations.vi)) {
        let section = 'general';
        if (key.startsWith('nav_')) section = 'navigation';
        else if (key.startsWith('hero_') || key.startsWith('cta_')) section = 'hero';
        else if (key.startsWith('about_') || key.startsWith('goal_')) section = 'about';
        else if (key.startsWith('cv_')) section = 'cv';
        else if (key.startsWith('proj_')) section = 'projects';
        else if (key.startsWith('dash_')) section = 'dashboard';

        await p.query(
          `INSERT INTO portfolio_texts (text_key, lang, value_text, section) 
           VALUES (?, 'vi', ?, ?) 
           ON DUPLICATE KEY UPDATE value_text = VALUES(value_text), section = VALUES(section)`,
          [key, String(val), section]
        );
      }

      // Seed English translations
      for (const [key, val] of Object.entries(translations.en)) {
        let section = 'general';
        if (key.startsWith('nav_')) section = 'navigation';
        else if (key.startsWith('hero_') || key.startsWith('cta_')) section = 'hero';
        else if (key.startsWith('about_') || key.startsWith('goal_')) section = 'about';
        else if (key.startsWith('cv_')) section = 'cv';
        else if (key.startsWith('proj_')) section = 'projects';
        else if (key.startsWith('dash_')) section = 'dashboard';

        await p.query(
          `INSERT INTO portfolio_texts (text_key, lang, value_text, section) 
           VALUES (?, 'en', ?, ?) 
           ON DUPLICATE KEY UPDATE value_text = VALUES(value_text), section = VALUES(section)`,
          [key, String(val), section]
        );
      }
    }

    // Seed Projects if empty
    const [projRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM portfolio_projects');
    if (projRows && projRows[0] && projRows[0].count === 0) {
      for (let i = 0; i < DEFAULT_PROJECTS.length; i++) {
        const proj = DEFAULT_PROJECTS[i];
        await p.query(
          `INSERT INTO portfolio_projects 
            (id, title, desc_text, tags_json, img, demo_url, github_url, embed_url, featured, problem, method, insight, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            sort_order = VALUES(sort_order)`,
          [
            proj.id,
            proj.title,
            proj.desc,
            JSON.stringify(proj.tags || []),
            proj.img || '',
            proj.demoUrl || '',
            proj.githubUrl || '',
            proj.embedUrl || '',
            proj.featured ? 1 : 0,
            proj.problem || '',
            proj.method || '',
            proj.insight || '',
            i,
          ]
        );
      }
    }

    // 4. Create Rate Limits Table (shared across PM2 cluster instances)
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_rate_limits (
        ip VARCHAR(64) PRIMARY KEY,
        failed_attempts INT NOT NULL DEFAULT 0,
        locked_until BIGINT DEFAULT NULL,
        last_attempt BIGINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    _isInitialized = true;
    return {
      success: true,
      message: 'Database schema created and initial seed completed successfully.',
      tables: ['portfolio_profile', 'portfolio_texts', 'portfolio_projects', 'portfolio_rate_limits'],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database initialization failed.';
    console.error('[MySQL] Database init failed:', error);
    return {
      success: false,
      message,
    };
  }
}

/**
 * Shared Rate Limiting operations via MySQL
 */
export async function getDbRateLimit(ip: string): Promise<{
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
} | null> {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT failed_attempts, locked_until, last_attempt FROM portfolio_rate_limits WHERE ip = ?',
      [ip]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      failedAttempts: Number(r.failed_attempts) || 0,
      lockedUntil: r.locked_until !== null ? Number(r.locked_until) : null,
      lastAttempt: Number(r.last_attempt) || 0,
    };
  } catch {
    return null;
  }
}

export async function recordDbFailedLogin(
  ip: string,
  maxAttempts: number,
  lockoutDurationMs: number,
  attemptWindowMs: number
): Promise<{
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} | null> {
  const p = getDbPool();
  if (!p) return null;

  const now = Date.now();
  try {
    const current = await getDbRateLimit(ip);
    let failedAttempts = 1;
    let lockedUntil: number | null = null;

    if (current && now - current.lastAttempt <= attemptWindowMs) {
      failedAttempts = current.failedAttempts + 1;
    }

    if (failedAttempts >= maxAttempts) {
      lockedUntil = now + lockoutDurationMs;
    }

    await p.query(
      `INSERT INTO portfolio_rate_limits (ip, failed_attempts, locked_until, last_attempt)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         failed_attempts = VALUES(failed_attempts),
         locked_until = VALUES(locked_until),
         last_attempt = VALUES(last_attempt)`,
      [ip, failedAttempts, lockedUntil, now]
    );

    if (lockedUntil) {
      return {
        isLocked: true,
        remainingAttempts: 0,
        retryAfterSeconds: Math.ceil(lockoutDurationMs / 1000),
      };
    }

    return {
      isLocked: false,
      remainingAttempts: Math.max(0, maxAttempts - failedAttempts),
    };
  } catch {
    return null;
  }
}

export async function resetDbRateLimit(ip: string): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  try {
    await p.query('DELETE FROM portfolio_rate_limits WHERE ip = ?', [ip]);
    return true;
  } catch {
    return false;
  }
}

