const http = require('http');
const path = require('path');
const { serveFile } = require('./utils');

const port = process.env.PORT || 3000;


// Start minimal UI endpoint
http.createServer(function (req, res) {
  if (req.url === '/') {
    serveFile(path.join(__dirname, 'frontend/index.html'), res);
  } else if (req.url === '/index.js') {
    serveFile(path.join(__dirname, 'frontend/index.js'), res);
  } else if (req.url === '/logics.js') {
    serveFile(path.join(__dirname, 'frontend/logics.js'), res);
  } else if (req.url === '/mapFactory.js') {
    serveFile(path.join(__dirname, 'frontend/mapFactory.js'), res);
  } else if (req.url === '/states/MapDisplay.js') {
    serveFile(path.join(__dirname, 'frontend/states/MapDisplay.js'), res);
  } else if (req.url === '/states/Menu.js') {
    serveFile(path.join(__dirname, 'frontend/states/Menu.js'), res);
  } else if (req.url === '/phaser.js') {
    serveFile(path.join(__dirname, 'node_modules/phaser/dist/phaser.js'), res);
  } else {
    serveFile(path.join(__dirname, 'resources', req.url), res);
  }
}).listen(port);
