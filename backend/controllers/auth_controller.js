const pool = require("../config/db");
const transporter = require("../config/mail");
const { v4: uuidv4 } = require("uuid");

exports.signup = async (req, res) => {
  const { email } = req.body;

  try {
    const token = uuidv4();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
      `INSERT INTO users (email, verification_token, token_expiry)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE 
       SET verification_token=$2, token_expiry=$3`,
      [email, token, expiry]
    );

    const link = `http://127.0.0.1:5500/frontend/html/create_password.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `<p>Click below to set password:</p>
             <a href="${link}">${link}</a>`,
    });

    res.json({ message: "Verification email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};


// Set Password(Verify Token)

const bcrypt = require("bcrypt");

exports.setPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE verification_token=$1 AND token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password=$1, is_verified=true,
           verification_token=NULL, token_expiry=NULL
       WHERE verification_token=$2`,
      [hashedPassword, token]
    );

    res.json({ message: "Password set successfully" });

  } catch (err) {
    res.status(500).json({ error: "Error setting password" });
  }
};

// Login Task

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(400).json({ error: "Email not verified" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};