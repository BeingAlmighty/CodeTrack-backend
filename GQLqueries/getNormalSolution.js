export const toGetSolution = `
  query getUgcSolutionArticles(
    $questionSlug: String!,
    $skip: Int,
    $first: Int,
    $orderBy: ArticleOrderByEnum,
    $tagSlugs: [String!]
  ) {
    ugcArticleSolutionArticles(
      questionSlug: $questionSlug
      skip: $skip
      first: $first
      orderBy: $orderBy
      tagSlugs: $tagSlugs
    ) {
      totalNum
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          uuid
          title
          slug
          summary
          createdAt
          updatedAt
          hitCount
          hasVideoArticle
          tags {
            name
            slug
            tagType
          }
          author {
            userName
            realName
            userSlug
            userAvatar
          }
        }
      }
    }
  }
`;

