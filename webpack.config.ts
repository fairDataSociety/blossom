import path from 'path'
import fs from 'fs'
import CopyPlugin from 'copy-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import dotenv from 'dotenv'

dotenv.config({ override: true })

const rootDir = path.resolve(__dirname)
const srcDir = path.resolve(rootDir, 'src')
const buildDir = path.resolve(rootDir, 'dist')
const uiDir = path.resolve(srcDir, 'ui')

const isDev = process.env.ENVIRONMENT === 'development'

if (process.env.CI === 'true') {
  console.log('CI mode detected')
}

const pages = fs.readdirSync(uiDir).filter((page) => page !== 'common')

const pageEntries = pages.reduce((pagesMap, page) => {
  pagesMap[page] = path.resolve(uiDir, page, 'index.tsx')

  return pagesMap
}, {})

const htmlPlugins = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      filename: `${page}.html`,
      template: path.resolve(uiDir, page, 'index.html'),
      chunks: [page],
    }),
)

module.exports = {
  mode: process.env.ENVIRONMENT,
  devtool: isDev ? 'inline-source-map' : undefined,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  entry: {
    ...pageEntries,
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
              '@babel/preset-react',
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
    ...htmlPlugins,
    new Dotenv(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(rootDir, 'manifest.json'),
          to: path.resolve(buildDir, 'manifest.json'),
        },
        {
          from: path.resolve(rootDir, 'assets', 'locales'),
          to: path.resolve(buildDir, 'locales'),
        },
      ],
    }),
  ],
}
