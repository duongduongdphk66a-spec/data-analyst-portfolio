-- ==========================================================
-- Portfolio MySQL Database Schema
-- Author: Data Analyst Portfolio
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `portfolio_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- 1. Table: portfolio_profile
CREATE TABLE IF NOT EXISTS `portfolio_profile` (
  `id` INT NOT NULL DEFAULT 1,
  `name` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(500) DEFAULT '',
  `title` VARCHAR(255) NOT NULL,
  `bio` TEXT,
  `career_goal` TEXT,
  `avatar_url` VARCHAR(1000) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `github` VARCHAR(255) DEFAULT '',
  `linkedin` VARCHAR(255) DEFAULT '',
  `skills_json` LONGTEXT,
  `experiences_json` LONGTEXT,
  `career_goals_json` LONGTEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: portfolio_texts (Custom CMS Texts across all pages)
CREATE TABLE IF NOT EXISTS `portfolio_texts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `text_key` VARCHAR(150) NOT NULL,
  `lang` VARCHAR(10) NOT NULL DEFAULT 'vi',
  `value_text` TEXT NOT NULL,
  `section` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_text_lang` (`text_key`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: portfolio_projects
CREATE TABLE IF NOT EXISTS `portfolio_projects` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `desc_text` TEXT,
  `tags_json` LONGTEXT,
  `img` VARCHAR(1000) DEFAULT '',
  `demo_url` VARCHAR(1000) DEFAULT '',
  `github_url` VARCHAR(1000) DEFAULT '',
  `embed_url` VARCHAR(1000) DEFAULT '',
  `featured` TINYINT(1) DEFAULT 0,
  `problem` TEXT,
  `method` TEXT,
  `insight` TEXT,
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: portfolio_rate_limits (Shared across PM2 cluster instances)
CREATE TABLE IF NOT EXISTS `portfolio_rate_limits` (
  `ip` VARCHAR(64) PRIMARY KEY,
  `failed_attempts` INT NOT NULL DEFAULT 0,
  `locked_until` BIGINT DEFAULT NULL,
  `last_attempt` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: portfolio_cache (Shared API Cache across PM2 cluster instances)
CREATE TABLE IF NOT EXISTS `portfolio_cache` (
  `cache_key` VARCHAR(100) PRIMARY KEY,
  `data_json` LONGTEXT NOT NULL,
  `expires_at` BIGINT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- TIKTOK SHOP (KAMI ELY) DATA TABLES
-- ==========================================================

-- 6. Table: tiktok_shop_overview
CREATE TABLE IF NOT EXISTS `tiktok_shop_overview` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `entity_type` ENUM('shop', 'creator') NOT NULL,
  `entity_name` VARCHAR(255) NOT NULL,
  `total_gmv_all_time` VARCHAR(100) DEFAULT '',
  `total_units_all_time` VARCHAR(100) DEFAULT '',
  `active_skus` INT DEFAULT 0,
  `historical_skus` INT DEFAULT 0,
  `national_rank` VARCHAR(50) DEFAULT '',
  `category_rank` VARCHAR(50) DEFAULT '',
  `category_name` VARCHAR(100) DEFAULT '',
  `inclusion_date` VARCHAR(50) DEFAULT '',
  `price_range` VARCHAR(100) DEFAULT '',
  `total_livestreams` VARCHAR(50) DEFAULT '',
  `total_videos` VARCHAR(50) DEFAULT '',
  `total_affiliates` VARCHAR(50) DEFAULT '',
  `rating` VARCHAR(50) DEFAULT '',
  `positive_rate` VARCHAR(50) DEFAULT '',
  `quality_score` INT DEFAULT 0,
  `response_rate_24h` VARCHAR(50) DEFAULT '',
  `ship_within_48h` VARCHAR(50) DEFAULT '',
  `period_180d_units` VARCHAR(50) DEFAULT '',
  `period_180d_gmv` VARCHAR(50) DEFAULT '',
  `metrics_json` LONGTEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: tiktok_shop_weekly_trends
CREATE TABLE IF NOT EXISTS `tiktok_shop_weekly_trends` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `week_index` INT NOT NULL,
  `week_date` VARCHAR(20) NOT NULL,
  `units` INT NOT NULL,
  `gmv_million_vnd` DECIMAL(10,2) NOT NULL,
  `live_count` INT NOT NULL DEFAULT 0,
  `video_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: tiktok_shop_top_skus
CREATE TABLE IF NOT EXISTS `tiktok_shop_top_skus` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku_rank` INT NOT NULL,
  `sku_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT '',
  `units_sold` VARCHAR(50) DEFAULT '',
  `gmv_vnd` VARCHAR(50) DEFAULT '',
  `unit_price` VARCHAR(50) DEFAULT '',
  `sales_share` VARCHAR(50) DEFAULT '',
  `sales_share_percent` DECIMAL(5,2) DEFAULT 0.00,
  `thumbnail_url` VARCHAR(1000) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: tiktok_shop_top_affiliates
CREATE TABLE IF NOT EXISTS `tiktok_shop_top_affiliates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `affiliate_rank` INT NOT NULL,
  `creator_name` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(1000) DEFAULT '',
  `followers` VARCHAR(50) DEFAULT '',
  `gmv_vnd` VARCHAR(50) DEFAULT '',
  `units_sold` VARCHAR(50) DEFAULT '',
  `commission_rate` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: tiktok_shop_livestreams
CREATE TABLE IF NOT EXISTS `tiktok_shop_livestreams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `channel_type` ENUM('shop', 'creator') NOT NULL DEFAULT 'shop',
  `session_date` VARCHAR(50) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `duration` VARCHAR(50) DEFAULT '',
  `gmv_vnd` VARCHAR(50) DEFAULT '',
  `units_sold` VARCHAR(50) DEFAULT '',
  `views` VARCHAR(50) DEFAULT '',
  `peak_viewers` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: tiktok_shop_videos
CREATE TABLE IF NOT EXISTS `tiktok_shop_videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `channel_type` ENUM('shop', 'creator') NOT NULL DEFAULT 'shop',
  `video_date` VARCHAR(50) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `gmv_vnd` VARCHAR(50) DEFAULT '',
  `units_sold` VARCHAR(50) DEFAULT '',
  `views` VARCHAR(50) DEFAULT '',
  `author_name` VARCHAR(255) DEFAULT '',
  `likes` VARCHAR(50) DEFAULT '',
  `comments` VARCHAR(50) DEFAULT '',
  `shares` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: tiktok_shop_data_scopes
CREATE TABLE IF NOT EXISTS `tiktok_shop_data_scopes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `scope_code` VARCHAR(50) NOT NULL UNIQUE,
  `title_vi` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `timeframe` VARCHAR(255) DEFAULT '',
  `data_source` VARCHAR(255) DEFAULT '',
  `row_count` VARCHAR(100) DEFAULT '',
  `variables_tracked` TEXT,
  `methodology` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Table: tiktok_shop_collaborative_stores
CREATE TABLE IF NOT EXISTS `tiktok_shop_collaborative_stores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `store_rank` INT NOT NULL,
  `store_name` VARCHAR(255) NOT NULL,
  `gmv_vnd` VARCHAR(50) DEFAULT '',
  `units_sold` VARCHAR(50) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

