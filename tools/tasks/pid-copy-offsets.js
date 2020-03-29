const fs = require('fs');
const path = require('path');
const PidParser = require("../parsers/pid-parser");

if (process.argv[2] && process.argv[3]) {
  const jsonPath = path.resolve(process.argv[2]);
  const imgSetPath = path.resolve(process.argv[3]);

  const data = JSON.parse(fs.readFileSync(jsonPath));
  const pidParser = new PidParser();

  for (const frame of data.frames) {
    const pidPath = path.join(imgSetPath, frame.filename.replace(/_/g, "\\") + ".PID");
    const pid = pidParser.parse(fs.readFileSync(pidPath));
    frame.offset = {x: pid.offsetX, y: pid.offsetY};
  }

  if (data.meta) delete data.meta;
  fs.writeFileSync(jsonPath, JSON.stringify(data));
} else {
  console.log("Call arguments: TARGET_JSON_PATH, SOURCE_IMAGESET_PATH.");
}
