const fs = require('fs');
const Parser = require("binary-parser").Parser;

const pidParser = new Parser()
  .endianess("little")
  .uint32("fileDesc")
  .uint32("flags")
  .uint32("width")
  .uint32("height")
  .int32("offsetX")
  .int32("offsetY");

module.exports = pidParser;
