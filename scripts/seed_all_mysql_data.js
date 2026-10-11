const mysql = require('mysql2/promise');
const fs = require('fs');

async function seedAll() {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const env = {};
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const k = trimmed.substring(0, idx).trim();
      let v = trimmed.substring(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[k] = v;
    }
  });

  const conn = await mysql.createConnection({
    host: env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(env.MYSQL_PORT || '3306', 10),
    user: env.MYSQL_USER || 'root',
    password: env.MYSQL_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Connected to MySQL server!');
  await conn.query('CREATE DATABASE IF NOT EXISTS `pplo` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await conn.query('USE `pplo`;');

  // 1. Table: tiktok_shop_timeseries (180 days)
  console.log('Creating & seeding tiktok_shop_timeseries...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS tiktok_shop_timeseries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      record_date VARCHAR(20) NOT NULL UNIQUE,
      date_label VARCHAR(10) NOT NULL,
      original_gmv DECIMAL(10,2) NOT NULL,
      trend_gmv DECIMAL(10,2) NOT NULL,
      seasonal_gmv DECIMAL(10,2) NOT NULL,
      residual_gmv DECIMAL(10,2) NOT NULL,
      live_streams INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Read timeSeries data from app/data/kami-ely/stats/timeSeries.ts
  const tsContent = fs.readFileSync('app/data/kami-ely/stats/timeSeries.ts', 'utf-8');
  const match = tsContent.match(/export const timeSeries = (\{[\s\S]*?\});/);
  if (match) {
    const tsObj = JSON.parse(match[1]);
    console.log(`Found ${tsObj.data.length} daily time series records.`);
    for (const item of tsObj.data) {
      await conn.query(`
        INSERT INTO tiktok_shop_timeseries (record_date, date_label, original_gmv, trend_gmv, seasonal_gmv, residual_gmv, live_streams)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          original_gmv = VALUES(original_gmv),
          trend_gmv = VALUES(trend_gmv),
          seasonal_gmv = VALUES(seasonal_gmv),
          residual_gmv = VALUES(residual_gmv),
          live_streams = VALUES(live_streams);
      `, [item.date, item.dateLabel, item.original, item.trend, item.seasonal, item.residual, item.liveStreams || 0]);
    }
  }

  // 2. Table: heritage_japan_tourists (2003 - 2025)
  console.log('Creating & seeding heritage_japan_tourists...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS heritage_japan_tourists (
      year VARCHAR(10) PRIMARY KEY,
      visitors_million DECIMAL(10,2) NOT NULL,
      counterfactual_million DECIMAL(10,2) NOT NULL,
      is_thesis TINYINT(1) DEFAULT 1,
      policy_event VARCHAR(255) DEFAULT '',
      source VARCHAR(255) DEFAULT 'JNTO'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const touristsData = [
    { year: '2003', value: 5.2, isThesis: true, counterfactual: 5.2 },
    { year: '2004', value: 6.1, isThesis: true, counterfactual: 5.5 },
    { year: '2005', value: 6.7, isThesis: true, counterfactual: 5.8 },
    { year: '2006', value: 7.3, isThesis: true, counterfactual: 6.1 },
    { year: '2007', value: 8.3, isThesis: true, counterfactual: 6.4 },
    { year: '2008', value: 8.4, isThesis: true, counterfactual: 6.8 },
    { year: '2009', value: 6.8, isThesis: true, counterfactual: 7.1 },
    { year: '2010', value: 8.6, isThesis: true, counterfactual: 7.5 },
    { year: '2011', value: 6.2, isThesis: true, counterfactual: 7.9 },
    { year: '2012', value: 8.4, isThesis: true, counterfactual: 8.3 },
    { year: '2013', value: 10.4, isThesis: true, counterfactual: 8.8, policyEvent: 'Chương trình hành động 2013' },
    { year: '2014', value: 13.4, isThesis: true, counterfactual: 9.3 },
    { year: '2015', value: 19.7, isThesis: true, counterfactual: 9.8, policyEvent: 'Japan Heritage 2015' },
    { year: '2016', value: 24.0, isThesis: true, counterfactual: 10.3 },
    { year: '2017', value: 28.7, isThesis: true, counterfactual: 10.9 },
    { year: '2018', value: 31.2, isThesis: true, counterfactual: 11.5 },
    { year: '2019', value: 31.9, isThesis: true, counterfactual: 12.1 },
    { year: '2020', value: 4.1, isThesis: true, counterfactual: 12.7 },
    { year: '2021', value: 0.2, isThesis: true, counterfactual: 13.4 },
    { year: '2022', value: 3.4, isThesis: true, counterfactual: 14.1 },
    { year: '2023', value: 25.1, isThesis: false, counterfactual: 14.9, source: 'JNTO (25.07M)' },
    { year: '2024', value: 36.9, isThesis: false, counterfactual: 15.7, source: 'JNTO (36.87M)' },
    { year: '2025', value: 42.7, isThesis: false, counterfactual: 16.5, source: 'JNTO (42.68M)' }
  ];

  for (const item of touristsData) {
    await conn.query(`
      INSERT INTO heritage_japan_tourists (year, visitors_million, counterfactual_million, is_thesis, policy_event, source)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        visitors_million = VALUES(visitors_million),
        counterfactual_million = VALUES(counterfactual_million),
        is_thesis = VALUES(is_thesis),
        policy_event = VALUES(policy_event),
        source = VALUES(source);
    `, [item.year, item.value, item.counterfactual, item.isThesis ? 1 : 0, item.policyEvent || '', item.source || 'JNTO']);
  }

  // 3. Table: heritage_japan_spend (2010 - 2025)
  console.log('Creating & seeding heritage_japan_spend...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS heritage_japan_spend (
      year VARCHAR(10) PRIMARY KEY,
      spend_trillion_jpy DECIMAL(10,2) NOT NULL,
      is_thesis TINYINT(1) DEFAULT 1,
      source VARCHAR(255) DEFAULT 'JTA'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const spendNationalData = [
    { year: '2010', value: 1.15, isThesis: true },
    { year: '2011', value: 0.81, isThesis: true },
    { year: '2012', value: 1.08, isThesis: true },
    { year: '2013', value: 1.41, isThesis: true },
    { year: '2014', value: 2.02, isThesis: true },
    { year: '2015', value: 3.48, isThesis: true },
    { year: '2016', value: 3.75, isThesis: true },
    { year: '2017', value: 4.41, isThesis: true },
    { year: '2018', value: 4.50, isThesis: true },
    { year: '2019', value: 4.81, isThesis: true },
    { year: '2020', value: 0.70, isThesis: true },
    { year: '2021', value: 0.10, isThesis: true },
    { year: '2022', value: 0.75, isThesis: false, source: 'JTA (0.75T)' },
    { year: '2023', value: 5.31, isThesis: false, source: 'JTA (5.31T)' },
    { year: '2024', value: 8.14, isThesis: false, source: 'JTA (8.14T)' },
    { year: '2025', value: 9.46, isThesis: false, source: 'JTA (9.46T)' }
  ];

  for (const item of spendNationalData) {
    await conn.query(`
      INSERT INTO heritage_japan_spend (year, spend_trillion_jpy, is_thesis, source)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        spend_trillion_jpy = VALUES(spend_trillion_jpy),
        is_thesis = VALUES(is_thesis),
        source = VALUES(source);
    `, [item.year, item.value, item.isThesis ? 1 : 0, item.source || 'JTA']);
  }

  // 4. Table: heritage_japan_regional (Kyoto vs Nara)
  console.log('Creating & seeding heritage_japan_regional...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS heritage_japan_regional (
      year VARCHAR(10) PRIMARY KEY,
      kyoto_visitors_thousand DECIMAL(10,2) NOT NULL,
      nara_visitors_thousand DECIMAL(10,2) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const kyotoNaraData = [
    { year: '2009', kyoto: 937.2, nara: 407.0 },
    { year: '2010', kyoto: 783.8, nara: 629.0 },
    { year: '2011', kyoto: 983.9, nara: 174.0 },
    { year: '2012', kyoto: 515.4, nara: 267.0 },
    { year: '2013', kyoto: 844.9, nara: 435.0 },
    { year: '2014', kyoto: 1127.9, nara: 630.0 },
    { year: '2015', kyoto: 1828.6, nara: 975.0 },
    { year: '2016', kyoto: 3158.6, nara: 1576.0 },
    { year: '2017', kyoto: 3184.8, nara: 1990.0 },
    { year: '2018', kyoto: 3527.8, nara: 2651.0 },
    { year: '2019', kyoto: 4503.3, nara: 3318.0 },
    { year: '2020', kyoto: 379.9, nara: 28.9 },
    { year: '2021', kyoto: 448.8, nara: 456.3 },
    { year: '2022', kyoto: 54.4, nara: 663.5 },
    { year: '2023', kyoto: 576.1, nara: 2581.7 },
    { year: '2024', kyoto: 8210.0, nara: 3140.0 },
  ];

  for (const item of kyotoNaraData) {
    await conn.query(`
      INSERT INTO heritage_japan_regional (year, kyoto_visitors_thousand, nara_visitors_thousand)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        kyoto_visitors_thousand = VALUES(kyoto_visitors_thousand),
        nara_visitors_thousand = VALUES(nara_visitors_thousand);
    `, [item.year, item.kyoto, item.nara]);
  }

  // 5. Table: library_bus_latency_benchmarks
  console.log('Creating & seeding library_bus_latency_benchmarks...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS library_bus_latency_benchmarks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint_name VARCHAR(150) NOT NULL UNIQUE,
      without_cache_ms INT NOT NULL,
      with_cache_ms INT NOT NULL,
      reduction_percent VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const benchmarks = [
    { endpoint: 'Chi tiết sách (Book Detail)', withoutCache: 420, withCache: 24, reduction: '94.3%' },
    { endpoint: 'Lộ trình xe GPS (Bus Route)', withoutCache: 510, withCache: 28, reduction: '94.5%' },
    { endpoint: 'Hồ sơ độc giả (User Stats)', withoutCache: 380, withCache: 22, reduction: '94.2%' },
    { endpoint: 'Bảng xếp hạng (Leaderboard)', withoutCache: 680, withCache: 32, reduction: '95.3%' },
    { endpoint: 'Tìm kiếm danh mục (Search)', withoutCache: 340, withCache: 35, reduction: '89.7%' },
  ];

  for (const item of benchmarks) {
    await conn.query(`
      INSERT INTO library_bus_latency_benchmarks (endpoint_name, without_cache_ms, with_cache_ms, reduction_percent)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        without_cache_ms = VALUES(without_cache_ms),
        with_cache_ms = VALUES(with_cache_ms),
        reduction_percent = VALUES(reduction_percent);
    `, [item.endpoint, item.withoutCache, item.withCache, item.reduction]);
  }

  // 6. Table: library_bus_weekly_activity
  console.log('Creating & seeding library_bus_weekly_activity...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS library_bus_weekly_activity (
      day_code VARCHAR(10) PRIMARY KEY,
      day_index INT NOT NULL,
      borrows_count INT NOT NULL,
      returns_count INT NOT NULL,
      active_users INT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const weeklyData = [
    { day: 'T2', dayIndex: 1, borrows: 142, returns: 120, activeUsers: 84 },
    { day: 'T3', dayIndex: 2, borrows: 158, returns: 140, activeUsers: 92 },
    { day: 'T4', dayIndex: 3, borrows: 151, returns: 138, activeUsers: 89 },
    { day: 'T5', dayIndex: 4, borrows: 176, returns: 150, activeUsers: 104 },
    { day: 'T6', dayIndex: 5, borrows: 190, returns: 171, activeUsers: 118 },
    { day: 'T7', dayIndex: 6, borrows: 168, returns: 160, activeUsers: 98 },
    { day: 'CN', dayIndex: 7, borrows: 199, returns: 182, activeUsers: 125 },
  ];

  for (const item of weeklyData) {
    await conn.query(`
      INSERT INTO library_bus_weekly_activity (day_code, day_index, borrows_count, returns_count, active_users)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        day_index = VALUES(day_index),
        borrows_count = VALUES(borrows_count),
        returns_count = VALUES(returns_count),
        active_users = VALUES(active_users);
    `, [item.day, item.dayIndex, item.borrows, item.returns, item.activeUsers]);
  }

  console.log('\n--- VERIFICATION OF PPLO TABLES ---');
  const [tables] = await conn.query('SHOW TABLES');
  for (const t of tables) {
    const name = Object.values(t)[0];
    const [c] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${name}\``);
    console.log(`Table [${name}]: ${c[0].cnt} rows`);
  }

  await conn.end();
  console.log('ALL TABLES SEEDED SUCCESSFULLY INTO MYSQL!');
}

seedAll().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
