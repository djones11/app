module.exports = {
  compact: true,
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3
      }
    ],
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
        corejs: 3
      }
    ]
  ]
};
