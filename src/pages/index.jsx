// src/pages/index.js
import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../layouts";

export default ({ data }) => {
  const { edges } = data.allMdx;
  return (
    <Layout>
      <h1>Gatsby Tutorial Site Home Page</h1>
      {edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.frontmatter.path}>
            <h3>{node.frontmatter.title} </h3>
          </Link>
          <p>{node.frontmatter.date}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  );
};

export const query = graphql`
  query {
    allMdx(
      sort: { order: DESC, fields: [frontmatter___date] } # filter: { frontmatter: { draft: { eq: false } } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "MM.DD.YYYY")
            path
          }
        }
      }
    }
  }
`;
