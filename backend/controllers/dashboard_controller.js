const pool = require("../config/db");

exports.getDashboard = async (req, res) => {

    try {

        // user_id comes from JWT middleware
        const userId = req.user.user_id;

        // ─────────────────────────────────────
        // STUDENT PROFILE
        // ─────────────────────────────────────
        const studentResult = await pool.query(
            `
            SELECT 
                username,
                email,
                roll_number,
                branch,
                semester,
                section,
                bio,
                profile_image
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        // ─────────────────────────────────────
        // DASHBOARD STATS
        // ─────────────────────────────────────
        const statsResult = await pool.query(
            `
            SELECT
                COUNT(*) AS total_labs,
                COUNT(*) FILTER (WHERE status = 'completed') AS completed_labs,
                COUNT(*) FILTER (WHERE status = 'pending') AS pending_labs,
                COALESCE(ROUND(AVG(experiment_score)), 0) AS overall_score
            FROM student_experiments
            WHERE user_id = $1
            `,
            [userId]
        );

        // ─────────────────────────────────────
        // LEADERBOARD
        // ─────────────────────────────────────
        const leaderboardResult = await pool.query(
            `
            SELECT
                users.username,

                COALESCE(
                    ROUND(AVG(student_experiments.experiment_score)),
                    0
                ) AS average_score

            FROM users

            JOIN student_experiments
            ON users.user_id = student_experiments.user_id

            GROUP BY users.username

            ORDER BY average_score DESC

            LIMIT 10
            `
        );

        // ─────────────────────────────────────
        // NOTIFICATIONS
        // ─────────────────────────────────────
        const notificationsResult = await pool.query(
            `
            SELECT
                title,
                message,
                is_read,
                created_at

            FROM notifications

            WHERE user_id = $1

            ORDER BY created_at DESC

            LIMIT 10
            `,
            [userId]
        );

        // ─────────────────────────────────────
        // FINAL RESPONSE
        // ─────────────────────────────────────
        res.json({
            student: studentResult.rows[0],
            stats: statsResult.rows[0],
            leaderboard: leaderboardResult.rows,
            notifications: notificationsResult.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Dashboard loading failed"
        });
    }
};