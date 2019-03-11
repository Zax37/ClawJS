const fs = require('fs');
const path = require('path');

function serveFile(file, res) {
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write("404: Not Found!");
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': getContentType(file)});
            res.write(content);
            res.end();
        }
    });
}

function getContentType(url) {
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

module.exports = {serveFile};
