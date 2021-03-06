const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

let basicObjectFunction = (pathComponent) => {
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    },

    // LOADERS
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins:["@babel/transform-runtime"]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true,
              emitWarning: true,
            }
          }
          ],
        }
      ],
    },

    // PATH RESOLVE
    resolve: {
      extensions: ['.js', '.jsx', '.json'],

      modules: [
        path.resolve(__dirname, `frontend/src/pages/${pathComponent}`),
        'node_modules'
      ],
      alias: {
        components: path.resolve(__dirname, 'frontend/src'),
        "components(.*)$": path.resolve(__dirname, 'frontend/src')
      }
    }
  }
};

let devServer = {
  contentBase: path.resolve(__dirname, "./frontend/devWebpackServer/"),
  watchContentBase: true,
  open: true,
  host: '127.0.0.1',
  disableHostCheck: true,
  proxy: {
    '/resources/rest/': {
      target: 'http://localhost:3005',
      pathRewrite: { '^/resources/rest/': '' }
    }
  },
  historyApiFallback: {
    index: `./index.html`,
    rewrites: [
      { from: /^\/$/, to: `./index.html` },
      { from: /^\/foo/, to: `./index.html` },
      { from: /(.*)/, to: `./index.html` },
    ]
  }, port: 3515
}

let getFunction = (parameter, env) => {
  let basicObject = basicObjectFunction(parameter);
  let rules = [...basicObject.module.rules];
  let mode = 'production';
  let publicPath = '/dist/';
  let filename = `${parameter}.bundle.js`;
  if (env.development) {
    rules = [...rules, {
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true,
      }
    }];
    process.env.NODE_ENV = 'development';
    mode = 'development';
    filename = 'app.bundle.js'
  }
  else {
    process.env.NODE_ENV = 'production';
    publicPath = `./`;
  }

  return {
    ...basicObject,
    module: { rules: rules },
    mode: mode,
    output: {
      path: __dirname + `frontend/bundle/${parameter}/`,
      filename: filename,
      chunkFilename: '[name].bundle.js',
      publicPath: publicPath
    }, devServer: devServer
  };
}

//"development", "test", and "production".
module.exports = (env) => {
  var args = JSON.parse(process.env.npm_config_argv);
  if (args.remain.length !== 1) {
    console.log('\x1b[31m%s\x1b[31m',
      'Por favor, ingresar el nombre del jsx principal para transpilar');
    process.exit(128);
  }
  let returnValue = {};
  let param = args.remain[0];
  if (env) returnValue = getFunction(param, env);
  return returnValue
};
