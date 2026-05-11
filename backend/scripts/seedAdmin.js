const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    const email = '24p31a42j9@acet.ac.in';
    const teamResult = await pool.query('SELECT * FROM team WHERE email = $1', [email]);
    
    if (teamResult.rows.length > 0) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const insertResult = await pool.query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING
         RETURNING user_id`,
        ['Ashok Marnala', email, hashedPassword, 'admin']
      );

      if (insertResult.rows.length > 0) {
        console.log('Admin user seeded successfully.');
      } else {
        console.log('Admin user already exists.');
      }
    } else {
      console.log('Admin email not found in team table.');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    process.exit();
  }
}

seedAdmin();
