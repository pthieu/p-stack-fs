import { build } from 'esbuild';
import { createRequire } from 'module';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const _require = createRequire(import.meta.url);
const pkg = _require('./package.json');

const OUT_DIR = './dist';
const APP_DIR = 'fn'; // XXX(Phong): must match terraform
const FN_DIR = path.join('.', 'src');

async function getBuildDirs() {
  const functionsPath = FN_DIR;
  const allItems = await readdir(functionsPath, {
    withFileTypes: true,
  });
  const dirs = allItems
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
  return dirs;
}

async function buildPackage(dir) {
  await build({
    entryPoints: [`${FN_DIR}/${dir}/index.ts`],
    platform: 'node',
    target: 'node18',
    format: 'esm',
    bundle: true,
    minify: false,
    outfile: `${OUT_DIR}/${dir}/${APP_DIR}/index.mjs`,
    // XXX(Phong): for some reason `packages: 'external'` doesn't work, so we
    // have to manually exlude all dependencies in package.json (we have a layer
    // with all dependencies)
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    // external: ['./node_modules/*', '@aws-sdk/*'],
    // packages: 'external',
    // banner: {
    //   js: `
    //   import * as path0 from 'path';
    //   import { fileURLToPath } from 'url';
    //   import { createRequire as topLevelCreateRequire } from 'module';
    //   const require = topLevelCreateRequire(import.meta.url);
    //   const __filename = fileURLToPath(import.meta.url);
    //   const __dirname = path0.dirname(__filename);
    //   `,
    // },
  });
}

async function buildAll() {
  const dirs = await getBuildDirs();
  await Promise.all(dirs.map((d) => buildPackage(d)));
}

buildAll();
