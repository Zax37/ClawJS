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

module.exports = paletteParser;