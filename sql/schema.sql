-- Importer ce fichier dans phpMyAdmin (onglet SQL / Importer)
-- sur l’hébergement Hostinger, après création de la base MySQL.

CREATE TABLE IF NOT EXISTS leads (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  locale VARCHAR(5) NOT NULL,
  intent ENUM('message', 'meeting') NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  organization VARCHAR(160) NOT NULL,
  role_title VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL,
  country VARCHAR(80) NOT NULL,
  request_type VARCHAR(80) NOT NULL,
  message TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_leads_created_at (created_at),
  KEY idx_leads_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
