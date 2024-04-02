import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const OUT_DIR = './dist';

async function buildAll() {
  await build({
    entryPoints: [],
    platform: 'node',
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./node_modules/**/*'],
          to: [`${OUT_DIR}/layers/deps/nodejs/node_modules`],
        },
      }),
    ],
  });
}

buildAll();
