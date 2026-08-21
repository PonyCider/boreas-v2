import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Espeja tsconfig.json: "@/*" -> "./*"
    alias: { "@": import.meta.dirname },
  },
  test: {
    include: ["lib/**/*.test.ts", "content/**/*.test.ts"],
  },
});
