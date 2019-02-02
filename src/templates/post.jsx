// src/templates/post.jsx
import React from 'react'
import { graphql } from 'gatsby'
import { Layout } from 'layouts'
import { TagsBlock } from 'components'

const Post = props => {
  console.log(props)
  const post = props.data.mdx
  const title = post.frontmatter.title
  const date = post.frontmatter.date
  const html = post.html

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <TagsBlock list={post.frontmatter.tags || []} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}
export const query = graphql`
  query($pathSlug: String!) {
    mdx(frontmatter: { path: { eq: $pathSlug } }) {
      frontmatter {
        date
        title
        tags
      }
      html
    }
  }
`

export default Post
