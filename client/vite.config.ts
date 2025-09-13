import { defineConfig, Plugin, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [react(), command === "serve" ? expressPlugin() : undefined],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    outDir: "dist/spa",
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // only for dev
    configureServer(server: ViteDevServer) {
      // Import dynamically so production build doesn’t fail
      const { createServer } = require("../server"); // adjust path to actual server file
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
