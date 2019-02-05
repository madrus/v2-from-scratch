// src/layouts/index.jsx
import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import { css, Global } from '@emotion/core'
import { NavBar } from 'components'
import theme from '../../config/theme'
import 'typeface-open-sans'
import 'typeface-candal'

const globalStyles = css`
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Global styles={globalStyles} />
    <NavBar theme={theme} />
    {children}
  </ThemeProvider>
)

export default Layout
