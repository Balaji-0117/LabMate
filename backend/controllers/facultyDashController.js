const pool = require('../config/db');

exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.username, u.email, u.roll_number, COUNT(r.id) as completed_experiments
      FROM users u
      LEFT JOIN student_records r ON u.user_id = r.student_id
      WHERE u.role = 'student'
      GROUP BY u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getExperiments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiments');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.completed_at, e.title as experiment_title, e.lab_category
      FROM student_records r
      JOIN experiments e ON r.experiment_id = e.id
      WHERE r.student_id = $1
      ORDER BY r.completed_at DESC
    `, [req.params.studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, message, target_role, created_by) VALUES ($1, $2, 'student', $3) RETURNING *`,
      [title, message, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.completed_at, u.username, u.roll_number, e.title as experiment_title, e.lab_category
      FROM student_records r
      JOIN users u ON r.student_id = u.user_id
      JOIN experiments e ON r.experiment_id = e.id
    `);
    
    // Group by experiment
    const grouped = result.rows.reduce((acc, row) => {
      acc[row.experiment_title] = acc[row.experiment_title] || [];
      acc[row.experiment_title].push(row);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
