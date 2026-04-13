import mysql from "mysql2/promise";

let pool;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} belum diisi.`);
  }

  return value;
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: requireEnv("MYSQL_HOST"),
      port: Number(process.env.MYSQL_PORT || 3306),
      user: requireEnv("MYSQL_USER"),
      password: requireEnv("MYSQL_PASSWORD"),
      database: requireEnv("MYSQL_DATABASE"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.MYSQL_SSL === "false" ? undefined : { rejectUnauthorized: false },
    });
  }

  return pool;
}
