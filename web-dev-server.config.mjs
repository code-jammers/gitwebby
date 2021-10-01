import { fromRollup } from '@web/dev-server-rollup';
import _litcss from 'rollup-plugin-lit-css';
const litcss = fromRollup(_litcss);

export default {
  open: true,
  watch: true,
  nodeResolve: true,
  appIndex: 'index.html',
  mimeTypes: {
    'src/**/*.css': 'js',
  },
  plugins: [litcss()],
};
