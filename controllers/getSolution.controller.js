import { officialSolutionQuery } from "../GQLqueries/getOfficialSolution.js";
import { toGetSolution } from "../GQLqueries/getNormalSolution.js";
import { getCommunitySolutionDetail } from "../GQLqueries/getCommunitySolution.js";

async function fetchArticleContent(slug) {
  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query: getCommunitySolutionDetail,
      variables: { articleId: uuid },
    }),
  });

  const data = await response.json();
  
  console.log("Article detail response for slug:", slug, JSON.stringify(data, null, 2));
  
  if (data.errors) {
    console.error("Article detail GraphQL error:", data.errors);
    return null;
  }

  return data.data?.solutionArticle;
}

async function getCommunitySolutions(titleSlug, count = 3) {

  const list = await fetchGraphQL(toGetSolution, {
    questionSlug: titleSlug,
    skip: 0,
    first: 20,
    orderBy: "HOT",
    tagSlugs: []
  });

  const edges = list.ugcArticleSolutionArticles.edges;

  const communityEdges = edges
    .filter(edge => edge.node.author.userName !== "LeetCode")
    .slice(0, count);

  const fullSolutions = [];

  for (const { node } of communityEdges) {
    const detail = await fetchGraphQL(getCommunitySolutionDetail, {
      articleId: node.uuid
    });

    fullSolutions.push({
      ...node,
      content: detail.ugcArticleSolutionArticle?.content || ""
    });
  }

  return fullSolutions;
}





export const getSolution = async (req, res) => {
  const { titleSlug } = req.params;
  const { language } = req.query;

  try {
    // Try official solution
    const officialRes = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        query: officialSolutionQuery,
        variables: { titleSlug }
      })
    });

    const officialData = await officialRes.json();
    const officialSolution = officialData.data?.question?.solution;

    if (officialSolution && !officialSolution.paidOnly && officialSolution.content) {
      return res.json({
        titleSlug,
        type: "official",
        solution: officialSolution
      });
    }

    // if official solution is paid find community solutions
    const communitySolutions = await getCommunitySolutions(titleSlug, 3);

    if (!communitySolutions.length) {
      return res.status(404).json({
        error: "No community solutions found",
        isPaidOfficialSolution: officialSolution?.paidOnly || false
      });
    }

    res.json({
      titleSlug,
      type: "community",
      isPaidOfficialSolution: officialSolution?.paidOnly || false,
      totalAvailable: communitySolutions.length,
      language: language || "all",
      solutions: communitySolutions
    });

  } catch (error) {
    console.error("Error fetching solution:", error.message);
    res.status(500).json({ error: "Failed to fetch solution", details: error.message });
  }
};

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error("GraphQL Error:", data.errors);
    throw new Error(data.errors[0]?.message || "GraphQL request failed");
  }

  return data.data;
}
