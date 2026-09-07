import mysql from 'mysql2/promise';
import {
  shopOverviewKPIs,
  creatorProfile,
  shopWeeklyTrendData,
  shopTopSKUs,
  topAffiliatesList,
  topShopLiveSessions,
  topShoppableVideos,
  creatorTopLiveStreams,
  creatorTopVideos,
  creatorCollaborativeStores,
  KAMI_DATA_SCOPES
} from '../app/data/kamiElyData.ts';

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'pplo',
  });

  console.log('[MySQL] Connected to database:', process.env.MYSQL_DATABASE || 'pplo');

  // 1. CREATE TABLES
  console.log('[MySQL] Creating TikTok Shop tables if not exists...');

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  await conn.query(`
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

  // 2. SEED DATA
  console.log('[MySQL] Seeding data into TikTok Shop tables...');

  // A. tiktok_shop_overview
  await conn.query(`
    INSERT INTO tiktok_shop_overview (
      id, entity_type, entity_name, total_gmv_all_time, total_units_all_time,
      active_skus, historical_skus, national_rank, category_rank, category_name,
      inclusion_date, price_range, total_livestreams, total_videos, total_affiliates,
      rating, positive_rate, quality_score, response_rate_24h, ship_within_48h,
      period_180d_units, period_180d_gmv, metrics_json
    ) VALUES (
      'kami_ely_shop', 'shop', 'KAMI ELY OFFICIAL STORE',
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    ) ON DUPLICATE KEY UPDATE
      total_gmv_all_time = VALUES(total_gmv_all_time),
      total_units_all_time = VALUES(total_units_all_time),
      active_skus = VALUES(active_skus),
      historical_skus = VALUES(historical_skus),
      national_rank = VALUES(national_rank),
      category_rank = VALUES(category_rank),
      category_name = VALUES(category_name),
      inclusion_date = VALUES(inclusion_date),
      price_range = VALUES(price_range),
      total_livestreams = VALUES(total_livestreams),
      total_videos = VALUES(total_videos),
      total_affiliates = VALUES(total_affiliates),
      rating = VALUES(rating),
      positive_rate = VALUES(positive_rate),
      quality_score = VALUES(quality_score),
      response_rate_24h = VALUES(response_rate_24h),
      ship_within_48h = VALUES(ship_within_48h),
      period_180d_units = VALUES(period_180d_units),
      period_180d_gmv = VALUES(period_180d_gmv);
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

  // Creator profile overview
  await conn.query(`
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
    ) ON DUPLICATE KEY UPDATE
      total_gmv_all_time = VALUES(total_gmv_all_time),
      total_units_all_time = VALUES(total_units_all_time),
      period_180d_units = VALUES(period_180d_units),
      period_180d_gmv = VALUES(period_180d_gmv);
  `, [JSON.stringify(creatorProfile)]);

  // B. Weekly Trends (26 weeks)
  for (let i = 0; i < shopWeeklyTrendData.length; i++) {
    const w = shopWeeklyTrendData[i];
    await conn.query(`
      INSERT INTO tiktok_shop_weekly_trends (
        week_index, week_date, units, gmv_million_vnd, live_count, video_count
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        week_date = VALUES(week_date),
        units = VALUES(units),
        gmv_million_vnd = VALUES(gmv_million_vnd),
        live_count = VALUES(live_count),
        video_count = VALUES(video_count);
    `, [i + 1, w.date, w.units, w.gmv, w.live, w.video]);
  }

  // C. Top SKUs (6 items)
  for (let i = 0; i < shopTopSKUs.length; i++) {
    const sku = shopTopSKUs[i];
    await conn.query(`
      INSERT INTO tiktok_shop_top_skus (
        sku_code, sku_rank, sku_name, category, unit_price, units_sold, gmv_million_vnd, commission_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        sku_rank = VALUES(sku_rank),
        sku_name = VALUES(sku_name),
        category = VALUES(category),
        unit_price = VALUES(unit_price),
        units_sold = VALUES(units_sold),
        gmv_million_vnd = VALUES(gmv_million_vnd),
        commission_rate = VALUES(commission_rate);
    `, [sku.code, i + 1, sku.name, sku.category, sku.price, sku.units, sku.gmv, sku.commission]);
  }

  // D. Top Affiliates (6 creators)
  for (let i = 0; i < topAffiliatesList.length; i++) {
    const aff = topAffiliatesList[i];
    await conn.query(`
      INSERT INTO tiktok_shop_top_affiliates (
        affiliate_code, affiliate_rank, creator_name, category_type, followers, units_sold, gmv_million_vnd, live_gpm, video_gpm
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        affiliate_rank = VALUES(affiliate_rank),
        creator_name = VALUES(creator_name),
        category_type = VALUES(category_type),
        followers = VALUES(followers),
        units_sold = VALUES(units_sold),
        gmv_million_vnd = VALUES(gmv_million_vnd),
        live_gpm = VALUES(live_gpm),
        video_gpm = VALUES(video_gpm);
    `, [aff.id, i + 1, aff.name, aff.type, aff.followers, aff.units, aff.gmv, aff.liveGpm, aff.videoGpm]);
  }

  // E. Livestreams (Shop + Creator)
  await conn.query('DELETE FROM tiktok_shop_livestreams;');
  for (const s of topShopLiveSessions) {
    await conn.query(`
      INSERT INTO tiktok_shop_livestreams (
        channel_type, session_date, title, creator, duration, viewers, units_sold, gmv_million_vnd, extra_metric
      ) VALUES ('shop', ?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.startTime, s.title, s.creator, s.duration, s.viewers, s.units, s.gmv, s.type]);
  }
  for (const c of creatorTopLiveStreams) {
    await conn.query(`
      INSERT INTO tiktok_shop_livestreams (
        channel_type, session_date, title, creator, duration, viewers, units_sold, gmv_million_vnd, extra_metric
      ) VALUES ('creator', ?, ?, 'Kamielyn', ?, ?, ?, ?, ?)
    `, [c.startTime, c.title, c.duration, c.viewers, c.units, c.gmv, `UV ${c.uv}`]);
  }

  // F. Shoppable Videos (Shop + Creator)
  await conn.query('DELETE FROM tiktok_shop_videos;');
  for (const v of topShoppableVideos) {
    await conn.query(`
      INSERT INTO tiktok_shop_videos (
        channel_type, video_date, title, author, views, likes, units_sold, gmv_million_vnd, interaction_rate
      ) VALUES ('shop', 'Recent 90d', ?, ?, ?, ?, ?, ?, ?)
    `, [v.title, v.creator, v.views, v.likes, v.units, v.gmv, v.ads]);
  }
  for (const cv of creatorTopVideos) {
    await conn.query(`
      INSERT INTO tiktok_shop_videos (
        channel_type, video_date, title, author, views, likes, units_sold, gmv_million_vnd, interaction_rate
      ) VALUES ('creator', ?, ?, 'Kamielyn', ?, ?, ?, ?, ?)
    `, [cv.publishDate, cv.title, String(cv.views), String(cv.likes), cv.units, cv.gmv, cv.interactionRate]);
  }

  // G. Data Scopes (8 scopes)
  for (const sc of KAMI_DATA_SCOPES) {
    await conn.query(`
      INSERT INTO tiktok_shop_data_scopes (
        scope_code, scope_type, title_vi, title_en, timeframe_vi, timeframe_en,
        timeframe_badge, period_vi, period_en, total_gmv, total_units,
        key_highlights_json, screenshot_ids_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        scope_type = VALUES(scope_type),
        title_vi = VALUES(title_vi),
        title_en = VALUES(title_en),
        timeframe_vi = VALUES(timeframe_vi),
        timeframe_en = VALUES(timeframe_en),
        timeframe_badge = VALUES(timeframe_badge),
        period_vi = VALUES(period_vi),
        period_en = VALUES(period_en),
        total_gmv = VALUES(total_gmv),
        total_units = VALUES(total_units),
        key_highlights_json = VALUES(key_highlights_json),
        screenshot_ids_json = VALUES(screenshot_ids_json);
    `, [
      sc.id, sc.scope, sc.scopeLabelVi, sc.scopeLabelEn, sc.timeframeVi, sc.timeframeEn,
      sc.timeframeBadge, sc.periodVi, sc.periodEn, sc.totalGmv, sc.totalUnits,
      JSON.stringify(sc.keyHighlightsVi), JSON.stringify(sc.screenshotIds)
    ]);
  }

  // H. Collaborative Stores (10 partner stores)
  for (const cs of creatorCollaborativeStores) {
    await conn.query(`
      INSERT INTO tiktok_shop_collaborative_stores (
        store_rank, store_name, category, total_shop_units, affiliated_products,
        best_seller, creator_units_sold, creator_gmv_million_vnd, gmv_share,
        live_sessions, videos_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        store_rank = VALUES(store_rank),
        category = VALUES(category),
        total_shop_units = VALUES(total_shop_units),
        affiliated_products = VALUES(affiliated_products),
        best_seller = VALUES(best_seller),
        creator_units_sold = VALUES(creator_units_sold),
        creator_gmv_million_vnd = VALUES(creator_gmv_million_vnd),
        gmv_share = VALUES(gmv_share),
        live_sessions = VALUES(live_sessions),
        videos_count = VALUES(videos_count);
    `, [
      cs.rank, cs.storeName, cs.category, cs.totalShopUnits, cs.affiliatedProducts,
      cs.bestSeller, cs.creatorUnitsSold, cs.creatorGmv, cs.gmvShare,
      cs.liveSessions, cs.videosCount
    ]);
  }

  console.log('[MySQL] Seeding completed successfully!');

  // 3. STATS REPORT
  const tables = [
    'tiktok_shop_overview',
    'tiktok_shop_weekly_trends',
    'tiktok_shop_top_skus',
    'tiktok_shop_top_affiliates',
    'tiktok_shop_livestreams',
    'tiktok_shop_videos',
    'tiktok_shop_data_scopes',
    'tiktok_shop_collaborative_stores'
  ];

  console.log('\n--- VERIFICATION OF TIKTOK SHOP TABLES IN MYSQL ---');
  for (const t of tables) {
    const [res] = await conn.query(`SELECT COUNT(*) as count FROM ${t}`);
    console.log(`Table: ${t.padEnd(36)} -> ${res[0].count} rows`);
  }

  await conn.end();
  console.log('\n[MySQL] Done! All tables are up and verified in database.');
}

main().catch((err) => {
  console.error('[MySQL Error]:', err);
  process.exit(1);
});
