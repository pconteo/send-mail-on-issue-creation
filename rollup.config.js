import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',            // CommonJS per Node.js
    inlineDynamicImports: true // importante per nodemailer e @actions/core
  },
  plugins: [
    resolve(),
    commonjs(),
    json()
  ]
};
