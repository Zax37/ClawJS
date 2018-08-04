const http = require('http');
const path = require('path');
const fs = require('fs');
const streamToBuffer = require('stream-to-buffer');
const WwdParser = require('./wwdParser');
const { serveFile } = require('./utils');

const port = process.env.PORT || 3000;
const mapFileName = path.join(__dirname, 'resources/maps', 'RETAIL1.wwd');

const wwdParser = new WwdParser();

// Start minimal UI endpoint
http.createServer(function (req, res) {
  if (req.url === '/') {
    serveFile(path.join(__dirname, 'frontend/index.html'), res);
  } else if (req.url === '/index.js') {
    serveFile(path.join(__dirname, 'frontend/index.js'), res);
  } else if (req.url === '/phaser.js') {
    serveFile(path.join(__dirname, 'node_modules/phaser/dist/phaser-arcade-physics.js'), res);
  } else if (req.url === '/data.js') {
    const readStream = fs.createReadStream(mapFileName);
    streamToBuffer(readStream, function (err, buffer) {
      if (err) {
        res.writeHead(500);
        res.end();
        return;
      }
      const wwd = wwdParser.parseToPhaser(buffer);
      res.writeHead(200, {'Content-Type': 'application/javascript'});
      res.write('const level = ' + JSON.stringify({
        base: wwd.baseLevel,
        startX: wwd.startX,
        startY: wwd.startY,
        layers: wwd.planes
      }) + ';');
      res.end();
    });
  } else {
    serveFile(path.join(__dirname, 'resources', req.url), res);
  }
}).listen(port);
