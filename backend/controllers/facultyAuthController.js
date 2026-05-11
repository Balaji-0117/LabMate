const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1 AND role='faculty'`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Faculty not found" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: 'faculty', username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const teamResult = await pool.query('SELECT * FROM team WHERE email = $1', [email]);
    if (teamResult.rows.length === 0) {
      return res.status(400).json({ error: "Email not found in team records" });
    }

    const teamRecord = teamResult.rows[0];
    if (teamRecord.rollno) {
      return res.status(403).json({ error: "Students cannot register as faculty" });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'faculty')`,
      [username, email, hashedPassword]
    );

    res.json({ message: "Faculty created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};
