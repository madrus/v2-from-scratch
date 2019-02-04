// src/templates/post.jsx
import React from 'react'
import { graphql, Link } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { Layout } from 'layouts'
import { TagsBlock } from 'components'

function PostTemplate({ data: { mdx }, pageContext }) {
  const fmr = mdx.frontmatter
  const title = fmr.title
  const date = fmr.date
  const tags = fmr.tags
  const html = mdx.code.body
  const { prev, next } = pageContext

  return (
    <Layout>
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
      }
      code {
        body
      }
    }
  }
`

export default PostTemplate
