const path = require('path');
const styleguidist = require('react-styleguidist');
const open = require('open');
const styleguide = styleguidist({
    logger: {
        error: console.error,
        info: console.log,
        debug: console.log,
        warn: console.warn,
    },
    title: 'React Style Guide Example',
    components: ['frontend/src/pages/index/MsgRender.jsx'],
    serverPort: 6065,
    serverHost: '127.0.0.1',
    webpackConfig: {
        module: {
            rules: [
              {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    plugins:["@babel/plugin-syntax-dynamic-import"]
                  }
                }
              }
            ],
          },
        resolve: {
            alias: {
                components: path.resolve(__dirname, 'frontend/src'),
                "components(.*)$": path.resolve(__dirname, 'frontend/src')
            }
        }
    },
    assetsDir: 'frontend/devWebpackServer/',
    configureServer(app) {
        app.get('/custom', (req, res) => {
            res.status(200).send({ response: 'Server invoked' });
        });
    }
});

styleguide.server(
    (err, config) => {
        if (err) {
            console.log(err)
        } else {
            const url = `http://${config.serverHost}:${config.serverPort}`;
            open(url);
        }
    }
)
