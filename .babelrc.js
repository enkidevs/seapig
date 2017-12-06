const modules = process.env.BABEL_ENV === 'cjs' || process.env.NODE_ENV === 'test' ? 'commonjs' : false

module.exports = {
  presets: [
    "react",
    ["es2015", { modules, loose: true }],
    "flow"
  ]
}
