import mysql from 'mysql2/promise';

/**
 * Lightweight MySQL Table & Telemetry Verification Utility
 * Checks table integrity and row counts across all 13 portfolio tables.
 */
async function main() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'portfolio_db';

  console.log(`[MySQL] Connecting to ${user}@${host}:${port}/${database}...`);

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  console.log('[MySQL] Connected successfully!');

  const tables = [
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
  ];

  console.log('\n--- VERIFICATION OF PORTFOLIO & TIKTOK SHOP TABLES IN MYSQL ---');
  for (const t of tables) {
    try {
      const [res] = await conn.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`Table: ${t.padEnd(36)} -> ${res[0].count} rows`);
    } catch {
      console.log(`Table: ${t.padEnd(36)} -> (Not created yet)`);
    }
  }

  await conn.end();
  console.log('\n[MySQL] Done! All tables checked.');
}

main().catch((err) => {
  console.error('[MySQL Error]:', err.message);
  process.exit(1);
});
