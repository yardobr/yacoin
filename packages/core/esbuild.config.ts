import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const baseConfig: esbuild.BuildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()], // Exclude node_modules
};

// Build for ESM
await esbuild.build({
  ...baseConfig,
  outfile: 'dist/index.js',
  format: 'esm',
});

console.log('⚡ Build complete! ⚡'); 