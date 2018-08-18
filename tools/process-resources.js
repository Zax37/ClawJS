const fs = require('fs');
const path = require('path');
const Parser = require("binary-parser").Parser;
const pidParser = require("./pidParser");
const WwdParser = require("./wwdParser");

const colorParser = new Parser()
  .endianess("little")
  .uint8("r")
  .uint8("g")
  .uint8("b");

const paletteParser = new Parser()
  .array("data", {
    type: colorParser,
    length: 256,
    formatter: function(arr) {
      return arr.map(color =>
        (color.b << 16) + (color.g << 8) + (color.r)
      );
    }
  });

const data = {
  levels: []
};

for (let i = 1; i <= 14; i++) {
  const paletteFileName = path.join(__dirname, '../resources/palettes', `LEVEL${i}.PAL`);
  data.levels.push({
    palette: paletteParser.parse(fs.readFileSync(paletteFileName)).data,
    tileSets: ['ACTION', 'BACK', 'FRONT'].map(layerName => {
      const fileName = path.join(__dirname, '../resources/tilesets', `L${i}_${layerName}.json`);
      return {
        name: layerName,
        mapping: JSON.parse(fs.readFileSync(fileName))
      };
    })
  });
}

const mapsDir = path.join(__dirname, '../resources/maps');
const wwdParser = new WwdParser();

[...Array(14)].forEach((_, i) => {
  const mapFileName = path.join(mapsDir, `RETAIL${i+1}.WWD`);
  const wwd = wwdParser.parse(fs.readFileSync(mapFileName));

  const levelData = data.levels[wwd.baseLevel - 1]; // 0-based array
  const tileSetsNumber = levelData.tileSets.length;

  wwd.planes.forEach(plane => {
    plane.fillColor = levelData.palette[plane.fillColor];
    plane.imageSets.forEach(imageSet => {
      for (let i = 0; i < tileSetsNumber; i++) {
        if (levelData.tileSets[i].name === imageSet) {
          const mapping = levelData.tileSets[i].mapping;
          plane.fillTileIndex = mapping.length - 1;
          plane.data = plane.data.map(id => mapping.indexOf(id));
          break;
        }
      }
    });
  });

  const outputFileName = path.join(mapsDir, `RETAIL${i+1}.json`);
  fs.writeFileSync(outputFileName, JSON.stringify({
    base: wwd.baseLevel,
    startX: wwd.startX,
    startY: wwd.startY,
    mainLayerIndex: wwd.planes.indexOf(wwd.mainPlane),
    layers: wwd.planes,
    objects: wwd.objects
  }));
});

if (process.argv[2]) {
  let directory = path.resolve(process.argv[2]);
  console.log("Parsing imagesets in: " + directory);

  const items = fs.readdirSync(directory);
  items.forEach(imageset => {
    const imageSetFileName = path.join(__dirname, '../resources/imagesets', `${imageset}.json`);
    const mappingName = imageset.startsWith("LEVEL") ? "LEVEL" : imageset;
    try {
      const pidFilesPath = path.join(directory, imageset, 'IMAGES');
      const imageSetData = JSON.parse(fs.readFileSync(imageSetFileName));
      imageSetData.textures[0].frames.forEach(frame => {
        if (frame.filename.endsWith('.png')) {
          const pidPath = path.join(pidFilesPath, frame.filename.replace('.png', '.pid'));
          try {
            const pid = pidParser.parse(fs.readFileSync(pidPath));
            let path = frame.filename.split('/');
            let I = path.pop().match(/([^1-9]*)([0-9]*).*$/)[2];
            frame.anchor = {
              x: 0.5 - (pid.offsetX / pid.width).toPrecision(4),
              y: 0.5 - (pid.offsetY / pid.height).toPrecision(4)
            };
            frame.filename = mappingName + '_' + path.join('_') + I;
          } catch (e) {
            console.error("Failed to process " + pidPath);
          }
        }
      });
      fs.writeFileSync(imageSetFileName,JSON.stringify(imageSetData));
    } catch (e) {
      console.log(`${imageset} imageset not found or corrupt, skipping`);
    }
  });
} else {
  console.log("No REZ supplied, skipping pids parsing.")
}
