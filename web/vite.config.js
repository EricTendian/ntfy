/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  build: {
    outDir: "build",
    assetsDir: "static/media",
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    babel({
      filter: /.*/,
      include: [/mui-audio-player-plus/],
      babelConfig: {
        plugins: ['transform-amd-to-commonjs'],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      // see registerSW.js imported by index.jsx
      injectRegister: null,
      strategies: "injectManifest",
      devOptions: {
        enabled: true,
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        globIgnores: ["config.js"],
        manifestTransforms: [
          (entries) => ({
            manifest: entries.map((entry) =>
              // this matches the build step in the Makefile.
              // since ntfy needs the ability to serve another page on /index.html,
              // it's renamed and served from server.go as app.html as well.
              entry.url === "index.html"
                ? {
                    ...entry,
                    url: "app.html",
                  }
                : entry
            ),
          }),
        ],
      },
      // The actual prod manifest is served from the go server, see server.go handleWebManifest.
      manifest: mode === "development" && {
        theme_color: "#317f6f",
        icons: [
          {
            src: "/static/images/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
}));
