const fs = require('fs');
const path = require('path');
const WwdParser = require("./wwdParser");

const mapsDir = path.join(__dirname, '../resources/maps');
const wwdParser = new WwdParser();

function processMaps(targetArray) {
  [...Array(15)].forEach((_, i) => {
    const mapFileName = path.join(mapsDir, `RETAIL${i+1}.WWD`);
    const wwd = wwdParser.parse(fs.readFileSync(mapFileName));

    const levelData = targetArray[wwd.baseLevel - 1]; // 0-based array
    const tileSetsNumber = levelData.tileSets.length;

    wwd.planes = wwd.planes.filter(plane => {
      return plane.flags.noDraw === 0;
    });

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

    wwd.objects.forEach(object => {
      if (object.imageSet === 'BACK' || object.imageSet === 'ACTION' || object.imageSet === 'FRONT') {
        levelData.tileSets.forEach(tileSet => {
          if (tileSet.name === object.imageSet) {
            object.frame = tileSet.mapping.indexOf(object.frame);
          }
        });
      }

      let keys = Object.keys(object);
      for (let key of keys) {
        if (!object[key]) {
          delete object[key];
        } else if (typeof(object[key]) === "object") {
          let property = object[key], foundContents = false;
          if (Array.isArray(property)) {
            for (let i = 0; i < property.length; i++) {
              if (property[i] !== 0) foundContents = true;
            }
          } else {
            let keysInside = Object.keys(property);
            for (let keyInside of keysInside) {
              if (property[keyInside] !== 0) {
                foundContents = true;
              } else {
                delete property[keyInside];
              }
            }
          }

          if (!foundContents) {
            delete object[key];
          }
        }
      }
    });

    const outputFileName = path.join(mapsDir, `RETAIL${i+1}.json`);
    fs.writeFileSync(outputFileName, JSON.stringify({
      base: wwd.baseLevel,
      startX: wwd.startX,
      startY: wwd.startY,
      mainLayerIndex: wwd.planes.indexOf(wwd.mainPlane),
      layers: wwd.planes,
      objects: wwd.objects.sort((a,b) => {
        return a.z - b.z;
      })
    }));
  });
}

module.exports = processMaps;