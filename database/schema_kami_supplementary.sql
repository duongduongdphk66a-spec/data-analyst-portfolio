-- ==========================================================
-- Kami Ely Supplementary Data Tables (Export 2026-10-21)
-- Source Directory: public/kami/*.xlsx (45 files)
-- Cleaned: All URL and image link columns dropped
-- Deduplication: Enforced via PRIMARY KEY and UNIQUE KEY (row_hash)
-- Database: pplo (or portfolio_db)
-- ==========================================================

USE `pplo`;

-- 1. Table: kami_store_daily_overview (Daily Store Telemetry)
CREATE TABLE IF NOT EXISTS `kami_store_daily_overview` (
  `record_date` DATE NOT NULL PRIMARY KEY,
  `sales_units` INT NOT NULL DEFAULT 0,
  `delta_sales_units` INT NOT NULL DEFAULT 0,
  `gmv_vnd` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `delta_gmv_vnd` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `influencers_count` INT NOT NULL DEFAULT 0,
  `delta_influencers_count` INT NOT NULL DEFAULT 0,
  `videos_count` INT NOT NULL DEFAULT 0,
  `delta_videos_count` INT NOT NULL DEFAULT 0,
  `livestreams_count` INT NOT NULL DEFAULT 0,
  `delta_livestreams_count` INT NOT NULL DEFAULT 0,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: kami_livestream_products (Products in Livestreams)
CREATE TABLE IF NOT EXISTS `kami_livestream_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(500) NOT NULL,
  `price_raw` VARCHAR(100) DEFAULT '',
  `region` VARCHAR(50) DEFAULT '',
  `category` VARCHAR(255) DEFAULT '',
  `shop_name` VARCHAR(255) DEFAULT '',
  `shop_total_units_sold` INT DEFAULT 0,
  `live_units_sold` INT DEFAULT 0,
  `live_revenue_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `commission_rate` VARCHAR(50) DEFAULT '',
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_name` (`product_name`(255)),
  INDEX `idx_shop_name` (`shop_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: kami_creator_livestreams (Main Creator Livestream Sessions)
CREATE TABLE IF NOT EXISTS `kami_creator_livestreams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `start_time` VARCHAR(50) NOT NULL,
  `duration_hours` DECIMAL(10,4) DEFAULT 0.0000,
  `main_category` VARCHAR(255) DEFAULT '',
  `total_viewers` INT DEFAULT 0,
  `product_count` INT DEFAULT 0,
  `products_sold_count` INT DEFAULT 0,
  `sales_units` INT DEFAULT 0,
  `gmv_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `uv_value` DECIMAL(12,2) DEFAULT 0.00,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_session_start` (`start_time`),
  INDEX `idx_title` (`title`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: kami_creator_products (Main Creator Goods for Sale - Multi-Snapshot Partitioning)
CREATE TABLE IF NOT EXISTS `kami_creator_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(500) NOT NULL,
  `shop_name` VARCHAR(255) DEFAULT '',
  `snapshot_period` VARCHAR(50) NOT NULL,
  `snapshot_date` DATE NOT NULL,
  `region` VARCHAR(100) DEFAULT '',
  `category` VARCHAR(255) DEFAULT '',
  `price_raw` VARCHAR(100) DEFAULT '',
  `units_sold_raw` VARCHAR(50) DEFAULT '',
  `revenue_raw` VARCHAR(100) DEFAULT '',
  `upload_time` VARCHAR(50) DEFAULT '',
  `commission_rate` VARCHAR(50) DEFAULT '',
  `shop_total_sales_raw` VARCHAR(100) DEFAULT '',
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_name` (`product_name`(255)),
  INDEX `idx_shop_name` (`shop_name`),
  INDEX `idx_snapshot_period` (`snapshot_period`),
  UNIQUE KEY `uk_prod_shop_period` (`product_name`(255), `shop_name`, `snapshot_period`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: kami_creator_videos (Main Creator Short Videos)
CREATE TABLE IF NOT EXISTS `kami_creator_videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` TEXT,
  `publish_time` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) DEFAULT '',
  `video_type` VARCHAR(100) DEFAULT '',
  `sales_units` INT DEFAULT 0,
  `gmv_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `views` BIGINT DEFAULT 0,
  `likes` INT DEFAULT 0,
  `interaction_rate` VARCHAR(50) DEFAULT '',
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: kami_affiliate_videos (Shoppable Videos LKTT Network)
CREATE TABLE IF NOT EXISTS `kami_affiliate_videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` TEXT,
  `duration` VARCHAR(50) DEFAULT '',
  `is_ads_eligible` VARCHAR(50) DEFAULT '',
  `koc_name` VARCHAR(255) DEFAULT '',
  `koc_id` VARCHAR(100) NOT NULL,
  `fans_count` BIGINT DEFAULT 0,
  `region` VARCHAR(50) DEFAULT '',
  `category` VARCHAR(255) DEFAULT '',
  `publish_time` VARCHAR(50) NOT NULL,
  `views` VARCHAR(50) DEFAULT '0',
  `recent_likes` VARCHAR(50) DEFAULT '0',
  `recent_store_sales_units` INT DEFAULT 0,
  `recent_store_gmv_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `store_product_count` INT DEFAULT 0,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_koc_id` (`koc_id`),
  INDEX `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: kami_shop_products (Store Catalog & 90-Day Telemetry)
CREATE TABLE IF NOT EXISTS `kami_shop_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_title` VARCHAR(500) NOT NULL,
  `region` VARCHAR(50) DEFAULT '',
  `price_raw` VARCHAR(100) DEFAULT '',
  `category` VARCHAR(255) DEFAULT '',
  `launch_time` VARCHAR(50) NOT NULL,
  `commission_rate` VARCHAR(50) DEFAULT '',
  `recent_sales_units` INT DEFAULT 0,
  `recent_revenue_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_title_launch` (`product_title`(255), `launch_time`),
  INDEX `idx_launch_time` (`launch_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: kami_affiliate_kol (Affiliate Creators Network)
CREATE TABLE IF NOT EXISTS `kami_affiliate_kol` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `koc_name` VARCHAR(255) DEFAULT '',
  `koc_id` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(255) DEFAULT '',
  `region` VARCHAR(50) DEFAULT '',
  `fans_count` BIGINT DEFAULT 0,
  `affiliate_sales_units` INT DEFAULT 0,
  `affiliate_gmv_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `live_gpm` VARCHAR(100) DEFAULT '',
  `video_gpm` VARCHAR(100) DEFAULT '',
  `products_in_store` INT DEFAULT 0,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_koc_id` (`koc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: kami_affiliate_livestreams (Affiliate Livestreams Network)
CREATE TABLE IF NOT EXISTS `kami_affiliate_livestreams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) DEFAULT '',
  `duration_hours` DECIMAL(10,4) DEFAULT 0.0000,
  `live_type` VARCHAR(100) DEFAULT '',
  `main_category` VARCHAR(255) DEFAULT '',
  `koc_name` VARCHAR(255) DEFAULT '',
  `koc_id` VARCHAR(100) NOT NULL,
  `fans_count` BIGINT DEFAULT 0,
  `region` VARCHAR(50) DEFAULT '',
  `koc_category` VARCHAR(255) DEFAULT '',
  `session_time` VARCHAR(50) NOT NULL,
  `total_views` BIGINT DEFAULT 0,
  `store_sales_units` INT DEFAULT 0,
  `store_gmv_vnd` DECIMAL(15,2) DEFAULT 0.00,
  `store_product_count` INT DEFAULT 0,
  `row_hash` CHAR(64) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_koc_session` (`koc_id`, `session_time`),
  INDEX `idx_session_time` (`session_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
