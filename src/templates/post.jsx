// src/templates/post.jsx
import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { Layout } from 'layouts'
import { TagsBlock } from 'components'

function PostTemplate({ data: { mdx }, pageContext }) {
  const fmr = mdx.frontmatter
  const title = fmr.title
  const date = fmr.date
  const tags = fmr.tags
  const cover = fmr.cover.childImageSharp.fluid
  const html = mdx.code.body
  const { prev, next } = pageContext

  return (
    <Layout>
      <Img fluid={cover} />
      <h1>{title}</h1>
      <p>{date}</p>
      <TagsBlock list={tags || []} />
      <MDXRenderer>{html}</MDXRenderer>
      {/* <div dangerouslySetInnerHTML={{ __html: html }} /> */}
      <div>{next && <Link to={next.frontmatter.path}>Next Post</Link>}</div>
      <div>{prev && <Link to={prev.frontmatter.path}>Previous Post</Link>}</div>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        date
        title
        tags
        cover {
          childImageSharp {
            fluid(
              maxWidth: 1920
              quality: 90
              duotone: { highlight: "#386eee", shadow: "#2323be", opacity: 40 }
            ) {
              ...GatsbyImageSharpFluid_withWebp
            }
            resize(width: 1200, quality: 90) {
              src
            }
          }
        }
      }
      code {
        body
      }
    }
  }
`

export default PostTemplate
