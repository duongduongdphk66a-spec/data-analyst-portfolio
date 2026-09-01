import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { translations } from '../data/translations';

let pool: Pool | null = null;
let isInitialized = false;

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

  try {
    const config: PoolOptions = databaseUrl
      ? { uri: databaseUrl, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
      : {
          host: dbHost,
          port: dbPort,
          user: dbUser,
          password: dbPassword,
          database: dbName,
          waitForConnections: true,
          connectionLimit: 10,
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
export async function testDbConnection(): Promise<{ connected: boolean; message: string; config?: Record<string, any> }> {
  try {
    const p = getDbPool();
    if (!p) {
      return { connected: false, message: 'MySQL Pool is not available.' };
    }
    const [rows] = await p.query('SELECT 1 + 1 AS solution');
    return {
      connected: true,
      message: 'Successfully connected to MySQL database.',
      config: {
        host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
        port: process.env.MYSQL_PORT || process.env.DB_PORT || '3306',
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'portfolio_db',
        user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
      },
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Failed to connect to MySQL database.',
    };
  }
}

/**
 * Initialize Tables and Seed Initial Data if not present
 */
export async function initDatabase(): Promise<{ success: boolean; message: string; tables?: string[] }> {
  try {
    const p = getDbPool();
    if (!p) {
      return { success: false, message: 'No MySQL database connection available.' };
    }

    // 1. Create table portfolio_profile
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_profile (
        id INT NOT NULL DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) DEFAULT '',
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

    // 2. Create table portfolio_texts
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_texts (
        text_key VARCHAR(120) NOT NULL,
        lang VARCHAR(10) NOT NULL DEFAULT 'vi',
        value_text LONGTEXT NOT NULL,
        section VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (text_key, lang)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Create table portfolio_projects
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        desc_text TEXT NOT NULL,
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
    const [profRows]: any = await p.query('SELECT COUNT(*) as count FROM portfolio_profile WHERE id = 1');
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
    const [textRows]: any = await p.query('SELECT COUNT(*) as count FROM portfolio_texts');
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

    isInitialized = true;
    return {
      success: true,
      message: 'Database schema created and initial seed completed successfully.',
      tables: ['portfolio_profile', 'portfolio_texts', 'portfolio_projects'],
    };
  } catch (error: any) {
    console.error('[MySQL] Database init failed:', error);
    return {
      success: false,
      message: error?.message || 'Database initialization failed.',
    };
  }
}
