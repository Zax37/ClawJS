const path = require('path');
const fs = require('fs');
const aniParser = require('../parsers/ani-parser');

if (process.argv[2]) {
    const filePath = path.resolve(process.argv[2]);
    const animation = aniParser.parse(fs.readFileSync(filePath));
    console.log(animation);
} else {
    console.log("Call arguments: ANI_PATH.");
}
