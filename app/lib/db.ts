import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { translations } from '../data/translations';
import {
  shopOverviewKPIs,
  creatorProfile,
  shopWeeklyTrendData,
  shopTopSKUs,
  topAffiliatesList,
  shopLivestreamsList,
  shopVideosList,
  collaborativeStoresList,
  dataScopesList,
} from './seedKamiData';

let pool: Pool | null = null;
let _isInitialized = false;
let rateLimitTableReady = false;

function getSslCaConfig(): string | undefined {
  const rawCa = process.env.MYSQL_SSL_CA;
  if (!rawCa) return undefined;
  const trimmed = rawCa.trim();
  if (trimmed.includes('-----BEGIN CERTIFICATE-----')) {
    return trimmed;
  }
  try {
    if (fs.existsSync(trimmed)) {
      return fs.readFileSync(trimmed, 'utf8');
    }
  } catch {}
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    if (decoded.includes('-----BEGIN CERTIFICATE-----')) {
      return decoded;
    }
  } catch {}
  return trimmed;
}

export function buildMysqlPoolConfig(databaseUrl?: string): PoolOptions {
  const defaultConnectionLimit = process.env.VERCEL === '1' ? 3 : 5;
  const sslCa = getSslCaConfig();

  if (databaseUrl) {
    const parsedUrl = new URL(databaseUrl);
    const sslMode = (
      parsedUrl.searchParams.get('ssl-mode') ||
      parsedUrl.searchParams.get('sslMode') ||
      parsedUrl.searchParams.get('ssl') ||
      process.env.MYSQL_SSL ||
      ''
    ).toUpperCase();

    const requireSsl =
      sslMode === 'REQUIRED' ||
      sslMode === 'TRUE' ||
      sslMode === '1' ||
      sslMode === 'VERIFY_CA' ||
      sslMode === 'VERIFY_IDENTITY';

    // Xóa ssl-mode khỏi query string để mysql2 không cảnh báo tham số lạ
    parsedUrl.searchParams.delete('ssl-mode');
    parsedUrl.searchParams.delete('sslMode');

    const connectionLimit = parseInt(
      process.env.MYSQL_CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT || String(defaultConnectionLimit),
      10
    );
    const connectTimeout = parseInt(
      process.env.MYSQL_CONNECT_TIMEOUT || process.env.DB_CONNECT_TIMEOUT || '5000',
      10
    );

    return {
      uri: parsedUrl.toString(),
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
      connectTimeout,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ...(requireSsl
        ? {
            ssl: {
              rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== 'false',
              ...(sslCa ? { ca: sslCa } : {}),
            },
          }
        : {}),
    };
  }

  const requireSslEnv =
    process.env.MYSQL_SSL === 'true' || process.env.MYSQL_SSL_MODE?.toUpperCase() === 'REQUIRED';

  const connectionLimit = parseInt(
    process.env.MYSQL_CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT || String(defaultConnectionLimit),
    10
  );
  const connectTimeout = parseInt(
    process.env.MYSQL_CONNECT_TIMEOUT || process.env.DB_CONNECT_TIMEOUT || '5000',
    10
  );

  return {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
    connectTimeout,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ...(requireSslEnv
      ? {
          ssl: {
            rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== 'false',
            ...(sslCa ? { ca: sslCa } : {}),
          },
        }
      : {}),
  };
}

/**
 * Đảm bảo bảng portfolio_rate_limits luôn tồn tại ngay từ lần đăng nhập đầu tiên
 * giúp đồng bộ bộ đếm chống brute-force trên mọi worker PM2
 */
export async function ensureRateLimitTable(p: Pool): Promise<void> {
  if (rateLimitTableReady) return;
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_rate_limits (
        ip VARCHAR(64) PRIMARY KEY,
        failed_attempts INT NOT NULL DEFAULT 0,
        locked_until BIGINT DEFAULT NULL,
        last_attempt BIGINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    rateLimitTableReady = true;
  } catch {
    // Nếu MySQL offline, hệ thống tự động lùi về bộ nhớ RAM an toàn
  }
}

/**
 * Get or create the MySQL connection pool.
 */
export function getDbPool(): Pool | null {
  if (pool) return pool;

  try {
    const databaseUrl = process.env.DATABASE_URL;
    const config = buildMysqlPoolConfig(databaseUrl);
    pool = mysql.createPool(config);
    return pool;
  } catch (err) {
    console.warn('[MySQL] Could not initialize connection pool:', err instanceof Error ? err.message : String(err));
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

    // Seed Livestreams if empty
    const [ttLiveRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_livestreams');
    if (ttLiveRows && ttLiveRows[0] && ttLiveRows[0].count === 0) {
      for (let i = 0; i < shopLivestreamsList.length; i++) {
        const ls = shopLivestreamsList[i];
        await p.query(`
          INSERT INTO tiktok_shop_livestreams (
            channel_type, session_date, title, creator, duration, viewers, units_sold, gmv_million_vnd, extra_metric
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [ls.channelType, ls.sessionDate, ls.title, ls.creator, ls.duration, ls.viewers, ls.unitsSold, ls.gmvMillionVnd, ls.extraMetric]);
      }
    }

    // Seed Videos if empty
    const [ttVideoRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_videos');
    if (ttVideoRows && ttVideoRows[0] && ttVideoRows[0].count === 0) {
      for (let i = 0; i < shopVideosList.length; i++) {
        const v = shopVideosList[i];
        await p.query(`
          INSERT INTO tiktok_shop_videos (
            channel_type, video_date, title, author, views, likes, units_sold, gmv_million_vnd, interaction_rate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [v.channelType, v.videoDate, v.title, v.author, v.views, v.likes, v.unitsSold, v.gmvMillionVnd, v.interactionRate]);
      }
    }

    // Seed Collaborative Stores if empty
    const [ttStoreRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_collaborative_stores');
    if (ttStoreRows && ttStoreRows[0] && ttStoreRows[0].count === 0) {
      for (let i = 0; i < collaborativeStoresList.length; i++) {
        const s = collaborativeStoresList[i];
        await p.query(`
          INSERT INTO tiktok_shop_collaborative_stores (
            store_rank, store_name, category, total_shop_units, affiliated_products,
            best_seller, creator_units_sold, creator_gmv_million_vnd, gmv_share, live_sessions, videos_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          s.storeRank, s.storeName, s.category, s.totalShopUnits, s.affiliatedProducts,
          s.bestSeller, s.creatorUnitsSold, s.creatorGmvMillionVnd, s.gmvShare, s.liveSessions, s.videosCount,
        ]);
      }
    }

    // Seed Data Scopes if empty
    const [ttScopeRows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tiktok_shop_data_scopes');
    if (ttScopeRows && ttScopeRows[0] && ttScopeRows[0].count === 0) {
      for (let i = 0; i < dataScopesList.length; i++) {
        const ds = dataScopesList[i];
        await p.query(`
          INSERT INTO tiktok_shop_data_scopes (
            scope_code, scope_type, title_vi, title_en, timeframe_vi, timeframe_en,
            timeframe_badge, period_vi, period_en, total_gmv, total_units,
            key_highlights_json, screenshot_ids_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          ds.scopeCode, ds.scopeType, ds.titleVi, ds.titleEn, ds.timeframeVi, ds.timeframeEn,
          ds.timeframeBadge, ds.periodVi, ds.periodEn, ds.totalGmv, ds.totalUnits,
          ds.keyHighlightsJson, ds.screenshotIdsJson,
        ]);
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

  await ensureRateLimitTable(p);

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

  await ensureRateLimitTable(p);

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

// ==========================================
// TikTok Shop (Kami Ely) 180-Day Time-Series Query
// ==========================================

export async function getDbTikTokTimeSeries() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT record_date as date, date_label as dateLabel, original_gmv as original, trend_gmv as trend, seasonal_gmv as seasonal, residual_gmv as residual, live_streams as liveStreams FROM tiktok_shop_timeseries ORDER BY record_date ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        date: String(r.date),
        dateLabel: String(r.dateLabel),
        original: Number(r.original),
        trend: Number(r.trend),
        seasonal: Number(r.seasonal),
        residual: Number(r.residual),
        liveStreams: Number(r.liveStreams),
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbTikTokOverview() {
  const p = getDbPool();
  if (!p) return { shop: shopOverviewKPIs, creator: creatorProfile };

  try {
    const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM tiktok_shop_overview');
    if (Array.isArray(rows) && rows.length > 0) {
      let shop: any = shopOverviewKPIs;
      let creator: any = creatorProfile;
      for (const r of rows) {
        if (r.entity_type === 'shop') {
          shop = r.metrics_json ? JSON.parse(r.metrics_json) : {
            totalGmvAllTime: r.total_gmv_all_time,
            totalUnitsAllTime: r.total_units_all_time,
            activeSkus: Number(r.active_skus),
            historicalSkus: Number(r.historical_skus),
            nationalRank: r.national_rank,
            categoryRank: r.category_rank,
            categoryName: r.category_name,
            inclusionDate: r.inclusion_date,
            priceRange: r.price_range,
            totalLiveStreams: r.total_livestreams,
            totalVideos: r.total_videos,
            totalAffiliates: r.total_affiliates,
            rating: r.rating,
            positiveRate: r.positive_rate,
            qualityScore: Number(r.quality_score),
            responseRate24h: r.response_rate_24h,
            shipWithin48h: r.ship_within_48h,
            period180dUnits: r.period_180d_units,
            period180dGmv: r.period_180d_gmv,
          };
        } else if (r.entity_type === 'creator') {
          creator = r.metrics_json ? JSON.parse(r.metrics_json) : {
            name: r.entity_name,
            totalGmv: r.total_gmv_all_time,
            totalUnitsSold: r.total_units_all_time,
            nationalRank: r.national_rank,
            categoryRank: r.category_rank,
            category: r.category_name,
            priceRange: r.price_range,
            liveGmv: r.period_180d_gmv,
          };
        }
      }
      return { shop, creator };
    }
    return { shop: shopOverviewKPIs, creator: creatorProfile };
  } catch {
    return { shop: shopOverviewKPIs, creator: creatorProfile };
  }
}

export async function getDbTikTokCollaborativeStores() {
  const p = getDbPool();
  if (!p) return collaborativeStoresList;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT store_rank as `rank`, store_name as name, store_name as storeName, category, total_shop_units as totalShopUnits, affiliated_products as affiliatedProducts, best_seller as bestSeller, creator_units_sold as creatorUnitsSold, CONCAT(creator_units_sold, " SP") as unitsSold, creator_gmv_million_vnd as creatorGmv, CONCAT(creator_gmv_million_vnd, " Triệu đ") as gmv, CONCAT(creator_gmv_million_vnd, " Triệu đ") as gmvDisplay, gmv_share as gmvShare, live_sessions as liveSessions, videos_count as videosCount FROM tiktok_shop_collaborative_stores ORDER BY store_rank ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        rank: Number(r.rank),
        name: String(r.name),
        storeName: String(r.storeName),
        category: String(r.category || ''),
        totalShopUnits: String(r.totalShopUnits || ''),
        affiliatedProducts: Number(r.affiliatedProducts || 0),
        bestSeller: String(r.bestSeller || ''),
        creatorUnitsSold: Number(r.creatorUnitsSold || 0),
        unitsSold: String(r.unitsSold || ''),
        unitsShare: String(r.unitsShare || ''),
        creatorGmv: Number(r.creatorGmv || 0),
        gmv: String(r.gmv || ''),
        gmvDisplay: String(r.gmvDisplay || ''),
        gmvShare: String(r.gmvShare || ''),
        liveSessions: Number(r.liveSessions || 0),
        videosCount: Number(r.videosCount || 0),
      }));
    }
    return collaborativeStoresList;
  } catch {
    return collaborativeStoresList;
  }
}

export async function getDbTikTokDataScopes() {
  const p = getDbPool();
  if (!p) return dataScopesList;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT * FROM tiktok_shop_data_scopes ORDER BY id ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        id: Number(r.id),
        scopeCode: String(r.scope_code),
        scopeType: String(r.scope_type) as 'shop' | 'creator',
        titleVi: String(r.title_vi),
        titleEn: String(r.title_en),
        timeframeVi: String(r.timeframe_vi || ''),
        timeframeEn: String(r.timeframe_en || ''),
        timeframeBadge: String(r.timeframe_badge || ''),
        periodVi: String(r.period_vi || ''),
        periodEn: String(r.period_en || ''),
        totalGmv: String(r.total_gmv || ''),
        totalUnits: String(r.total_units || ''),
        keyHighlights: r.key_highlights_json ? JSON.parse(r.key_highlights_json) : [],
        screenshotIds: r.screenshot_ids_json ? JSON.parse(r.screenshot_ids_json) : [],
      }));
    }
    return dataScopesList;
  } catch {
    return dataScopesList;
  }
}

export async function getDbTikTokLivestreams(channelType?: 'shop' | 'creator') {
  const p = getDbPool();
  if (!p) return shopLivestreamsList;

  try {
    let sql = 'SELECT id, channel_type as channelType, session_date as sessionDate, title, creator, duration, viewers, units_sold as units, gmv_million_vnd as gmv FROM tiktok_shop_livestreams';
    const params: any[] = [];
    if (channelType) {
      sql += ' WHERE channel_type = ?';
      params.push(channelType);
    }
    sql += ' ORDER BY gmv_million_vnd DESC';
    const [rows] = await p.query<RowDataPacket[]>(sql, params);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        id: Number(r.id),
        channelType: String(r.channelType) as 'shop' | 'creator',
        sessionDate: String(r.sessionDate || ''),
        title: String(r.title),
        creator: String(r.creator || ''),
        duration: String(r.duration || ''),
        viewers: Number(r.viewers || 0),
        units: Number(r.units || 0),
        gmv: Number(r.gmv || 0),
      }));
    }
    return shopLivestreamsList;
  } catch {
    return shopLivestreamsList;
  }
}

export async function getDbTikTokVideos(channelType?: 'shop' | 'creator') {
  const p = getDbPool();
  if (!p) return shopVideosList;

  try {
    let sql = 'SELECT id, channel_type as channelType, video_date as videoDate, title, author, views, likes, units_sold as units, gmv_million_vnd as gmv, interaction_rate as interactionRate FROM tiktok_shop_videos';
    const params: any[] = [];
    if (channelType) {
      sql += ' WHERE channel_type = ?';
      params.push(channelType);
    }
    sql += ' ORDER BY gmv_million_vnd DESC';
    const [rows] = await p.query<RowDataPacket[]>(sql, params);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        id: Number(r.id),
        channelType: String(r.channelType) as 'shop' | 'creator',
        videoDate: String(r.videoDate || ''),
        title: String(r.title),
        author: String(r.author || ''),
        views: String(r.views || '0'),
        likes: String(r.likes || '0'),
        units: Number(r.units || 0),
        gmv: Number(r.gmv || 0),
        interactionRate: String(r.interactionRate || ''),
      }));
    }
    return shopVideosList;
  } catch {
    return shopVideosList;
  }
}

// ==========================================
// Heritage Japan Tourism Queries
// ==========================================

export async function getDbHeritageJapanTourists() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT year, visitors_million as value, counterfactual_million as counterfactual, is_thesis as isThesis, policy_event as policyEvent, source FROM heritage_japan_tourists ORDER BY year ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        year: String(r.year),
        value: Number(r.value),
        counterfactual: Number(r.counterfactual),
        isThesis: Boolean(r.isThesis),
        policyEvent: r.policyEvent ? String(r.policyEvent) : undefined,
        source: r.source ? String(r.source) : undefined,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbHeritageJapanSpend() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT year, spend_trillion_jpy as value, is_thesis as isThesis, source FROM heritage_japan_spend ORDER BY year ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        year: String(r.year),
        value: Number(r.value),
        isThesis: Boolean(r.isThesis),
        source: r.source ? String(r.source) : undefined,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbHeritageJapanRegional() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT year, kyoto_visitors_thousand as kyoto, nara_visitors_thousand as nara FROM heritage_japan_regional ORDER BY year ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        year: String(r.year),
        kyoto: Number(r.kyoto),
        nara: Number(r.nara),
      }));
    }
    return null;
  } catch {
    return null;
  }
}

// ==========================================
// Library Bus System Queries
// ==========================================

export async function getDbLibraryBusBenchmarks() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT endpoint_name as endpoint, without_cache_ms as withoutCache, with_cache_ms as withCache, reduction_percent as reduction FROM library_bus_latency_benchmarks'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        endpoint: String(r.endpoint),
        withoutCache: Number(r.withoutCache),
        withCache: Number(r.withCache),
        reduction: String(r.reduction),
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbLibraryBusWeekly() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT day_code as day, borrows_count as borrows, returns_count as returns, active_users as activeUsers FROM library_bus_weekly_activity ORDER BY day_index ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        day: String(r.day),
        borrows: Number(r.borrows),
        returns: Number(r.returns),
        activeUsers: Number(r.activeUsers),
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbTsddFleet() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [rows] = await p.query<RowDataPacket[]>(
      'SELECT name, license_plate as licensePlate, operating_status as status, capacity, _book_count as bookCount FROM tsdd.inventory_librarybus ORDER BY created_at ASC'
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        name: String(r.name),
        licensePlate: String(r.licensePlate),
        status: String(r.status),
        capacity: Number(r.capacity) || 500,
        bookCount: Number(r.bookCount) || 0,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDbDapOrderStats() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [summary] = await p.query<RowDataPacket[]>(
      'SELECT COUNT(*) as totalOrders, SUM(gross_revenue) as totalGmv, SUM(quantity) as totalQty FROM dap.fact_order_items'
    );
    const [topCreators] = await p.query<RowDataPacket[]>(
      `SELECT c.creator_name as name, c.creator_handle as handle, COUNT(*) as orders, SUM(f.gross_revenue) as gmv 
       FROM dap.fact_order_items f 
       JOIN dap.dim_creators c ON f.creator_sk = c.creator_sk 
       GROUP BY c.creator_name, c.creator_handle 
       ORDER BY gmv DESC`
    );
    return {
      summary: summary[0] || null,
      topCreators: topCreators || [],
    };
  } catch {
    return null;
  }
}

export async function getDbTsddInventoryStats() {
  const p = getDbPool();
  if (!p) return null;

  try {
    const [books] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as totalBooks FROM tsdd.inventory_book');
    const [buses] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as totalBuses FROM tsdd.inventory_librarybus');
    const [borrows] = await p.query<RowDataPacket[]>('SELECT COUNT(*) as totalBorrows FROM tsdd.transactions_borrowrecord');
    return {
      totalBooks: Number(books[0]?.totalBooks) || 0,
      totalBuses: Number(buses[0]?.totalBuses) || 0,
      totalBorrows: Number(borrows[0]?.totalBorrows) || 0,
    };
  } catch {
    return null;
  }
}
