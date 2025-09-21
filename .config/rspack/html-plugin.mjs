import path from "node:path";
import fs from "node:fs";
import prettier from "prettier";
import HtmlWebpackPlugin from "html-webpack-plugin";

export class HtmlPlugin extends HtmlWebpackPlugin {
  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.compilation.tap("ScriptAttributeInjector", (compilation) => {
      return HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "ScriptAttributeInjector",
        (data, cb) => {
          // Add type="module" to script tags
          data.assetTags.scripts = data.assetTags.scripts.map((asset) => {
            asset.attributes.type = "module";
            return asset;
          });

          // Filter out workers
          data.assetTags.scripts = data.assetTags.scripts.filter((asset) => {
            return !asset.attributes.src.includes("worker.");
          });

          // Lazy load css
          // <link rel="stylesheet" href="style" media="print" onload="this.media='all'">
          data.assetTags.styles = data.assetTags.styles.map((asset) => {
            return {
              attributes: {
                rel: "stylesheet",
                href: asset.attributes.href,
                media: "print",
                onload: "this.media = 'all'",
              },
              tagName: "link",
              voidTag: true,
              meta: asset.meta,
            };
          });

          // Generate Import Map
          const stat = compilation.getStats().toJson({
            all: false,
            assets: true,
            cachedAssets: true,
            ids: true,
            publicPath: true,
          });

          const importMap = { imports: {} };
          for (const [entry, assets] of Object.entries(
            stat.assetsByChunkName,
          )) {
            importMap.imports[entry] = `./${assets[0]}`;
          }

          // Rspack shims `import.meta.resolve()` so this is a work around
          data.assetTags.scripts.unshift({
            attributes: {
              type: "module",
            },
            tagName: "script",
            innerHTML:
              "globalThis.importMap = { resolve: (...args) => import.meta.resolve(...args) }",
            voidTag: false,
            meta: {},
          });

          data.assetTags.scripts.unshift({
            attributes: {
              type: "importmap",
            },
            tagName: "script",
            innerHTML: JSON.stringify(importMap),
            voidTag: false,
            meta: {},
          });

          // Base Href
          if (this.options.baseHref) {
            data.assetTags.scripts.unshift({
              tagName: "base",
              attributes: {
                href: this.options.baseHref,
              },
              voidTag: true,
              meta: {},
            });
          }

          return cb(null, data);
        },
      );
    });

    compiler.hooks.afterEmit.tapAsync("HtmlPlugin", async (data, callback) => {
      const asset = path.join(
        compiler.options.output.path,
        this.options.filename,
      );
      const contents = await fs.promises.readFile(asset, "utf8");
      const formatted = await prettier.format(contents, {
        parser: "html",
      });
      await fs.promises.writeFile(asset, formatted, "utf8");
      callback();
    });
  }
}
