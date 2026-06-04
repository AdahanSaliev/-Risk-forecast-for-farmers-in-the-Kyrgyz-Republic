import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database', 'agrorisk.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize database if it's new
const initDb = () => {
  const schemaPath = path.resolve(process.cwd(), 'database', 'schema.sql');
  const seedPath = path.resolve(process.cwd(), 'database', 'seed.sql');

  const checkTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='regions'").get();
  
  if (!checkTable) {
    console.log('Initializing database schema...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);

    console.log('Seeding initial data...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
    console.log('Database initialized successfully.');
  } else {
    console.log('Database already initialized.');
  }
};

initDb();

export default db;
