module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'Restyle',
    jsNext: true,
    umd: true
  }
}
