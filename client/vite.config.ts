import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === "serve"
      ? {
          name: "express-plugin",
          apply: "serve",
          configureServer(server) {
            try {
              // Make sure server path exists
              const serverModule = require("../server"); 
              if (serverModule && serverModule.createServer) {
                const app = serverModule.createServer();
                server.middlewares.use(app);
              } else {
                console.warn("Server module missing createServer function");
              }
            } catch (error) {
              console.warn("Could not load server for dev:", error);
            }
          },
        }
      : undefined,
  ],
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
