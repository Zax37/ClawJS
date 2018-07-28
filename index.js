const http = require('http');
const path = require('path');
const fs = require('fs');
const streamToBuffer = require('stream-to-buffer');
const WwdParser = require('./wwdParser');

const port = process.env.PORT || 3000;
const fileName = path.join(__dirname, 'db', 'Test1.wwd');

const wwdParser = new WwdParser();

// Start minimal UI endpoint
http.createServer(function (req, res) {
  if (req.url === '/') {
    const readStream = fs.createReadStream(fileName);
    streamToBuffer(readStream, function (err, buffer) {
      if (err) {
        res.writeHead(500);
        res.end();
        return;
      }
      const wwd = wwdParser.parse(buffer);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(JSON.stringify(wwd), null, 4);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(port);