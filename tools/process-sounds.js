var path = require('path');
var fs = require('fs');
var audiosprite = require('audiosprite');

var files = [];
var mappings = [];
var shortNames = [];
var opts = {
  export: 'ogg',
  ignorerounding: 1,
  gap: 0,
};

function parseSoundsDir(directory, mapping) {
  const items = fs.readdirSync(directory);
  items.forEach(item => {
    if (item.endsWith('.WAV')) {
      if (shortNames.includes(item.slice(0, -4))) {
          console.log(files[shortNames.indexOf(item.slice(0, -4))], path.join(directory, item));
      }
      files.push(path.join(directory, item));
      mappings.push(mapping + '_' + item.slice(0, -4));
      shortNames.push(item.slice(0, -4));
    } else {
      parseSoundsDir(path.join(directory, item), mapping ? mapping + '_' + item : item);
    }
  });
}

if (process.argv[2]) {
  const directory = path.resolve(process.argv[2]);
  parseSoundsDir(directory);
  audiosprite(files, opts, function(err, obj) {
    if (err) return console.error(err);

    Object.keys(obj.spritemap).forEach((fileName) => {
      var i = shortNames.indexOf(fileName);
      obj.spritemap[mappings[i]] = obj.spritemap[fileName];
      delete obj.spritemap[mappings[i]].loop;
      delete obj.spritemap[fileName];
    });
    console.log(JSON.stringify(obj, null, 2));
  })
}