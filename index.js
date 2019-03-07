const http = require('http');
const path = require('path');
const { serveFile } = require('./utils');

const port = process.env.PORT || 3000;

// Start minimal UI endpoint
http.createServer(function (req, res) {
  if (req.url === '/') {
    serveFile(path.join(__dirname, 'build/index.html'), res);
  } else if (req.url === '/app.js') {
    serveFile(path.join(__dirname, 'build/app.js'), res);
  } else {
    serveFile(path.join(__dirname, 'resources', req.url), res);
  }
}).listen(port);
