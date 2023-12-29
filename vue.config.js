const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = defineConfig({
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
          return false;
        },
      },
    },
  },
  transpileDependencies: true,
  lintOnSave: false,
  chainWebpack(config) {
    config.plugin("monaco").use(new MonacoWebpackPlugin());
  },
});
