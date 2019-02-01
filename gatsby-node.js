// gatsby-node.js
const path = require("path");
const _ = require("lodash");

const postTemplate = path.resolve("src/templates/post.jsx");
const tagPage = path.resolve("src/pages/tags.jsx");
const tagPosts = path.resolve("src/templates/tag.jsx");

const createPosts = (createPage, edges) => {
  edges.forEach(({ node }) => {
    const path = node.frontmatter.path;

    createPage({
      path,
      component: postTemplate,
      context: {
        pathSlug: path
      }
    });
  });
};

const createTagPages = (createPage, tags, postsByTag) => {
  createPage({
    path: "/tags",
    component: tagPage,
    context: {
      tags: tags.sort()
    }
  });

  tags.forEach(tagName => {
    const posts = postsByTag[tagName];

    createPage({
      path: `/tags/${tagName}`,
      component: tagPosts,
      context: {
        posts,
        tagName
      }
    });
  });
};

const getUniqueTags = edges => {
  // Tags on pages:
  let tags = [];
  // Iterate through each post, putting all found tags into `tags`
  _.each(edges, edge => {
    if (_.get(edge, "node.frontmatter.tags")) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  // Eliminate duplicate tags
  tags = _.uniq(tags);
  return tags;
};

const getPostsByTag = edges => {
  const postsByTag = {};
  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!postsByTag[tag]) {
          postsByTag[tag] = [];
        }

        postsByTag[tag].concat(node);
      });
    }
  });
  return postsByTag;
};

exports.createPages = ({ graphql, actions }) => {
  graphql(`
    query PagesMeta {
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
      return Promise.reject(errors);
    }
    if (_.isEmpty(data.allMdx)) {
      return Promise.reject("There are no posts!");
    }

    const { createPage } = actions;
    const posts = data.allMdx.edges;
    const postsByTag = getPostsByTag(posts);
    // const tags = Object.keys(postsByTag)
    const tags = getUniqueTags(posts);

    // create pages to show tags and posts per tag
    createTagPages(createPage, tags, postsByTag);
    //create posts
    createPosts(createPage, posts);
  });
};
