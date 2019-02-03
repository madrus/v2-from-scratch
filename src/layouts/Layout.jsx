// src/layouts/index.jsx
import React from 'react'
import { graphql, StaticQuery, Link } from 'gatsby'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <React.Fragment>
        <Link to={'/'}>
          <h3>{data.site.siteMetadata.title}</h3>
        </Link>
        <Link to={'/about'}>About</Link>
        {children}
      </React.Fragment>
    )}
  />
)

export default Layout
