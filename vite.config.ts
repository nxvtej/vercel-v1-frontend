import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Ensure the correct base path for deployment
  build: {
    outDir: "dist", // Output directory for the build
    assetsDir: "assets", // Directory for static assets within 'dist'
  },
  publicDir: "public", // Directory for public/static assets (e.g., favicon)
});
