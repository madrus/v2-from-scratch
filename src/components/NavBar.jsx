// src/components/NavBar.jsx
import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import logo from '../static/logo/header-logo.png'

const StyledLink = styled(Link)`
  display: flex;
  font-weight: 700;
  align-items: center;
`

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  font-family: ${props => props.theme.fontFamily.body};
  font-weight: 500;
  font-size: 1.25rem;
  align-items: center;
  a {
    color: ${props => props.theme.colors.black.base};
    margin-left: 2rem;
    transition: all ${props => props.theme.transitions};
    &:hover {
      color: ${props => props.theme.colors.black.lighter};
    }
  }
`

const NavBar = props => {
  console.log(props.theme)
  return (
    <Fragment>
      <StyledLink to="/">
        <img src={logo} alt="Gatsby Logo" />
      </StyledLink>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </Nav>
    </Fragment>
  )
}

export default NavBar
