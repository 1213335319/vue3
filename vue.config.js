const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/css/variables.scss";
          @import "@/css/style.scss";
        `,
      },
    },
  },
  devServer: {
    port: 8888,
  },
});
