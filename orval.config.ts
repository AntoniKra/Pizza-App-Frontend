import { defineConfig } from "orval";

export default defineConfig({
  pizzaRadar: {
    output: {
      mode: "tags-split",
      target: "src/api/endpoints",
      schemas: "src/api/model",
      client: "axios",
      mock: false,
      clean: true,
      prettier: true,
    },
    input: {
      // 1. Tutaj wklejamy link od kolegi
      target: "https://localhost:7115/openapi/v1.json",
    },
  },
});
