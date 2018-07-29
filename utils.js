const fs = require('fs');
const path = require('path');

function serveFile(file, res) {
  fs.readFile(file, (err, content) => {
    if(err){
      res.writeHead(404);
      res.write("404: Not Found!");
      res.end();
    } else{
      res.writeHead(200, {'Content-Type': getContentType(file)});
      res.write(content);
      res.end();
      console.log(`Response: 200 ${file}`);
    }
  });
}

function getContentType(url){
  switch (path.extname(url)) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'application/octate-stream';
  }
}

function mapDataIfSchemaSupplied(wwd) {
  const mapping = {};
  const pre = "L"+wwd.baseLevel+"_";
  wwd.planes.forEach(plane => {
    plane.imageSets.forEach(imageSet => {
      const name = pre + imageSet + ".json";
      const file = path.join(__dirname, 'resources', name);
      if (mapping[name] === undefined) {
        try {
          mapping[name] = JSON.parse(fs.readFileSync(file));
        } catch (e) {
          mapping[name] = null;
        }
      }

      if (mapping[name] !== null) {
        plane.data.forEach((chunk, i) => {
          plane.data[i] = chunk.map(id => mapping[name].indexOf(id));
        });
      }
    });
  });
  return wwd;
}

module.exports = { serveFile, mapDataIfSchemaSupplied };
