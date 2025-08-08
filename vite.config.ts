import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ["tsconfig.json"] })],
  publicDir: "public",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@theme" as *;`,
      },
    },
  },
});
