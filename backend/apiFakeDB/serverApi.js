const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const open = require('open');
const cors = require('cors');
const getJsonFiles = require('./serverJsonApi');

const isRunning = process.env.running === 'true';

const app = express();
app.use(cors());
const publicDir = path.join(__dirname, 'public');


const whatShow = (pathShow, data, params) => {
  if (pathShow === '/hello/test') { // return the same post object
    return { data: params.text };
  }
  return data;
};


app.set('port', process.env.PORT || 3005);
app.use(bodyParser.json()); // Parses json, multi-part (file), url-encoded
app.use(express.static(publicDir));


const runApi = async () => {
  const lista = await getJsonFiles();

  let rutas = [];
  if (!isRunning) {
    console.log(chalk.bold('   Resources:')); // eslint-disable-line no-console
  }
  lista.forEach((p) => {
    if (p.path !== undefined && p.method !== undefined) {
      app[p.method.toLowerCase()](p.path, (req, res) => {
        const valueReturn = whatShow(p.path, p.data, req.body);
        res.jsonp(valueReturn);
      });
      const ruta = {
        path: p.path,
        description: p.description,
        method: p.method,
        parameters: p.parameters,
      };
      rutas = [...rutas, ruta];
      if (!isRunning) {
        console.log(`   [${p.method.toUpperCase()}] http://localhost:${// eslint-disable-line no-console
          app.get('port')}${p.path}`);
      }
    }
  });

  // Add custom routes before JSON Server router
  app.get('/rutas', (req, res) => {
    res.jsonp(rutas);
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
};
runApi();

const server = http.createServer(app);

// Reload code here
reload(app).then(() => {
  // reloadReturned is documented in the returns API in the README

  // Reload started, start web server
  server.listen(app.get('port'), () => {
    if (!isRunning) {
      console.log(chalk.bold('   URL')); // eslint-disable-line no-console
      console.log(`   http://localhost:${app.get('port')}`); // eslint-disable-line no-console
      open(`http://localhost:${app.get('port')}`);
    }
  });
}).catch((err) => {
  console.error('Reload could not start app', err); // eslint-disable-line no-console
});
