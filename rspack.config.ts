import path from "node:path";
import { defineConfig } from "@rspack/cli";

const prod = true;

export default defineConfig({
  target: "browserslist",
  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(j|t)s$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
            externalHelpers: true,
            transform: {
              react: {
                runtime: "automatic",
                development: !prod,
                refresh: !prod,
              },
            },
          },
        },
      },
      {
        test: /\.(j|t)sx$/,
        loader: "builtin:swc-loader",
        exclude: [/[\\/]node_modules[\\/]/],
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: !prod,
                refresh: !prod,
              },
            },
            externalHelpers: true,
          },
        },
      },
    ],
  },
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, "./tsconfig.json"),
      references: "auto",
    },
    extensions: ["...", ".ts", ".tsx", ".js", ".jsx", ".css"],
  },
});
