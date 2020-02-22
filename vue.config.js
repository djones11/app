module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss_helpers/variables.scss";'
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.hotReload = false;
        return options;
      });
  },
  configureWebpack: {
    devtool: "source-map",
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    devServer: {
      disableHostCheck: true
    }
  },
  transpileDependencies: [],
  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: undefined,
  parallel: undefined
};
