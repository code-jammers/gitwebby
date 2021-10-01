import merge from 'deepmerge';
import copy from 'rollup-plugin-copy';
import { createSpaConfig } from '@open-wc/building-rollup';

const spaConfig = createSpaConfig({
  injectServiceWorker: false,
  workbox: {
    skipWaiting: false,
  },
});

export default merge(spaConfig, {
  output: {
    sourcemap: false,
  },
  input: './index.html',
  mimeTypes: {
    'src/**/*.css': 'js',
  },
  plugins: [
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: '_redirects', dest: 'dist' },
        { src: 'images/**/*', dest: 'dist/images' },
        { src: 'fonts/**/*', dest: 'dist/fonts' },
      ],
    }),
  ],
});
