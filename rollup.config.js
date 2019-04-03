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
                },
                useBuiltIns: 'entry'
            }
        ]
    ],
    plugins: [['transform-react-jsx', { pragma: 'h' }]]
};

const isDev = process.env.NODE_ENV === 'dev';

const plugins = [
    stripCode({
        start_comment: 'START.DEV_ONLY',
        end_comment: 'END.DEV_ONLY'
    }),
    resolve(),
    commonjs({
        include: 'node_modules/**'
    }),
    babel(babelConfig)
];

!isDev && plugins.push(terser());

const tasks = [
    {
        input: 'src/main.js',
        output: {
            file: `dist/main.ie11.js`,
            format: 'umd', // iife or umd for our app, with cjs window is broken
            name: 'abuseForm'
        },
        plugins
    },
    {
        input: 'src/main.js',
        output: {
            file: `dist/main.js`,
            format: 'umd', // iife or umd for our app, with cjs window is broken
            name: 'abuseForm'
        },
        plugins: [
            stripCode({
                start_comment: 'START.IE_ONLY',
                end_comment: 'END.IE_ONLY'
            }),
            ...plugins
        ]
    }
];

// Osef IE11 for dev
isDev && tasks.splice(0, 1);

export default tasks;
