function buildDynamicQuery(slugs) {
  const fields = `
    questionId
    questionFrontendId
    title
    titleSlug
    content
    difficulty
    stats
  `;

  const aliasBlocks = slugs
    .map((slug, i) => {
      const alias = `q${i}`;
      return `
        ${alias}: question(titleSlug: "${slug}") {
          ${fields}
        }
      `;
    })
    .join("\n");

  return `
    query {
      ${aliasBlocks}
    }
  `;
}

export default buildDynamicQuery;
