import { defineConfig } from "orval";

export default defineConfig({
  pizzaRadar: {
    output: {
      mode: "tags-split",
      target: "src/api/generated/api.ts", // Orval utworzy folder generated
      schemas: "src/api/generated/models", // Modele trafią do generated/models
      client: "axios",
      mock: false,
      clean: true, // To usunie stare wygenerowane pliki przed zrobieniem nowych
      prettier: true,
      override: {
        mutator: {
          path: "src/api/axiosConfig.ts",
          name: "customInstance",
        },
      },
    },
    // Uproszczony zapis input
    input: "https://localhost:7115/openapi/v1.json",
  },
});