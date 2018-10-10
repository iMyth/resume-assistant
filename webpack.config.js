const pathTo = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const entry = {}
const weexEntry = {}
const vueWebTemp = 'temp'
const hasPluginInstalled = fs.existsSync('./web/plugin.js')
// Manually import UglifyJSPlugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const isWin = /^win/.test(process.platform)
let fileType = ''
// Wraping the entry file
const getEntryFileContent = (entryPath, vueFilePath) => {
  let relativePath = pathTo.relative(pathTo.join(entryPath, '../'), vueFilePath)
  // let storePath = pathTo.relative(pathTo.join(entryPath, '../'), pathTo.resolve('src/store/index.js'))
  let navigatorPath = pathTo.relative(pathTo.join(entryPath, '../'), pathTo.resolve('src/abstract/navigator.js'))
  let contents = ''
    /**
     * The plugin's logic currently only supports the .we version
     * which will be supported later in .vue
     */
  if (hasPluginInstalled) {
    const plugindir = pathTo.resolve('./web/plugin.js')
    contents = 'require(\'' + plugindir + '\') \n'
  }
  if (isWin) {
    relativePath = relativePath.replace(/\\/g, '\\\\')
    // storePath = storePath.replace(/\\/g, '\\\\')
    navigatorPath = navigatorPath.replace(/\\/g, '\\\\')
  }
  // let isEntry = /Resume.vue/.test(vueFilePath)
  // if (isEntry) {
  //   contents = `
  //     import App from '${relativePath}'
  //     import store from '${storePath}'
  //     import navigator from '${navigatorPath}'
  //     Vue.mixin(navigator)
  //     new Vue(Vue.util.extend({ el: '#root', store }, App))
  //   `
  //   return contents
  // } else {
  //   contents = `
  //     import App from '${relativePath}'
  //     import navigator from '${navigatorPath}'
  //     Vue.mixin(navigator)
  //     new Vue(Vue.util.extend({ el: '#root' }, App))
  //   `
  // }
  contents += `
    import App from '${relativePath}'
    import navigator from '${navigatorPath}'
    Vue.mixin(navigator)
    new Vue(Vue.util.extend({ el: '#root' }, App))
  `
  return contents
}
  // Retrieve entry file mappings by function recursion
const walk = (dir) => {
  dir = dir || '.'
  const directory = pathTo.join(__dirname, 'src', dir)
  fs.readdirSync(directory).forEach((file) => {
    const fullpath = pathTo.join(directory, file)
    const stat = fs.statSync(fullpath)
    const extname = pathTo.extname(fullpath)
    if ((stat.isFile() && extname === '.vue') || extname === '.we') {
      if (!fileType) {
        fileType = extname
      }
      if (fileType && extname !== fileType) {
        console.log('Error: This is not a good practice when you use ".we" and ".vue" togother!')
      }
      const name = pathTo.join('.', pathTo.basename(file, extname))
      if (extname === '.vue') {
        const entryFile = pathTo.join(vueWebTemp, dir, pathTo.basename(file, extname) + '.js')
        fs.outputFileSync(pathTo.join(entryFile), getEntryFileContent(entryFile, fullpath))
        entry[name] = pathTo.join(__dirname, entryFile) + '?entry=true'
      }
      weexEntry[name] = fullpath + '?entry=true'
    } else if (stat.isDirectory() && file !== 'build' && file !== 'include') {
      const subdir = pathTo.join(dir, file)
      walk(subdir)
    }
  })
}
  // Generate an entry file before writing a webpack configuration
walk('views')
/**
 * Plugins for webpack configuration.
 */
const plugins = [
  /*
   * Plugin: UglifyJsPlugin
   * Description: UglifyJS plugin for webpack
   * See: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
   */
  new UglifyJSPlugin({
    uglifyOptions: {
      minimize: true,
      ecma: 6,
      compress: {
        warnings: false,
        drop_console: false
      },
      sourceMap: false
    }
  }),
  /*
   * Plugin: BannerPlugin
   * Description: Adds a banner to the top of each generated chunk.
   * See: https://webpack.js.org/plugins/banner-plugin/
   */
  new webpack.BannerPlugin({
    banner: '// { "framework": ' + (fileType === '.vue' ? '"Vue"' : '"Weex"') + '} \n',
    raw: true,
    exclude: 'Vue'
  })
]
function resolve (dir) {
  return pathTo.join(__dirname, '..', dir)
}
// Config for compile jsbundle for web.
const webConfig = {
  // context: pathTo.join(__dirname, ''),
  // entry: entry,
  entry: {
    'index': pathTo.resolve('src', 'entry.js')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': pathTo.resolve(__dirname, './src'),
      'util': pathTo.resolve(__dirname, './src/api/util.js'),
      'strings': pathTo.resolve(__dirname, './src/i18n'),
      'config': pathTo.resolve(__dirname, './src/config.js'),
      'service': pathTo.resolve(__dirname, './src/api/service.js'),
      'components': pathTo.resolve(__dirname, './src/components'),
      'icons': pathTo.resolve(__dirname, './src/loader/imageLoader.js'),
      'localStorage': pathTo.resolve(__dirname, './src/api/localStorage.js'),
      'bridge': pathTo.resolve(__dirname, './src/api/bridge.js')
    }
  },
  output: {
    path: pathTo.join(__dirname, 'dist'),
    filename: '[name].web.js'
  },
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: false, // 'source-map',
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    // webpack 2.0
    rules: [{
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }],
      exclude: /node_modules(?!(\/|\\).*(weex).*)/
    }, {
      test: /\.vue(\?[^?]+)?$/,
      use: [{
        loader: 'vue-loader',
        options: {
          optimizeSSR: false,
          postcss: [
            // to convert weex exclusive styles.
            require('postcss-plugin-weex')(),
            require('autoprefixer')({
              browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
            }),
            require('postcss-plugin-px2rem')({
              // base on 750px standard.
              rootValue: 75,
              // to leave 1px alone.
              minPixelValue: 1.01
            })
          ],
          compilerModules: [
            {
              postTransformNode: el => {
                // to convert vnode for weex components.
                require('weex-vue-precompiler')()(el)
              }
            }
          ]
        }
      }]
    }, {
      test: /\.(png|jpe?g|svg|mp4)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 1,
        name: pathTo.posix.join('assets', 'img/[name].[ext]') // utils.assetsPath('img/[name].[ext]')
      }
    }]
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
}
// Config for compile jsbundle for native.
const weexConfig = {
  entry: weexEntry,
  // entry: {
  //   'index': pathTo.resolve('src', 'entry.js')
  // },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': pathTo.resolve(__dirname, './src'),
      'util': pathTo.resolve(__dirname, './src/api/util'),
      'strings': pathTo.resolve(__dirname, './src/i18n'),
      'config': pathTo.resolve(__dirname, './src/config.js'),
      'service': pathTo.resolve(__dirname, './src/api/service.js'),
      'components': pathTo.resolve(__dirname, './src/components'),
      'icons': pathTo.resolve(__dirname, './src/loader/imageLoader.js'),
      'localStorage': pathTo.resolve(__dirname, './src/api/localStorage.js'),
      'bridge': pathTo.resolve(__dirname, './src/api/bridge.js')
    }
  },
  output: {
    path: pathTo.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }],
      exclude: /node_modules(?!(\/|\\).*(weex).*)/
    }, {
      test: /\.vue(\?[^?]+)?$/,
      use: [{
        loader: 'weex-loader'
      }]
    }, {
      test: /\.we(\?[^?]+)?$/,
      use: [{
        loader: 'weex-loader'
      }]
    }, {
      test: /\.(png|jpe?g|svg|mp4)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 1,
        name: pathTo.posix.join('assets', 'img/[name].[ext]') // utils.assetsPath('img/[name].[ext]')
      }
    }]
  },
  /*
   * These options configure whether to polyfill or mock certain Node.js globals and modules.
   * This allows code originally written for the Node.js environment to run in other environments like the browser.
   *
   * See: https://webpack.js.org/configuration/node/#node
   */
  node: {
    setImmediate: false
    // See "Other node core libraries" for additional options.
  },
  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: plugins
}
// If The fileType is '.we', only need to use weexConfig for building.
if (fileType === '.we') {
  module.exports = weexConfig
} else {
  module.exports = [webConfig, weexConfig]
}
