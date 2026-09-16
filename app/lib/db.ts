import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { translations } from '../data/translations';
import {
  shopOverviewKPIs,
  creatorProfile,
  shopWeeklyTrendData,
  shopTopSKUs,
  topAffiliatesList,
} from './seedKamiData';

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
 * Phân loại section của văn bản dựa theo tiền tố key (nav_, hero_, about_, cv_, proj_, dash_)
 */
export function resolveSection(key: string): string {
  if (key.startsWith('nav_')) return 'navigation';
  if (key.startsWith('hero_') || key.startsWith('cta_')) return 'hero';
  if (key.startsWith('about_') || key.startsWith('goal_')) return 'about';
  if (key.startsWith('cv_')) return 'cv';
  if (key.startsWith('proj_')) return 'projects';
  if (key.startsWith('dash_')) return 'dashboard';
  return 'general';
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
        content LONGTEXT,
        metrics_json LONGTEXT,
        tools_json LONGTEXT,
        sort_order INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure columns exist if table was created in an older schema version
    const projectCols = [
      { name: 'content', type: 'LONGTEXT' },
      { name: 'metrics_json', type: 'LONGTEXT' },
      { name: 'tools_json', type: 'LONGTEXT' },
    ];
    for (const col of projectCols) {
      try {
        await p.query(`ALTER TABLE portfolio_projects ADD COLUMN ${col.name} ${col.type}`);
      } catch {
        // Column already exists
      }
    }

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
        const section = resolveSection(key);
        await p.query(
          `INSERT INTO portfolio_texts (text_key, lang, value_text, section) 
           VALUES (?, 'vi', ?, ?) 
           ON DUPLICATE KEY UPDATE value_text = VALUES(value_text), section = VALUES(section)`,
          [key, String(val), section]
        );
      }

      // Seed English translations
      for (const [key, val] of Object.entries(translations.en)) {
        const section = resolveSection(key);
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
            (id, title, desc_text, tags_json, img, demo_url, github_url, embed_url, featured, problem, method, insight, content, metrics_json, tools_json, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            proj.content || '',
            JSON.stringify(proj.metrics || []),
            JSON.stringify(proj.tools || []),
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

    // 5. Create Cache Table (shared API cache across PM2 cluster instances)
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_cache (
        cache_key VARCHAR(100) PRIMARY KEY,
        data_json LONGTEXT NOT NULL,
        expires_at BIGINT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Create TikTok Shop (Kami Ely) Tables
    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_overview (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        entity_type ENUM('shop', 'creator') NOT NULL,
        entity_name VARCHAR(255) NOT NULL,
        total_gmv_all_time VARCHAR(100) DEFAULT '',
        total_units_all_time VARCHAR(100) DEFAULT '',
        active_skus INT DEFAULT 0,
        historical_skus INT DEFAULT 0,
        national_rank VARCHAR(50) DEFAULT '',
        category_rank VARCHAR(50) DEFAULT '',
        category_name VARCHAR(100) DEFAULT '',
        inclusion_date VARCHAR(50) DEFAULT '',
        price_range VARCHAR(100) DEFAULT '',
        total_livestreams VARCHAR(50) DEFAULT '',
        total_videos VARCHAR(50) DEFAULT '',
        total_affiliates VARCHAR(50) DEFAULT '',
        rating VARCHAR(50) DEFAULT '',
        positive_rate VARCHAR(50) DEFAULT '',
        quality_score INT DEFAULT 0,
        response_rate_24h VARCHAR(50) DEFAULT '',
        ship_within_48h VARCHAR(50) DEFAULT '',
        period_180d_units VARCHAR(50) DEFAULT '',
        period_180d_gmv VARCHAR(50) DEFAULT '',
        metrics_json LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_weekly_trends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        week_index INT NOT NULL,
        week_date VARCHAR(20) NOT NULL,
        units INT NOT NULL,
        gmv_million_vnd DECIMAL(10,2) NOT NULL,
        live_count INT NOT NULL DEFAULT 0,
        video_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_week (week_index)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_top_skus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sku_code VARCHAR(50) NOT NULL UNIQUE,
        sku_rank INT NOT NULL,
        sku_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        unit_price INT NOT NULL DEFAULT 0,
        units_sold INT NOT NULL DEFAULT 0,
        gmv_million_vnd DECIMAL(10,2) NOT NULL DEFAULT 0,
        commission_rate INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_top_affiliates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        affiliate_code VARCHAR(100) NOT NULL UNIQUE,
        affiliate_rank INT NOT NULL,
        creator_name VARCHAR(255) NOT NULL,
        category_type VARCHAR(100) DEFAULT '',
        followers INT NOT NULL DEFAULT 0,
        units_sold INT NOT NULL DEFAULT 0,
        gmv_million_vnd DECIMAL(10,2) NOT NULL DEFAULT 0,
        live_gpm VARCHAR(100) DEFAULT '',
        video_gpm VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_livestreams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        channel_type ENUM('shop', 'creator') NOT NULL DEFAULT 'shop',
        session_date VARCHAR(50) NOT NULL,
        title VARCHAR(500) NOT NULL,
        creator VARCHAR(100) DEFAULT '',
        duration VARCHAR(50) DEFAULT '',
        viewers INT NOT NULL DEFAULT 0,
        units_sold INT NOT NULL DEFAULT 0,
        gmv_million_vnd DECIMAL(10,2) NOT NULL DEFAULT 0,
        extra_metric VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        channel_type ENUM('shop', 'creator') NOT NULL DEFAULT 'shop',
        video_date VARCHAR(50) NOT NULL,
        title VARCHAR(500) NOT NULL,
        author VARCHAR(100) DEFAULT '',
        views VARCHAR(50) DEFAULT '',
        likes VARCHAR(50) DEFAULT '',
        units_sold INT NOT NULL DEFAULT 0,
        gmv_million_vnd DECIMAL(10,2) NOT NULL DEFAULT 0,
        interaction_rate VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_data_scopes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        scope_code VARCHAR(50) NOT NULL UNIQUE,
        scope_type VARCHAR(50) NOT NULL,
        title_vi VARCHAR(255) NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        timeframe_vi VARCHAR(255) DEFAULT '',
        timeframe_en VARCHAR(255) DEFAULT '',
        timeframe_badge VARCHAR(100) DEFAULT '',
        period_vi VARCHAR(255) DEFAULT '',
        period_en VARCHAR(255) DEFAULT '',
        total_gmv VARCHAR(100) DEFAULT '',
        total_units VARCHAR(100) DEFAULT '',
        key_highlights_json LONGTEXT,
        screenshot_ids_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS tiktok_shop_collaborative_stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        store_rank INT NOT NULL,
        store_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT '',
        total_shop_units VARCHAR(50) DEFAULT '',
        affiliated_products INT DEFAULT 0,
        best_seller VARCHAR(255) DEFAULT '',
        creator_units_sold INT DEFAULT 0,
        creator_gmv_million_vnd DECIMAL(10,2) DEFAULT 0,
        gmv_share VARCHAR(50) DEFAULT '',
        live_sessions INT DEFAULT 0,
        videos_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_store (store_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed TikTok Overview if empty
    const [ttOverviewRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_overview');
    if (ttOverviewRows && ttOverviewRows[0] && ttOverviewRows[0].count === 0) {
      await p.query(`
        INSERT INTO tiktok_shop_overview (
          id, entity_type, entity_name, total_gmv_all_time, total_units_all_time,
          active_skus, historical_skus, national_rank, category_rank, category_name,
          inclusion_date, price_range, total_livestreams, total_videos, total_affiliates,
          rating, positive_rate, quality_score, response_rate_24h, ship_within_48h,
          period_180d_units, period_180d_gmv, metrics_json
        ) VALUES (
          'kami_ely_shop', 'shop', 'KAMI ELY OFFICIAL STORE',
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        shopOverviewKPIs.totalGmvAllTime,
        shopOverviewKPIs.totalUnitsAllTime,
        shopOverviewKPIs.activeSkus,
        shopOverviewKPIs.historicalSkus,
        shopOverviewKPIs.nationalRank,
        shopOverviewKPIs.categoryRank,
        shopOverviewKPIs.categoryName,
        shopOverviewKPIs.inclusionDate,
        shopOverviewKPIs.priceRange,
        shopOverviewKPIs.totalLiveStreams,
        shopOverviewKPIs.totalVideos,
        shopOverviewKPIs.totalAffiliates,
        shopOverviewKPIs.rating,
        shopOverviewKPIs.positiveRate,
        shopOverviewKPIs.qualityScore,
        shopOverviewKPIs.responseRate24h,
        shopOverviewKPIs.shipWithin48h,
        shopOverviewKPIs.period180dUnits,
        shopOverviewKPIs.period180dGmv,
        JSON.stringify(shopOverviewKPIs)
      ]);

      await p.query(`
        INSERT INTO tiktok_shop_overview (
          id, entity_type, entity_name, total_gmv_all_time, total_units_all_time,
          active_skus, historical_skus, national_rank, category_rank, category_name,
          inclusion_date, price_range, total_livestreams, total_videos, total_affiliates,
          rating, positive_rate, quality_score, response_rate_24h, ship_within_48h,
          period_180d_units, period_180d_gmv, metrics_json
        ) VALUES (
          'creator_kamielyn', 'creator', 'Creator @kamielyhn (Kamielyn)',
          '9,2 Tỷ đ', '69.9k SP', 0, 0, '#10.2k', '#365', 'Womenswear & Swimwear',
          '2022', '35.0k đ - 350.0k đ', '470', '653', '0',
          '4.8 / 5.0', '98%', 95, '99%', '90%',
          '49.8k SP', '7,02 Tỷ đ', ?
        )
      `, [JSON.stringify(creatorProfile)]);
    }

    // Seed Weekly Trends if empty
    const [ttWeeklyRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_weekly_trends');
    if (ttWeeklyRows && ttWeeklyRows[0] && ttWeeklyRows[0].count === 0) {
      for (let i = 0; i < shopWeeklyTrendData.length; i++) {
        const w = shopWeeklyTrendData[i];
        await p.query(`
          INSERT INTO tiktok_shop_weekly_trends (
            week_index, week_date, units, gmv_million_vnd, live_count, video_count
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [i + 1, w.date, w.units, w.gmv, w.live, w.video]);
      }
    }

    // Seed Top SKUs if empty
    const [ttSkuRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_top_skus');
    if (ttSkuRows && ttSkuRows[0] && ttSkuRows[0].count === 0) {
      for (let i = 0; i < shopTopSKUs.length; i++) {
        const sku = shopTopSKUs[i];
        await p.query(`
          INSERT INTO tiktok_shop_top_skus (
            sku_code, sku_rank, sku_name, category, unit_price, units_sold, gmv_million_vnd, commission_rate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [sku.code, i + 1, sku.name, sku.category, sku.price, sku.units, sku.gmv, sku.commission]);
      }
    }

    // Seed Top Affiliates if empty
    const [ttAffRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_top_affiliates');
    if (ttAffRows && ttAffRows[0] && ttAffRows[0].count === 0) {
      for (let i = 0; i < topAffiliatesList.length; i++) {
        const aff = topAffiliatesList[i];
        await p.query(`
          INSERT INTO tiktok_shop_top_affiliates (
            affiliate_code, affiliate_rank, creator_name, category_type, followers, units_sold, gmv_million_vnd, live_gpm, video_gpm
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [aff.id, i + 1, aff.name, aff.type, aff.followers, aff.units, aff.gmv, aff.liveGpm, aff.videoGpm]);
      }
    }

    _isInitialized = true;

    // Cleanup stale rate limit records (older than 24h, not currently locked)
    try {
      const cleanupThreshold = Date.now() - 24 * 60 * 60 * 1000; // 24 giờ trước
      await p.query(
        'DELETE FROM portfolio_rate_limits WHERE last_attempt < ? AND (locked_until IS NULL OR locked_until < ?)',
        [cleanupThreshold, Date.now()]
      );
    } catch {
      // Non-critical: cleanup failure should not block initialization
    }

    return {
      success: true,
      message: 'Database schema created and initial seed completed successfully.',
      tables: [
        'portfolio_profile',
        'portfolio_texts',
        'portfolio_projects',
        'portfolio_rate_limits',
        'portfolio_cache',
        'tiktok_shop_overview',
        'tiktok_shop_weekly_trends',
        'tiktok_shop_top_skus',
        'tiktok_shop_top_affiliates',
        'tiktok_shop_livestreams',
        'tiktok_shop_videos',
        'tiktok_shop_data_scopes',
        'tiktok_shop_collaborative_stores',
      ],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database initialization failed.';
    console.warn(`[MySQL] Database init failed: ${message}`);
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
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT failed_attempts, locked_until, last_attempt FROM portfolio_rate_limits WHERE ip = ? FOR UPDATE',
      [ip]
    );

    let failedAttempts = 1;
    let lockedUntil: number | null = null;

    if (rows && rows.length > 0) {
      const current = rows[0];
      const lastAttempt = Number(current.last_attempt) || 0;
      const currentAttempts = Number(current.failed_attempts) || 0;

      if (now - lastAttempt <= attemptWindowMs) {
        failedAttempts = currentAttempts + 1;
      }
    }

    if (failedAttempts >= maxAttempts) {
      lockedUntil = now + lockoutDurationMs;
    }

    await conn.query(
      `INSERT INTO portfolio_rate_limits (ip, failed_attempts, locked_until, last_attempt)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         failed_attempts = VALUES(failed_attempts),
         locked_until = VALUES(locked_until),
         last_attempt = VALUES(last_attempt)`,
      [ip, failedAttempts, lockedUntil, now]
    );

    await conn.commit();

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
  } catch (err) {
    await conn.rollback();
    console.error('[MySQL RateLimit] Transaction error:', err);
    return null;
  } finally {
    conn.release();
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

// ==========================================
// Shared API Cache via MySQL (PM2 Cluster)
// ==========================================

export async function getDbCache<T>(key: string): Promise<T | null> {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT data_json, expires_at FROM portfolio_cache WHERE cache_key = ?',
      [key]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    const now = Date.now();
    if (now > Number(r.expires_at)) {
      // Hết hạn -> Xoá background
      p.query('DELETE FROM portfolio_cache WHERE cache_key = ?', [key]).catch(() => {});
      return null;
    }
    return JSON.parse(r.data_json) as T;
  } catch {
    return null;
  }
}

export async function setDbCache<T>(key: string, data: T, ttlMs: number): Promise<void> {
  const p = getDbPool();
  if (!p) return;

  const expiresAt = Date.now() + ttlMs;
  const dataJson = JSON.stringify(data);

  try {
    await p.query(
      `INSERT INTO portfolio_cache (cache_key, data_json, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         data_json = VALUES(data_json),
         expires_at = VALUES(expires_at)`,
      [key, dataJson, expiresAt]
    );
  } catch {
    // Silent fallback
  }
}

export async function invalidateDbCache(prefixOrKey?: string): Promise<void> {
  const p = getDbPool();
  if (!p) return;

  try {
    if (!prefixOrKey) {
      await p.query('DELETE FROM portfolio_cache');
      return;
    }
    await p.query(
      'DELETE FROM portfolio_cache WHERE cache_key = ? OR cache_key LIKE ?',
      [prefixOrKey, `${prefixOrKey}:%`]
    );
  } catch {
    // Silent fallback
  }
}

// ==========================================
// TikTok Shop (Kami Ely) Query Helpers
// ==========================================

export async function getDbTikTokWeeklyTrends() {
  const p = getDbPool();
  if (!p) return shopWeeklyTrendData;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT week_date as date, units, gmv_million_vnd as gmv, live_count as live, video_count as video FROM tiktok_shop_weekly_trends ORDER BY week_index ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        date: String(r.date),
        units: Number(r.units),
        gmv: Number(r.gmv),
        live: Number(r.live),
        video: Number(r.video),
      }));
    }
    return shopWeeklyTrendData;
  } catch {
    return shopWeeklyTrendData;
  }
}

export async function getDbTikTokTopSKUs() {
  const p = getDbPool();
  if (!p) return shopTopSKUs;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT sku_code as code, sku_name as name, category, unit_price as price, units_sold as units, gmv_million_vnd as gmv, commission_rate as commission FROM tiktok_shop_top_skus ORDER BY sku_rank ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        code: String(r.code),
        name: String(r.name),
        category: String(r.category),
        price: Number(r.price),
        units: Number(r.units),
        gmv: Number(r.gmv),
        commission: Number(r.commission),
      }));
    }
    return shopTopSKUs;
  } catch {
    return shopTopSKUs;
  }
}

export async function getDbTikTokTopAffiliates() {
  const p = getDbPool();
  if (!p) return topAffiliatesList;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT affiliate_code as id, creator_name as name, category_type as type, followers, units_sold as units, gmv_million_vnd as gmv, live_gpm as liveGpm, video_gpm as videoGpm FROM tiktok_shop_top_affiliates ORDER BY affiliate_rank ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        type: String(r.type),
        followers: Number(r.followers),
        units: Number(r.units),
        gmv: Number(r.gmv),
        liveGpm: String(r.liveGpm),
        videoGpm: String(r.videoGpm),
      }));
    }
    return topAffiliatesList;
  } catch {
    return topAffiliatesList;
  }
}


