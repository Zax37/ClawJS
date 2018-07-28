const http = require('http');
const path = require('path');
const fs = require('fs');
const streamToBuffer = require('stream-to-buffer');
const WwdParser = require('./wwdParser');
const { serveFile } = require('./utils');

const port = process.env.PORT || 3000;
const fileName = path.join(__dirname, 'db', 'Test1.wwd');

const wwdParser = new WwdParser();

// Start minimal UI endpoint
http.createServer(function (req, res) {
  if (req.url === '/') {
    serveFile(path.join(__dirname, 'frontend/index.html'), res);
  } else if (req.url === '/phaser.js') {
    serveFile(path.join(__dirname, 'node_modules/phaser/dist/phaser-arcade-physics.js'), res);
  } else if (req.url === '/data.js') {
    const readStream = fs.createReadStream(fileName);
    streamToBuffer(readStream, function (err, buffer) {
      if (err) {
        res.writeHead(500);
        res.end();
        return;
      }
      const wwd = wwdParser.parse(buffer);
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write("const level = " + JSON.stringify(wwd.planes[0].data) + ";");
      res.end();
    });
  } else {
    serveFile(path.join(__dirname, 'frontend', req.url), res);
  }
}).listen(port);
