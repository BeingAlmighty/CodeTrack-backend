export const solutionQuery = `
  query OfficialSolution($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      titleSlug
      difficulty

      solution {
        id
        title
        content
        contentTypeId
        paidOnly
        hasVideoSolution
        paidOnlyVideo
        canSeeDetail

        rating {
          count
          average
        }

        topic {
          id
          viewCount
          commentCount

          solutionTags {
            name
            slug
          }

          post {
            id
            creationDate
            author {
              username
              profile {
                userAvatar
              }
            }
          }
        }
      }
    }
  }
`;
