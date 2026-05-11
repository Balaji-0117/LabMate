require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const pool = require('./config/db');
const transporter = require('./config/mail');

async function testSignup() {
  const email = '24p31a42j6@acet.ac.in'; // A student in the team table

  try {
    const token = uuidv4();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const teamResult = await pool.query('SELECT * FROM team WHERE email = $1', [email]);
    if (teamResult.rows.length === 0) {
      console.log("Email not found in team records");
      return;
    }

    const defaultUsername = email.split('@')[0];
    const defaultPassword = 'unverified_user';

    console.log("Inserting user...");
    await pool.query(
      `INSERT INTO users (email, username, password, verification_token, token_expiry)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE 
       SET verification_token=$4, token_expiry=$5`,
      [email, defaultUsername, defaultPassword, token, expiry]
    );

    console.log("User inserted. Sending email...");
    const link = `http://127.0.0.1:5500/frontend/html/create_password.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `<p>Click below to set password:</p>
             <a href="${link}">${link}</a>`,
    });

    console.log("Verification email sent");

  } catch (err) {
    console.error("SIGNUP FAILED WITH ERROR:");
    console.error(err);
  } finally {
    process.exit(0);
  }
}

testSignup();
