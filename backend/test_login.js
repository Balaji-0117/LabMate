const pool = require('./config/db');

async function testQuery() {
  const res = await pool.query("SELECT * FROM users WHERE email='24p31a42j9@acet.ac.in'");
  console.log(res.rows[0]);
  process.exit();
}

testQuery();
