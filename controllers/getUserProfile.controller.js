import { getUserProfileQuery } from "../GQLqueries/getUserProfile.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        query: getUserProfileQuery,
        variables: {
          username
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ errors: data.errors });
    }

    const { allQuestionsCount, matchedUser, recentSubmissionList, matchedUserStats } = data.data;

    if (!matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username,
      allQuestionsCount,
      contributions: matchedUser.contributions,
      profile: matchedUser.profile,
      submissionCalendar: matchedUser.submissionCalendar,
      submitStats: matchedUser.submitStats,
      recentSubmissions: recentSubmissionList,
      globalStats: matchedUserStats?.submitStats
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
