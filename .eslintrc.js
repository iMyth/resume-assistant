// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    weex: false,
    WXEnvironment: false,
    Vue: false,
    Application: false
  },
  env: {
    browser: true
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  extends: 'standard',
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
