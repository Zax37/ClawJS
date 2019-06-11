const fs = require('fs');
const path = require('path');
const RezParser = require("../parsers/rez-parser");

if (process.argv[2] && process.argv[3]) {
    const rezPath = path.resolve(process.argv[2]);
    const outPath = path.resolve(process.argv[3]);

    const rezParser = new RezParser();
    const rezFile = rezParser.parse(fs.readFileSync(rezPath));
    rezParser.dumpModel(outPath, rezFile);
} else {
    console.log("Call arguments: REZ_FILE_PATH, OUTPUT_JSON_MODEL_FILE_PATH.")
}