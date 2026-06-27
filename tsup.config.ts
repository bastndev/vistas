import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client/index.ts',
    element: 'src/client/element.ts',
    react: 'src/react/index.ts',
    server: 'src/server/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  target: 'es2020',
  platform: 'neutral',
  shims: false,
  // Optional peer deps — never bundle them into the package.
  external: ['@upstash/redis', 'react'],
  outExtension({ format }) {
    return { js: format === 'esm' ? '.js' : '.cjs' };
  },
});
