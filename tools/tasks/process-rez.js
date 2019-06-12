const fs = require('fs');
const path = require('path');
const RezParser = require("../parsers/rez-parser");

if (process.argv[2] && process.argv[3]) {
    const rezPath = path.resolve(process.argv[2]);
    const outPath = path.resolve(process.argv[3]);
    const modelFilePath = process.argv[4] && path.resolve(process.argv[4]);

    const rezParser = new RezParser();
    const rezFile = rezParser.parse(fs.readFileSync(rezPath));
    const model = modelFilePath && JSON.parse(fs.readFileSync(modelFilePath).toString());
    rezParser.unpack(outPath, rezFile, model);
} else {
    console.log("Call arguments: REZ_FILE_PATH, OUTPUT_DIRECTORY_PATH, (optional)MAPPING_MODEL_FILE_PATH.")
}