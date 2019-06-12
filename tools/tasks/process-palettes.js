const fs = require('fs');
const path = require('path');
const paletteParser = require("../parsers/palette-parser");

if (process.argv[2] && process.argv[3]) {
  const inPath = path.resolve(process.argv[2]);
  const outPath = path.resolve(process.argv[3]);

  const output = {};
  for (let i = 1; i <= 14; i++) {
    const key = 'LEVEL' + i;
    const inputFilePath = path.resolve(inPath, key + '.PAL');
    if (!fs.existsSync(inputFilePath)) {
      console.log('Input file ' + inputFilePath + ' not found. Stopping palettes processing.');
      break;
    }
    output[key] = { palette: paletteParser.parse(fs.readFileSync(inputFilePath)).data };
  }
  fs.writeFileSync(outPath, JSON.stringify(output));
} else {
  console.log("Call arguments: PALETTES_DIRECTORY_PATH, OUTPUT_FILE_PATH.")
}