const Parser = require("binary-parser").Parser;

const emptyParser = new Parser();
const soundStringParser = new Parser().string("sound", { encoding: "ascii", zeroTerminated: true });

const frameParser = new Parser()
  .endianess("little")
  .uint16("type") // 2 if there is sound, otherwise 0
  .uint16("unkn2") // usually 3, different in LEVEL_CRATEBREAK
  .uint16("unkn3") // usally 0, 9 in CLAW LIFT2 & EMPTYMAGIC & LOOKUP
  .uint16("unkn4")
  .uint16("i")
  .uint16("time")
  .uint16("unkn5") // usually 0, 1 in dynamiteexplo
  .skip(4)
  .uint16("unkn6") // usually 0, 2 in CLAW LIFT2, 37 in EMPTYMAGIC & LOOKUP & CRATEBREAK, 29236 in LIFTWALK
  .choice({
    tag: "type",
    choices: {
      0: emptyParser,
      2: soundStringParser
    }
  });

const aniParser = new Parser()
  .endianess("little")
  .uint32("magic", { assert: 32 })
  .skip(8)
  .uint32("length")
  .uint32("imageSetStringLength")
  .skip(12)
  .string("imageset", { encoding: "ascii", length: "imageSetStringLength" })
  .array("frames", {
    type: frameParser,
    length: "length"
  });

module.exports = aniParser;
