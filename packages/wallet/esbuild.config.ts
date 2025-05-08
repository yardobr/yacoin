import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const buildOptions: esbuild.BuildOptions = {
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  bundle: true,
  minify: false,
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
};

esbuild.build(buildOptions).catch((err) => {
  console.error(err);
  process.exit(1);
}); 