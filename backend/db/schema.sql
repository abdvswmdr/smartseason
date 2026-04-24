CREATE DATABASE IF NOT EXISTS `smartseason-db`;

USE `smartseason-db`;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM ('admin', 'agent') NOT NULL DEFAULT 'agent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  crop_type VARCHAR(100) NOT NULL,
  planting_date DATE NOT NULL,
  stage ENUM ('Planted', 'Growing', 'Ready', 'Harvested') NOT NULL DEFAULT 'Planted',
  assigned_to INT REFERENCES users (id) ON DELETE SET NULL,
  created_by INT REFERENCES users (id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE field_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  field_id INT NOT NULL REFERENCES fields (id) ON DELETE CASCADE,
  agent_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stage ENUM ('Planted', 'Growing', 'Ready', 'Harvested') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
