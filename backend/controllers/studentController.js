const pool = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id; // from verifyToken

    // Get user details
    const userRes = await pool.query('SELECT username, email, roll_number FROM users WHERE user_id = $1', [userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" });
    const user = userRes.rows[0];

    // Get completed experiments count
    const completedRes = await pool.query('SELECT COUNT(*) FROM student_records WHERE student_id = $1', [userId]);
    const completedCount = parseInt(completedRes.rows[0].count);

    // Get announcements (last 5)
    const announcementsRes = await pool.query(
      `SELECT * FROM announcements WHERE target_role IN ('student', 'all') ORDER BY created_at DESC LIMIT 5`
    );

    res.json({
      username: user.username,
      email: user.email,
      rollno: user.roll_number,
      completedExperiments: completedCount,
      announcements: announcementsRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getExperiments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiments WHERE is_active = TRUE');
    // Group by lab_category
    const grouped = result.rows.reduce((acc, exp) => {
      acc[exp.lab_category] = acc[exp.lab_category] || [];
      acc[exp.lab_category].push(exp);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getExperimentDetail = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.completeExperiment = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const expId = req.params.id;
    const observationData = req.body?.observation_data ? JSON.stringify(req.body.observation_data) : null;

    // Check if already completed
    const existing = await pool.query('SELECT * FROM student_records WHERE student_id = $1 AND experiment_id = $2', [studentId, expId]);
    if (existing.rows.length > 0) {
       return res.json({ success: true, recordId: existing.rows[0].id });
    }

    const result = await pool.query(
      `INSERT INTO student_records (student_id, experiment_id, observation_data) VALUES ($1, $2, $3) RETURNING id`,
      [studentId, expId, observationData]
    );
    res.json({ success: true, recordId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const result = await pool.query(
      `SELECT e.lab_category, COUNT(r.id) as completed_count
       FROM student_records r
       JOIN experiments e ON r.experiment_id = e.id
       WHERE r.student_id = $1
       GROUP BY e.lab_category`,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM announcements WHERE target_role IN ('student', 'all') ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.username, u.roll_number, COUNT(r.id) as completed_count
       FROM users u
       LEFT JOIN student_records r ON u.user_id = r.student_id
       WHERE u.role = 'student'
       GROUP BY u.user_id
       ORDER BY completed_count DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const pdfService = require('../services/pdfService');

exports.downloadLabRecordPdf = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const recordId = req.params.recordId;
    
    const result = await pool.query(`
      SELECT r.id, r.completed_at, r.notes, r.observation_data, e.title as experiment_title, e.lab_category, e.aim, e.procedure, u.username, u.roll_number
      FROM student_records r
      JOIN experiments e ON r.experiment_id = e.id
      JOIN users u ON r.student_id = u.user_id
      WHERE r.student_id = $1 AND r.id = $2
    `, [studentId, recordId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const recordData = result.rows[0];
    const pdfBuffer = await pdfService.generateLabRecord(recordData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="LabRecord_${recordData.experiment_title.replace(/\s+/g, '_')}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
