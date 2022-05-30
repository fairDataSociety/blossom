import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import { NormalModuleReplacementPlugin } from 'webpack'
import dotenv from 'dotenv'

dotenv.config({ override: true })

const rootDir = path.resolve(__dirname)
const srcDir = path.resolve(rootDir, 'src')
const buildDir = path.resolve(rootDir, 'dist')

const isDev = process.env.ENVIRONMENT === 'development'

module.exports = {
  mode: process.env.ENVIRONMENT,
  devtool: isDev ? 'inline-source-map' : undefined,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  entry: {
    main: path.resolve(srcDir, 'main.ts'),
    content: path.resolve(srcDir, 'content', 'index.ts'),
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: buildDir,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/typescript',
              {
                plugins: ['@babel/plugin-transform-runtime'],
              },
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv(),
    // Added because Bee.js uses Blob polyfill which cannot be executed in service worker script
    // https://github.com/ethersphere/bee-js/issues/586
    new NormalModuleReplacementPlugin(/blob-polyfill/, path.join(srcDir, 'polyfills', 'Blob.js')),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(rootDir, 'manifest.json'),
          to: path.resolve(buildDir, 'manifest.json'),
        },
      ],
    }),
  ],
}
