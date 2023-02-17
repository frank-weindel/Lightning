// @ts-check
/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { babel } from '@rollup/plugin-babel';
import { banner } from './banner.vite-plugin';
import cleanup from 'rollup-plugin-cleanup';
import packageJson from './package.json';
import { fixTsImportsFromJs } from './fixTsImportsFromJs.vite-plugin';


const isEs5Build = process.env.BUILD_ES5 === 'true';
const isMinifiedBuild = process.env.BUILD_MINIFY === 'true';

export default defineConfig(() => {
  return {
    plugins: [
      /* Cleanup comments */
      cleanup({
        comments: 'none',
      }),
      fixTsImportsFromJs(),
      /* ES5 (if requested) */
      isEs5Build && babel({
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                chrome: '39',
              },
              spec: true,
              debug: false,
              modules: false,
            },
          ],
        ],
      }),
      /* Add comment banner to top of bundle */
      banner([
        '/*',
        ` * Lightning v${packageJson.version}`,
        ' *',
        ' * https://github.com/rdkcentral/Lightning',
        ' */',
      ].join('\n')),
    ],
    build: {
      sourcemap: isMinifiedBuild,
      emptyOutDir: false,
      outDir: 'dist-vite',
      minify: isMinifiedBuild ? 'terser' : false,
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
      },
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/lightning.mjs'),
        formats: ['umd'],
        name: 'lng',
        // the proper extensions will be added
        fileName: () => {
          let extension = isMinifiedBuild ? '.min.js' : '.js';
          if (isEs5Build) {
            extension = '.es5' + extension;
          }
          return 'lightning' + extension;
        }
      },
    },
  }
});
