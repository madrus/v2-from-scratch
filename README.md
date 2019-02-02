# README

The is a **Gatsby v2** learning project to build a website like in `../v2` folder from scratch. I will be following this article of the author of the project: [Guide to Building a Gatsby Site From the Ground Up](https://justinformentin.com/guide-to-building-a-gatsby-site)

This is what the author says in the beginning of his tutorial:

> Gatsby is _technically_ a Static Site Generator (SSG) which allows you to build incredibly fast websites using React. I say technically because you aren't truly limited to static, client side rendered (CSR) sites. Gatsby is more of a hybrid, allowing you to use dynamic content, connect to a Content Management System (CMS), utilize server side rendering (SSR) and more. In this guide, we're going to focus on just the static site part. Also, Gatsby uses GraphQL which will be covered in this guide.
>
> If you follow along you'll be able to go from an empty folder to a fully functioning Gatsby site, while understanding how it all works under the hood.

Hereunder follow my personal notes I have made along the way.

## Setting up

Just in case, here is the final repository we will be building: [gatsby-v2-tutorial-starter](https://github.com/justinformentin/gatsby-v2-tutorial-starter).

### Prepare Linting

Prepare linting as usual:

```bash
yarn init
yarn add -D eslint prettier eslint-config-prettier eslint-plugin-prettier pretty-quick husky
touch .eslintrc
```

`husky` plugin ensures that pretty-quick can use Git hooks to do linting before the commit.

#### .eslintrc

```json
{
  "extends": ["airbnb", "react-app", "plugin:prettier/recommended"],
  "rules": {
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100
      }
    ]
  }
}
```

#### package.json

```json
{
  ...
  "scripts": {
    ...
    "precommit": "pretty-quick --staged"
  },
  ...
}
```

### Prepare Dev Environment

Gatsby plugins fall into **three categories**:

- **Transformer**, e.g. `gatsby-transformer-remark`
- **Functional**, e.g. `gatsby-plugin-catch-links`
- **Source**, e.g. `gatsby-source-filesystem`

```bash
yarn add react react-dom gatsby gatsby-source-filesystem gatsby-transformer-remark gatsby-plugin-catch-links
```

[Gatsby project structure](https://www.gatsbyjs.org/docs/gatsby-project-structure/) follows **Convention over Configuration** phylosophy.

|- src/
|- layouts/
|- index.jsx # main webpage layout
|- pages/
|- index.jsx # home page
|- about.jsx # about page

### Routing

Here's a really cool feature of Gatsby. **Routing** is done using `@reach/router` under the hood. Keeping things simple, all we have to do is import `Link` from Gatsby and use the `Link` component with the desired path.

```jsx
// layouts/index.jsx
import React from 'react'
import { Link } from 'gatsby'

export default ({ children }) => (
  <div>
    <Link to={'/'}>
      <h3>Gatsby Tutorial</h3>
    </Link>

    <Link to={'/about'}>About</Link>
    {children}
  </div>
)
```

### Querying with GraphQL

By using GraphQL, we can query the values in `gatsby-config.js` and use those in our pages instead of hardcoding on every page.

Gatsby v2 has two query options, **page query** and **StaticQuery**. StaticQuery can be used in any page or component, but variables can't be passed to them, hence the "static" name. Page queries on the other hand, can only be used in pages, but you're allowed to pass query variables to them.

#### Page Query

We can design our query in the GraphQL explorer ( <http://localhost:8000/___graphql> ) and then use it in the page code.

#### Static Query

Let's test out StaticQuery now. Since it can be used on non-page components, we can add it to the Layout. First we need to import StaticQuery and grapqhl, and return the component.

It accepts two props, `query` and `render`. The `query` prop takes a [tagged template literal], which allows embedded expressions. The `render` prop takes a function with data as a single argument. The data is the query results.

### Posts

Now we're going to go a little further in utilizing `GraphQL` and make some posts. We can keep our markdown files in a separate directory outside of `/src`. It makes it easier to look at and find files, especially when we start adding photos. Let's `mkdir content/posts` and then create a different folder for individual posts. With those made, make an index.md in each folder. Inside each `index.md` file, we'll create our post. The important part to take note of is the set of three dashes. That is the **frontmatter**, and the contents of the block will be the data that we can pass into our pages and templates later on.

Now, we add and configure the installed plugins in our `gatsby-config.js`:

```js
plugins: [
  'gatsby-plugin-catch-links',
  'gatsby-transformer-remark',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'posts',
      path: `${__dirname}/content/posts/`,
    },
  },
]
```

If we now restart the application, we will notice that our GraphQL explorer got a couple of new entries, **allMarkdownRemark** and **markdownRemark**.

We can now write the following query:

```json
{
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          path
          date
          tags
        }
      }
    }
  }
}
```

### MD vs MDX

By default, our posts files should have the `.md` extension. If we put `.mdx`, it won't work. It is however, possible to include `.mdx` files as well.

For that we need to install three new plugins:

```bash
yarn add gatsby-mdx @mdx-js/mdx @mdx-js/tag
```

and add a new plugin to the `gatsby-config.js`:

```js
plugins: [
  ...{
    resolve: `gatsby-mdx`,
    options: {
      extensions: ['.mdx', '.md'],
    },
  },
]
```

When we restart the application, we will notice in the GraphQL explorer that `allMarkdownRemark` is replaced with **allMdx**, and `markdownRemark` with **mdx**.

### List of all Posts

```js
// src/pages/index.js
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'

export default ({ data }) => {
  const { edges } = data.allMdx
  return (
    <Layout>
      <h1>Gatsby Tutorial Site Home Page</h1>
      {edges.map(({ node }) => (
        <div key={node.id}>
          <h3>{node.frontmatter.title} </h3>
          <p>{node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`
```

### Sorting and Filtering

Let's first make sure that the newest post is always on top. Go back to our `GraphiQL` explorer and look at `allMdx`, we'll see that it can take some arguments. Click on `sort`, and we see both `fields` and `order`. Checking order, we see `ASC` and `DESC` for ascending and descending. Clicking on fields we see a whole list of options. It makes sense to sort by `frontmatter___date` so let's add that to our query.

Here is how we can rewrite our query to show latest posts first:

```js
//src/pages/index.js
...
export const query = graphql`
  query {
    allMarkdownRemark (
      filter: { frontmatter: { draft: { eq: false} } }
      sort: {order: DESC, fields: [frontmatter___date]}
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "MM.DD.YYYY")
          }
        }
      }
    }
  }
`
```

### Creating Pages Programmatically

Now we want our list of posts to link to the actual posts. Let's try that by wrapping the title of our posts on the home page with `Link`. Import `Link` from `gastby`, and then add the `frontmatter.path` as the `Link` path:

```js
// src/pages/index.js
...
<Link to={node.frontmatter.path}>
  <h3>{node.frontmatter.title}</h3>
</Link>
...
```

If we try it, we'll see it just brings us to the `404` page. That's because we haven't created the post pages yet. Gatsby will automatically create a page from any `JS` or `JSX` file inside the `/src/pages` directory, but if we want to create pages from each of our `/content/post` markdown files, a few things need to be done first. Create `gatsby-node.js` in the root, create the directory `/src/templates` and then create `post.jsx` in the templates folder.

`gatsby-node.js` is responsible for generation of pages according to the `post.jsx` template:

```js
return new Promise((resolve, reject) => {
  const postTemplate = path.resolve('src/templates/post.jsx')
  resolve(
    graphql(getPagesMeta()).then(result => {
      ...
      const posts = result.data.allMdx.edges

      posts.forEach(({ node }) => {
        const path = node.frontmatter.path
        console.log(path)

        createPage({
          path,
          component: postTemplate,
          context: {
            pathSlug: path,
          },
        })
      })
    })
  )
}
```

## Easy Import

A nice tip of the course author. Add the following code event handler to the `gatsby-node.js` file, and it will be able to resolve imports from the `src` root (similar to the `Webpack` resolve)

```js
/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}
```

Now, we can replace

```js
import TagsBlock from '../components/TagsBlock'
```

with

```js
import { TagsBlock } from 'components'
```

Off course, we need to add `index.jsx` to the `components` folder to export `TagsBlock`!

---

## Errors

### Cannot read property 'push' of undefined

At some point, I started getting this error when running `gatsby develop`. I also noticed that the generated posts pages missed the rendered `html` from the corresponding `.mdx` file.

```none
Error: Cannot read property 'push' of undefined

- defaultMergedResolver.js:15 defaultMergedResolver
  [v2-from-scratch]/[graphql-tools]/dist/stitching/defaultMergedResolver.js:15    :36

- mergeSchemas.js:214 field.resolve
  [v2-from-scratch]/[graphql-tools]/dist/stitching/mergeSchemas.js:214:24

- Array.reduce

- Array.reduce
```

Also, the post page does not show the `html` property value on the screen. `Console.log` shows it has `null` value.

It seems the this command (in `gatsby-node.js`) causes the error:

```js
const tags = Object.keys(postsByTag)
```

Somehow, creating an array of `Object.keys` fails. Maybe creating `postsByTag` is internally async?

Anyway, I have changed the way `tags` array is generated by using `lodash` and this `getUniqueTags` function:

```js
const getUniqueTags = edges => {
  // Tags on pages:
  let tags = []
  // Iterate through each post, putting all found tags into `tags`
  _.each(edges, edge => {
    if (_.get(edge, 'node.frontmatter.tags')) {
      tags = tags.concat(edge.node.frontmatter.tags)
    }
  })
  // Eliminate duplicate tags
  tags = _.uniq(tags)
  return tags
}
```

Another possible angle is to add a name to the GraphQL query in `post.jsx` (from one of the GraphQL bugs discussions found on Google):

```js
export const query = graphql`
  query PostPage($pathSlug: String!) {
    mdx(frontmatter: { path: { eq: $pathSlug } }) {
      id
      frontmatter {
        date
        title
        tags
      }
      html
    }
  }
`
```

I have found yet another, very strange workaround. In the `/templates/post.jsx` file, replace `html` parameter in the GraphQL query definition with another field, e.g. `rawBody`. Use it also when extracting `html` value:

```js
const html = post.rawBody
```

In my case, the post page will start showing this `rawBody` value. When I replace `rawBody` back with `html`, it would start showing `html` value. And restarting `gatsby develop` produces no errors any more. Very strange!

---
