import query from "../GQLqueries/recentSubmissions.js";

export const getRecentSubmissions = async (req , res) =>{
  const { username } = req.params;
  const limit = Number(req.query.limit) || 10;

  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          limit
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ errors: data.errors });
    }

    res.json(data.data.recentSubmissionList);
  } 
  catch (error) {
    console.error("Error fetching recent submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};