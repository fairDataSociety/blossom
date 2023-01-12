import path from 'path'
import fs from 'fs'
import CopyPlugin from 'copy-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import dotenv from 'dotenv'
import { Server } from 'ws'
import { Compilation, Compiler } from 'webpack'

const RELOAD_PORT = 18888

const ExtraActionsPlugin = (event: string, callback: (compilation: Compilation) => void) => ({
  apply: (compiler: Compiler) => {
    compiler.hooks.afterEmit.tap(event, callback)
  },
  userOptions: {},
  version: 1,
})

function createLiveReloadPlugin(): HtmlWebpackPlugin {
  const server: Server = new Server({ port: RELOAD_PORT })

  return ExtraActionsPlugin('LiveReloadPlugin', () => {
    server.clients.forEach((client) => {
      client.send('ping')
    })
  })
}

interface WebpackEnvParams {
  ui: string
  build: string
}

module.exports = (env: WebpackEnvParams) => {
  dotenv.config({ override: true })

  const rootDir = path.resolve(__dirname)
  const srcDir = path.resolve(rootDir, 'src')
  const buildDir = path.resolve(rootDir, 'dist')
  const uiDir = path.resolve(srcDir, 'ui')
  let plugins: HtmlWebpackPlugin[] = []

  const isDev = process.env.ENVIRONMENT === 'development'
  const isUI = env.ui === 'true'
  const isBuild = env.build === 'true'

  const pages = fs.readdirSync(uiDir).filter((page) => page !== 'common')

  const pageEntries = pages.reduce((pagesMap, page) => {
    pagesMap[page] = path.resolve(uiDir, page, 'index.tsx')

    return pagesMap
  }, {})

  if (isUI || isBuild) {
    plugins = plugins.concat(
      pages.map(
        (page) =>
          new HtmlWebpackPlugin({
            filename: `${page}.html`,
            template: path.resolve(uiDir, page, 'index.html'),
            chunks: [page],
          }),
      ),
    )
  }

  if (!isUI || isBuild) {
    plugins.push(
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
          {
            from: path.resolve(rootDir, 'assets', 'icons'),
            to: path.resolve(buildDir, 'icons'),
          },
        ],
      }) as unknown as HtmlWebpackPlugin,
    )
  }

  if (isDev && !isUI && !isBuild) {
    plugins.push(createLiveReloadPlugin())
  }

  let entry = {}

  if (isUI || isBuild) {
    entry = {
      ...entry,
      ...pageEntries,
      content: path.resolve(srcDir, 'content', 'index.ts'),
    }
  }

  if (!isUI || isBuild) {
    entry = {
      ...entry,
      main: path.resolve(srcDir, 'main.ts'),
    }
  }

  return {
    mode: process.env.ENVIRONMENT,
    devtool: isDev ? 'inline-source-map' : undefined,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    entry,
    output: {
      filename: '[name].js',
      publicPath: '/',
      path: buildDir,
      clean: isBuild,
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
      ...plugins,
      new Dotenv(),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      }),
    ],
  }
}
