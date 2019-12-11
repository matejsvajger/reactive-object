import { sync as rimrafSync } from 'rimraf';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

let production = !process.env.ROLLUP_WATCH;

if (production) process.env.BABEL_ENV = 'production';

production && rimrafSync('dist');

export default {
  input: 'src/reactive.js',

  output: [
    { file: 'dist/reactive.cjs.js', format: 'cjs' },
    { file: 'dist/reactive.esm.js', format: 'esm' },
    { file: 'dist/reactive.umd.js', format: 'umd', name: 'Reactive' },
  ],

  plugins: [
    babel(),
    terser(),
  ],
};
