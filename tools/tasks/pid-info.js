const fs = require('fs');
const path = require('path');
const PidParser = require("../parsers/pid-parser");
const { writePngFileSync, colorRGBA, xy } = require("node-libpng");

if (process.argv[2]) {
    const imgPath = path.resolve(process.argv[2]);
    const pidParser = new PidParser();
    const pid = pidParser.parse(fs.readFileSync(imgPath));

    const imageData = Buffer.alloc(pid.width * pid.height * 4);
    const options = {
        width: pid.width,
        height: pid.height
    };
    for (let i = 0; i < pid.data.length; i++) {
        imageData[i * 4] = 255;
        imageData[i * 4 + 1] = 255;
        imageData[i * 4 + 2] = 255;
        imageData[i * 4 + 3] = pid.data[i];
    }
    writePngFileSync("test.png", imageData, options);

    console.log(pid);
} else {
    console.log("Call arguments: PID_PATH.");
}
