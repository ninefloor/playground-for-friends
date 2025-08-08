import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["tsconfig.json"] })],
  publicDir: "public",
  resolve: {
    alias: {
      "@theme": path.resolve(__dirname, "src/theme.scss"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@theme" as *;`,
      },
    },
  },
});
