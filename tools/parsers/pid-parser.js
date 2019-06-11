const Parser = require("binary-parser").Parser;
const path = require('path');
const fs = require('fs');

const pidFlagsParser = new Parser()
    .bit1("ownPalette")
    .bit1("lights")
    .bit1("compression")
    .bit1("invert")
    .bit1("mirror")
    .bit1("systemMemory")
    .bit1("videoMemory")
    .bit1("transparency")
    .skip(3);

const pidParser = new Parser()
  .endianess("little")
  .uint32("fileDesc")
  .nest("flags", {
      type: pidFlagsParser,
  })
  .uint32("width")
  .uint32("height")
  .int32("offsetX")
  .int32("offsetY")
  .int32("reserved1")
  .int32("reserved2");

class PidParser {
    parse(buffer) {
        return pidParser.parse(buffer);
    }
}

if (process.argv[2]) {
    const pidPath = path.resolve(process.argv[2]);

    const pidParser = new PidParser();
    const pidFile = pidParser.parse(fs.readFileSync(pidPath));

    console.log(pidFile);
} else {
    console.log("Call arguments for pidParser: PID_FILE_PATH.")
}

module.exports = pidParser;
