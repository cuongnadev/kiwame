import { defineConfig } from "vitest/config";
import * as path from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    environment: "jsdom",
    globals: true,
  },
});
