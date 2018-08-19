const fs = require('fs');
const path = require('path');
const WwdParser = require("./wwdParser");

const mapsDir = path.join(__dirname, '../resources/maps');
const wwdParser = new WwdParser();

function processMaps(targetArray) {
  [...Array(14)].forEach((_, i) => {
    const mapFileName = path.join(mapsDir, `RETAIL${i+1}.WWD`);
    const wwd = wwdParser.parse(fs.readFileSync(mapFileName));

    const levelData = targetArray[wwd.baseLevel - 1]; // 0-based array
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
}

module.exports = processMaps;