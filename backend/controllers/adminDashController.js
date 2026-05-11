const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const students = await pool.query("SELECT COUNT(*) FROM users WHERE role='student'");
    const faculty = await pool.query("SELECT COUNT(*) FROM users WHERE role='faculty'");
    const experiments = await pool.query("SELECT COUNT(*) FROM experiments");
    const completions = await pool.query("SELECT COUNT(*) FROM student_records");

    res.json({
      totalStudents: parseInt(students.rows[0].count),
      totalFaculty: parseInt(faculty.rows[0].count),
      totalExperiments: parseInt(experiments.rows[0].count),
      totalCompletions: parseInt(completions.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, username, email, role, roll_number FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createExperiment = async (req, res) => {
  const { lab_category, title, description, aim, procedure } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO experiments (lab_category, title, description, aim, procedure, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [lab_category, title, description, aim, procedure, req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateExperiment = async (req, res) => {
  const { lab_category, title, description, aim, procedure, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE experiments SET lab_category=$1, title=$2, description=$3, aim=$4, procedure=$5, is_active=$6 WHERE id=$7 RETURNING *`,
      [lab_category, title, description, aim, procedure, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteExperiment = async (req, res) => {
  try {
    await pool.query('UPDATE experiments SET is_active = FALSE WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createAnnouncement = async (req, res) => {
  const { title, message, target_role } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, message, target_role, created_by) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, message, target_role || 'all', req.user.user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.completed_at, u.username, u.roll_number, e.title as experiment_title, e.lab_category
       FROM student_records r
       JOIN users u ON r.student_id = u.user_id
       JOIN experiments e ON r.experiment_id = e.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
