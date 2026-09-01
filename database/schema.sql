-- ==========================================================
-- Portfolio MySQL Database Schema
-- Author: Data Analyst Portfolio
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `pplo` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `pplo`;

-- 1. Table: portfolio_profile
CREATE TABLE IF NOT EXISTS `portfolio_profile` (
  `id` INT NOT NULL DEFAULT 1,
  `name` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
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
  `text_key` VARCHAR(120) NOT NULL,
  `lang` VARCHAR(10) NOT NULL DEFAULT 'vi',
  `value_text` LONGTEXT NOT NULL,
  `section` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`text_key`, `lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: portfolio_projects
CREATE TABLE IF NOT EXISTS `portfolio_projects` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `desc_text` TEXT NOT NULL,
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

-- 4. Table: portfolio_visitor_logs (Optional logging)
CREATE TABLE IF NOT EXISTS `portfolio_visitor_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) DEFAULT '',
  `category` VARCHAR(100) DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
