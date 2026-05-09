// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { typst } from "astro-typst";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

const typstCustomFontDirs = [
  fileURLToPath(new URL("./src/assets/fonts", import.meta.url)),
  fileURLToPath(new URL("./public/fonts", import.meta.url)),
];

// https://astro.build/config
export default defineConfig({
  site: "https://snowballsh.github.io",
  base: "/",
  output: "static",
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
      contentCache: true,
    },
  },
  integrations: [
    typst({
      options: {
        remPx: 14,
      },
      fontArgs: [
        {
          // Put custom font files (e.g. Kaiti SC .ttf/.otf/.ttc) in these folders.
          fontPaths: typstCustomFontDirs,
        },
      ],
      target: (id) => {
        if (/[\\/]src[\\/]content[\\/]blogs[\\/]/.test(id)) {
          if (id.endsWith(".html.typ") || /[\\/]html[\\/]/.test(id)) {
            return "html";
          }
          return "svg";
        }
        return "svg";
      },
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@myriaddreamin/typst-ts-node-compiler"],
    },
  },
});
