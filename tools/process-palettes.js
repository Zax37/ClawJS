const fs = require('fs');
const path = require('path');
const Parser = require("binary-parser").Parser;

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
        (color.r << 16) + (color.g << 8) + (color.b)
      );
    }
  });

function processPalettes(targetArray) {
  for (let i = 1; i <= 14; i++) {
    const paletteFileName = path.join(__dirname, '../resources/palettes', `LEVEL${i}.PAL`);
    targetArray.push({
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
}

module.exports = processPalettes;