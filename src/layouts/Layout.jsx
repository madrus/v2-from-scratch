// src/layouts/index.jsx
import React from 'react'
import { graphql, StaticQuery, Link } from 'gatsby'
import logo from 'static/logo/gatsby.png'

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
        <img src={logo} alt="Gatsby Logo" />
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
