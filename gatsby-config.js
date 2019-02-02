// gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'Gatsby v2 Tutorial Site',
    description: 'Welcome to your brand new Gatsby v2 Website.',
    author: 'Justin',
  },
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
    {
      resolve: `gatsby-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
      },
    },
  ],
}
