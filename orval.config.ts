import { defineConfig } from 'orval';

export default defineConfig({
  pizzaApi: {
    // Używamy nieszyfrowanego portu, aby ominąć błąd certyfikatu Node.js
    input: 'https://localhost:7115/openapi/v1.json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/api.ts',
      schemas: 'src/api/generated/models',
      client: 'axios',
      override: {
        mutator: {
          path: 'src/api/axiosConfig.ts',
          name: 'customInstance',
        },
      },
    },
  },
});