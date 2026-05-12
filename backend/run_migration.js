require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, '../database/migrations/003_add_observation_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    await pool.query(sql);
    console.log('Migration 003 completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
