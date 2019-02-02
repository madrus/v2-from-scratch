// gatsby-node.js
const path = require('path')
const { each, get, isEmpty, uniq } = require('lodash')

const postTemplate = path.resolve('src/templates/post.jsx')
const tagPage = path.resolve('src/pages/tags.jsx')
const tagPosts = path.resolve('src/templates/tag.jsx')

const createPosts = (createPage, edges) => {
  edges.forEach(({ node }) => {
    const path = node.frontmatter.path

    createPage({
      path,
      component: postTemplate,
      context: {
        pathSlug: path,
      },
    })
  })
}

const createTagPages = (createPage, tags, postsByTag) => {
  createPage({
    path: '/tags',
    component: tagPage,
    context: {
      tags: tags.sort(),
    },
  })

  tags.forEach(tagName => {
    const taggedPosts = postsByTag[tagName]

    createPage({
      path: `/tags/${tagName}`,
      component: tagPosts,
      context: {
        posts: taggedPosts,
        tagName,
      },
    })
  })
}

const getUniqueTags = edges => {
  // Tags on pages:
  let tags = []
  // Iterate through each post, putting all found tags into `tags`
  each(edges, edge => {
    if (get(edge, 'node.frontmatter.tags')) {
      tags = tags.concat(edge.node.frontmatter.tags)
    }
  })
  // Eliminate duplicate tags
  tags = uniq(tags)
  return tags
}

const getPostsByTag = edges => {
  const postsByTag = {}
  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = []
        }

        postsByTag[tag].push(node)
      })
    }
  })
  return postsByTag
}

const { createFilePath } = require('gatsby-source-filesystem')
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}

exports.createPages = ({ graphql, actions }) => {
  return graphql(`
    query {
      allMdx {
        edges {
          node {
            frontmatter {
              path
              title
              tags
            }
          }
        }
      }
    }
  `).then(({ data, errors }) => {
    if (errors) {
      return Promise.reject(errors)
    }
    if (isEmpty(data.allMdx)) {
      return Promise.reject('There are no posts!')
    }

    const { createPage } = actions
    const posts = data.allMdx.edges

    //create posts
    createPosts(createPage, posts)

    const postsByTag = getPostsByTag(posts)
    // const tags = Object.keys(postsByTag)
    const tags = getUniqueTags(posts)
    // create pages to show tags and posts per tag
    createTagPages(createPage, tags, postsByTag)
  })
}
