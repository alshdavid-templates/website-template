import path from "node:path";
import url from "node:url";
import { rspack } from "@rspack/core";
import { defineConfig } from "@rspack/cli";
import { HtmlPlugin } from "./html-plugin.mjs";

const baseHref = process.env.BASE_HREF || "/";
console.log("BUILDING WITH BASE_HREF OF", baseHref);

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.dirname(dirname);
const repoRoot = path.dirname(root);

export default defineConfig({
  experiments: {
    css: true,
    outputModule: true,
  },
  entry: {
    main: path.join(repoRoot, 'src', 'index.tsx')
  },
  output: {
    filename: "[name].js",
    path: path.join(repoRoot, "dist"),
    publicPath: baseHref,
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
      "preact": path.join(repoRoot, 'node_modules', 'preact', 'dist', 'preact.module.js'),
      'preact/hooks': path.join(repoRoot, 'node_modules', 'preact','hooks','dist','hooks.module.js'),
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
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
                decorators: true,
              },
              transform: {
                react: {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                },
                decoratorVersion: "2022-03",
                decoratorMetadata: true,
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
    new HtmlPlugin({
      minify: false,
      filename: "index.html",
      template: "src/index.html",
      inject: "head",
      baseHref: process.env.BASE_HREF,
    }),
    new rspack.CssExtractRspackPlugin({}),
  ],
  devServer: {
    hot: false,
    port: 4200,
    historyApiFallback: true,
    allowedHosts: "all",
    host: "0.0.0.0",
    headers: [
      {
        key: "Cache-Control",
        value: "no-store",
      },
    ],
    devMiddleware: {
      writeToDisk: true,
    },
  },
});