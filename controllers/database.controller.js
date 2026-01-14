import { pool } from "../config/db.js";

export async function getAllUsers(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT id, leetcode_username, email, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      count: rows.length,
      users: rows
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserSlugs(req, res) {
  const { username } = req.params;

  try {
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE leetcode_username = $1`,
      [username]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        error: `User '${username}' not found in database` 
      });
    }

    const { rows } = await pool.query(`
      SELECT p.title_slug
      FROM users u
      JOIN user_problems up ON u.id = up.user_id
      JOIN problems p ON p.id = up.problem_id
      WHERE u.leetcode_username = $1
      ORDER BY up.last_solved_at DESC NULLS LAST
    `, [username]);

    const slugs = rows.map(row => row.title_slug);

    res.json({
      username,
      count: slugs.length,
      slugs
    });
  } catch (err) {
    console.error("Error fetching user slugs:", err);
    res.status(500).json({ error: "Failed to fetch user slugs" });
  }
}


