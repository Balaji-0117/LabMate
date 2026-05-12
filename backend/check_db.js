require('dotenv').config();
const pool = require('./config/db');

async function checkDb() {
  const result = await pool.query('SELECT * FROM experiments');
  console.log('Experiments:', result.rows);
  process.exit();
}
checkDb();
