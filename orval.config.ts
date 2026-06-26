import { defineConfig } from 'orval';

export default defineConfig({
  pizzaApi: {
    // Backend publikuje OpenAPI pod HTTPS na porcie 7115.
    // Jeśli Orval uruchamiany z Node nie ufa lokalnemu certyfikatowi dev,
    // ustaw NODE_TLS_REJECT_UNAUTHORIZED=0 albo zaufaj certyfikatowi ASP.NET.
    input: 'https://localhost:7115/openapi/v1.json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/api.ts',
      schemas: 'src/api/generated/models',
      client: 'axios',
      override: {
        formData: {
          path: 'src/api/customFormData.ts',
          name: 'customFormData',
        },
        mutator: {
          path: 'src/api/axiosConfig.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
