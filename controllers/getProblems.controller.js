import { pool } from "../config/db.js";

export async function getSolvedProblems(req, res) {
  const { username } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT
        p.title,
        p.title_slug,
        p.difficulty,
        p.tags,
        up.first_solved_at,
        up.last_solved_at,
        up.submissions
      FROM users u
      JOIN user_problems up ON u.id = up.user_id
      JOIN problems p ON p.id = up.problem_id
      WHERE u.leetcode_username = $1
      ORDER BY up.last_solved_at DESC;
      `,
      [username]
    );

    res.json({
      username,
      solvedCount: rows.length,
      problems: rows
    });
  } catch (err) {
    console.error("Error fetching solved problems:", err);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
}
