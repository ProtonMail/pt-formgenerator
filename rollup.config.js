const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

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
        format: 'cjs',
        name: 'easyToggleState'
    },
    plugins
};
