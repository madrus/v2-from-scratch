// src/pages/index.js
import React from 'react'
import { graphql, Link } from 'gatsby'
import { Layout } from 'layouts'

export default ({ data }) => {
  const { edges } = data.allMdx
  return (
    <Layout>
      <h1>Gatsby v2 Tutorial Site Home Page</h1>
      {edges &&
        edges.map(({ node }) => (
          <div key={node.id}>
            <Link to={node.frontmatter.path}>
              <h3>{node.frontmatter.title} </h3>
            </Link>
            <p>{node.frontmatter.date}</p>
            <p>{node.excerpt}</p>
          </div>
        ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC } # filter: { frontmatter: { draft: { eq: false } } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "MM.DD.YYYY")
            path
            cover {
              childImageSharp {
                fluid(
                  maxWidth: 1000
                  quality: 90
                  traceSVG: { color: "#2B2B2F" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
