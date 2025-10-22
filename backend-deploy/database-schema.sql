-- JD Reporting Company Database Schema
-- Database: jd_reporting_company
-- Created: October 21, 2025

-- Create database
CREATE DATABASE IF NOT EXISTS jd_reporting_company;
USE jd_reporting_company;

-- Users table (Admin and Transcribers)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','transcriber') NOT NULL DEFAULT 'transcriber',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL UNIQUE,
  `client_name` varchar(100) NOT NULL,
  `client_email` varchar(100) NOT NULL,
  `client_phone` varchar(20) DEFAULT NULL,
  `case_number` varchar(100) DEFAULT NULL,
  `court_name` varchar(200) DEFAULT NULL,
  `hearing_date` date DEFAULT NULL,
  `service_type` varchar(50) NOT NULL,
  `turnaround_time` varchar(50) NOT NULL,
  `pages` int(11) DEFAULT NULL,
  `audio_length` varchar(50) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `special_instructions` text,
  `status` enum('pending','assigned','in-progress','review','completed','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `priority` enum('standard','rush','expedited') NOT NULL DEFAULT 'standard',
  `assigned_to` int(11) DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_status` (`status`),
  KEY `idx_assigned_to` (`assigned_to`),
  KEY `idx_client_email` (`client_email`),
  CONSTRAINT `fk_orders_users` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Status History table (optional - for tracking changes)
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_changed_by` (`changed_by`),
  CONSTRAINT `fk_history_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_users` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin.1.pass)
INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`, `full_name`, `role`, `status`, `phone`) 
VALUES ('admin', 'admin@jdreporting.com', 'admin.1.pass', 'Admin', 'User', 'Admin User', 'admin', 'active', NULL)
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Insert sample transcribers (optional)
INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`, `full_name`, `role`, `status`, `phone`) 
VALUES 
('transcriber1', 'trans1@jdreporting.com', 'trans.1.pass', 'John', 'Transcriber', 'John Transcriber', 'transcriber', 'active', NULL),
('john_trans', 'john@jdtranscripts.com', 'trans.2.pass', 'John', 'Doe', 'John Doe', 'transcriber', 'active', NULL),
('jane_trans', 'jane@jdtranscripts.com', 'trans.3.pass', 'Jane', 'Smith', 'Jane Smith', 'transcriber', 'active', NULL),
('mike_trans', 'mike@jdtranscripts.com', 'trans.4.pass', 'Mike', 'Johnson', 'Mike Johnson', 'transcriber', 'active', NULL)
ON DUPLICATE KEY UPDATE `username`=`username`;
