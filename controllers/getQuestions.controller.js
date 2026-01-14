import buildDynamicQuery from "../GQLqueries/getQuestions.js";
import { pool } from "../config/db.js";

async function getUserProblemsFromDB(username) {
  const { rows } = await pool.query(`
    SELECT p.title_slug, up.last_solved_at
    FROM users u
    JOIN user_problems up ON u.id = up.user_id
    JOIN problems p ON p.id = up.problem_id
    WHERE u.leetcode_username = $1
    ORDER BY up.last_solved_at DESC NULLS LAST
  `, [username]);
  
  return rows;
}

async function checkUserExists(username) {
  const { rows } = await pool.query(
    `SELECT id FROM users WHERE leetcode_username = $1`,
    [username]
  );
  return rows.length > 0;
}

export const getQuestions = async (req, res) => {
  try {
    const { username } = req.params;

    const userExists = await checkUserExists(username);
    if (!userExists) {
      return res.status(404).json({ 
        error: `User '${username}' not found in database` 
      });
    }

    const userProblems = await getUserProblemsFromDB(username);

    if (userProblems.length === 0) {
      return res.json({
        count: 0,
        questions: [],
        message: `No problems found for user: ${username}`
      });
    }

    const lastSolvedMap = {};
    userProblems.forEach(row => {
      lastSolvedMap[row.title_slug] = row.last_solved_at;
    });

    const slugs = userProblems.map(row => row.title_slug);
    const query = buildDynamicQuery(slugs);

    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ errors: data.errors });
    }

    // Add last_solved_at to each question
    const questions = Object.values(data.data).map(question => ({
      ...question,
      last_solved_at: lastSolvedMap[question.titleSlug] || null
    }));

    res.json({
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};
