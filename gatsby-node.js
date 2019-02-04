// gatsby-node.js
const path = require('path')
const { each, get, uniq } = require('lodash')

const postTemplate = path.resolve('src/templates/post.jsx')
const tagPage = path.resolve('src/pages/tags.jsx')
const tagPosts = path.resolve('src/templates/tag.jsx')

// graphql function returns a promise so we can use this little promise helper to have a nice result/error state
const wrapper = promise =>
  promise
    .then(result => ({ result, error: null }))
    .catch(error => ({ error, result: null }))

const createPosts = (createPage, posts) => {
  posts.forEach((post, index) => {
    const path = post.node.frontmatter.path
    const prev = index === 0 ? null : posts[index - 1].node
    const next = index === posts.length - 1 ? null : posts[index + 1].node

    createPage({
      path,
      component: postTemplate,
      context: {
        id: post.node.id,
        prev,
        next,
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
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const path = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Generated value based on filepath
      value: path,
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

exports.createPages = async ({ graphql, actions }) => {
  const { error, result } = await wrapper(
    graphql(`
      query {
        allMdx(sort: { fields: [frontmatter___date], order: ASC }) {
          edges {
            node {
              id
              frontmatter {
                path
                title
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `)
  )

  if (!error) {
    const { createPage } = actions
    const posts = result.data.allMdx.edges

    //create posts
    createPosts(createPage, posts)

    const postsByTag = getPostsByTag(posts)
    // const tags = Object.keys(postsByTag)
    const tags = getUniqueTags(posts)
    // create pages to show tags and posts per tag
    createTagPages(createPage, tags, postsByTag)

    return
  }

  console.log(error)
}
