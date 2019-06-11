const fs = require('fs');
const path = require('path');
const paletteParser = require("../parsers/palette-parser");

function processPalettes(targetArray) {
  for (let i = 1; i <= 14; i++) {
    const paletteFileName = path.join(__dirname, '../../resources/palettes', `LEVEL${i}.PAL`);
    targetArray.push({
      palette: paletteParser.parse(fs.readFileSync(paletteFileName)).data,
      tileSets: ['ACTION', 'BACK', 'FRONT'].map(layerName => {
        const fileName = path.join(__dirname, '../../resources/tilesets', `L${i}_${layerName}.json`);
        return {
          name: layerName,
          mapping: JSON.parse(fs.readFileSync(fileName))
        };
      })
    });
  }
}

module.exports = processPalettes;