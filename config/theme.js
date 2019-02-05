// config/theme.js
const colors = {
  black: {
    base: '#333438',
    light: '#4b4e57',
    lighter: '#696d77',
    blue: '#2e3246',
  },
}
const fontFamily = {
  // eslint-disable-next-line
  body: `Open Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
  // eslint-disable-next-line
  heading: `Candal, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`,
}
const transition = {
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  duration: '0.4s',
}

const theme = {
  colors,
  fontFamily,
  transition,
}

export default theme
