import path from "node:path";
import url from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { DeleteDirectoryPlugin } from "./delete-directory-plugin.mjs";
import { HtmlPlugin } from "./html-plugin.mjs";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.dirname(path.dirname(dirname));

export default defineConfig({
  experiments: {
    css: true,
    outputModule: true,
  },
  entry: {
    index: "./src/gui/index.tsx",
    worker: "./src/worker/main.ts",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(root, "dist"),
    module: true,
    chunkFormat: "module",
    chunkLoading: "import",
    workerChunkLoading: "import",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
    },
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                },
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.css$/i,
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new DeleteDirectoryPlugin({
      directory: path.join(root, "dist"),
    }),
    new HtmlPlugin({
      minify: false,
      filename: "index.html",
      template: "src/gui/index.html",
      inject: "head",
      baseHref: process.env.BASE_HREF,
    }),
    new rspack.CssExtractRspackPlugin({}),
  ],
  devServer: {
    hot: false,
    port: 8080,
    historyApiFallback: true,
    allowedHosts: "all",
    host: "0.0.0.0",
    headers: [
      {
        key: "Cache-Control",
        value: "no-store",
      },
    ],
  },
});
