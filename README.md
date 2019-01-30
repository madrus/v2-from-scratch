# README

The is a __Gatsby v2__ learning project to build a website like in `../v2` folder from scratch. I will be following this article of the author of the project: [Guide to Building a Gatsby Site From the Ground Up](https://justinformentin.com/guide-to-building-a-gatsby-site)

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
yarn add -D eslint prettier eslint-config-prettier eslint-plugin-prettier pretty-quick
touch .eslintrc
```

#### .eslintrc

```json
{
  "extends": [
    "airbnb",
    "react-app",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
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

Gatsby plugins fall into __three categories__:

- __Transformer__, e.g. `gatsby-transformer-remark`
- __Functional__, e.g. `gatsby-plugin-catch-links`
- __Source__, e.g. `gatsby-source-filesystem`

```bash
yarn add react react-dom gatsby gatsby-source-filesystem gatsby-transformer-remark gatsby-plugin-catch-links
```

[Gatsby project structure](https://www.gatsbyjs.org/docs/gatsby-project-structure/) follows __Convention over Configuration__ phylosophy.

|- src/
    |- layouts/
        |- index.jsx     # main webpage layout
    |- pages/
        |- index.jsx     # home page
        |- about.jsx     # about page

### Routing

Here's a really cool feature of Gatsby. __Routing__ is done using `@reach/router` under the hood. Keeping things simple, all we have to do is import `Link` from Gatsby and use the `Link` component with the desired path.

``` jsx
// layouts/index.jsx
import React from 'react'
import { Link } from 'gatsby'

export default ({ children }) => (
  <div>
    <Link to={'/'}>
      <h3>
        Gatsby Tutorial
      </h3>
    </Link>

    <Link to={'/about'}>
      About
    </Link>
    {children}
  </div>
)
```

### Querying with GraphQL

By using GraphQL, we can query the values in `gatsby-config.js` and use those in our pages instead of hardcoding on every page.

Gatsby v2 has two query options, __page query__ and __StaticQuery__. StaticQuery can be used in any page or component, but variables can't be passed to them, hence the "static" name. Page queries on the other hand, can only be used in pages, but you're allowed to pass query variables to them.

#### Page Query

We can design our query in the GraphQL explorer ( <http://localhost:8000/___graphql> ) and then use it in the page code.

#### Static Query

Let's test out StaticQuery now. Since it can be used on non-page components, we can add it to the Layout. First we need to import StaticQuery and grapqhl, and return the component.

It accepts two props, `query` and `render`. The `query` prop takes a a tagged template literal, which allows embedded expressions. The `render` prop takes a function with data as a single argument. The data is the query results.
