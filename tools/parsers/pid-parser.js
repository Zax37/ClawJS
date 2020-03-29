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
  .int32("reserved2")
  .buffer("rest", { readUntil: "eof" });

class PidParser {
    parse(buffer) {
        const { rest, ...pid } = pidParser.parse(buffer);
        pid.data = Buffer.alloc(pid.width * pid.height);

        let x = 0, y = 0;
        if (pid.flags.compression) {
            for (let i = 0; i < rest.length;) {
                let num = rest.readUInt8(i++);
                if (num > 128) {
                    let spacing = num - 128;
                    for (let iter = 0; iter < spacing; iter++) {
                        pid.data[y * pid.width + x++] = 0;
                        if (x === pid.width) break;
                    }
                    if (x === pid.width) {
                        x = 0;
                        y++;
                    }
                    if (y >= pid.height) break;
                    continue;
                }
                for (let j = 0; j < num; j++) {
                    pid.data[y * pid.width + x++] = rest.readUInt8(i++);
                    if (x === pid.width) {
                        x = 0;
                        y++;
                    }
                    if (y >= pid.height) break;
                }
                if (y >= pid.height) break;
            }
        } else {
            for (let i = 0; i < rest.length;) {
                let num, pixel = rest.readUInt8(i++);
                if (pixel > 192) {
                    num = pixel - 192;
                    pixel = rest.readUInt8(i++);
                    pid.data[y * pid.width + x] = pixel;
                } else {
                    num = 1;
                }
                for (let j = 0; j < num; j++) {
                    pid.data[y * pid.width + x] = pixel;
                    x++;
                    if (x === pid.width) {
                        x = 0;
                        y++;
                    }
                    if (y >= pid.height) break;
                }
                if (y >= pid.height) break;
            }
        }

        return pid;
    }
}

module.exports = PidParser;
