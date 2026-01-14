export const getCommunitySolutionDetail = `
  query ugcArticleSolutionArticle($articleId: ID, $topicId: ID) {
    ugcArticleSolutionArticle(articleId: $articleId, topicId: $topicId) {
      uuid
      title
      slug
      summary
      content
      createdAt
      updatedAt
      topicId
      author {
        userName
        realName
        userSlug
        userAvatar
      }
      tags {
        name
        slug
        tagType
      }
      prev {
        uuid
        slug
        topicId
        title
      }
      next {
        uuid
        slug
        topicId
        title
      }
    }
  }
`;
