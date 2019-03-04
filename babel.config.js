const modules = process.env.BABEL_ENV === 'cjs' || process.env.NODE_ENV === 'test' ? 'commonjs' : false

const presets = [
  [
    "@babel/preset-env",
    {
      debug: process.env.NODE_ENV !== "production",
      loose: true,
      modules
    }
  ],
  "@babel/preset-react",
  "@babel/preset-flow"
];

module.exports = {
  presets
};
