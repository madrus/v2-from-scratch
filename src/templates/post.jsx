// src/templates/post.jsx
import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { Layout } from 'layouts'
import { TagsBlock } from 'components'

function PostTemplate({ data: { mdx } }) {
  console.log(mdx)
  const fmr = mdx.frontmatter
  const title = fmr.title
  const date = fmr.date
  const tags = fmr.tags
  const html = mdx.code.body

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <TagsBlock list={tags || []} />
      <MDXRenderer>{html}</MDXRenderer>
      {/* <div dangerouslySetInnerHTML={{ __html: html }} /> */}
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
