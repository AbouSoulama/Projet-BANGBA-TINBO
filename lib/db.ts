import mysql from "mysql2/promise";

export type LeadRecord = {
  locale: string;
  intent: "message" | "meeting";
  lastName: string;
  firstName: string;
  organization: string;
  role: string;
  email: string;
  country: string;
  requestType: string;
  message: string;
};

let pool: mysql.Pool | null = null;
let schemaReady = false;

export function mysqlConfigured() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE);
}

function getPool() {
  if (!mysqlConfigured()) return null;
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT ?? 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      charset: "utf8mb4",
    });
  }
  return pool;
}

async function ensureSchema(db: mysql.Pool) {
  if (schemaReady) return;
  await db.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  schemaReady = true;
}

export async function insertLead(lead: LeadRecord) {
  const db = getPool();
  if (!db) return false;
  await ensureSchema(db);
  await db.execute(
    `INSERT INTO leads
      (locale, intent, last_name, first_name, organization, role_title, email, country, request_type, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead.locale,
      lead.intent,
      lead.lastName,
      lead.firstName,
      lead.organization,
      lead.role,
      lead.email,
      lead.country,
      lead.requestType,
      lead.message,
    ],
  );
  return true;
}
