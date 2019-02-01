// src/templates/post.jsx
import React from "react";
import { graphql } from "gatsby";
import Layout from "../layouts";

const Post = ({ data }) => {
  const post = data.mdx;
  const title = post.frontmatter.title;
  const date = post.frontmatter.date;
  const html = post.html;

  return (
    <Layout>
      <h1>{title}</h1>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
};
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
`;

export default Post;
