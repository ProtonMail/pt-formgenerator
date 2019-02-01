const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const stripCode = require('rollup-plugin-strip-code');

const babelConfig = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: ['ie 11']
                }
            }
        ]
    ],
    plugins: [['transform-react-jsx', { pragma: 'h' }]]
};

const plugins = [
    stripCode({
        start_comment: 'START.DEV_ONLY',
        end_comment: 'END.DEV_ONLY'
    }),
    resolve(),
    commonjs({
        include: 'node_modules/**'
    }),
    babel(babelConfig),
    terser()
];

export default {
    input: 'src/main.js',
    output: {
        file: `dist/main.js`,
        format: 'umd', // iife or umd for our app, with cjs window is broken
        name: 'abuseForm'
    },
    plugins
};
