const Parser = require("binary-parser").Parser;
const pako = require('pako');

const wwdFlagsParser = new Parser()
  .bit6("reserved")
  .bit1("compressed")
  .bit1("usesZCoords")
  .skip(3);

const wwdHeaderParser = new Parser()
  .endianess("little")
  .uint32("headerSize", { assert: 1524 })
  .skip(4)
  .nest("flags", { type: wwdFlagsParser })
  .skip(4)
  .string("name", { encoding: "ascii", length: 64, stripNull: true })
  .string("author", { encoding: "ascii", length: 64, stripNull: true })
  .string("date", { encoding: "ascii", length: 64, stripNull: true })
  .string("rezPath", { encoding: "ascii", length: 256, stripNull: true })
  .string("tilesPath", { encoding: "ascii", length: 128, stripNull: true })
  .string("palettePath", { encoding: "ascii", length: 128, stripNull: true })
  .uint32("startX")
  .uint32("startY")
  .skip(4)
  .uint32("planesCount")
  .uint32("planesStart")
  .uint32("tileAttributesStart")
  .uint32("unpackedSize")
  .uint32("checksume")
  .skip(4)
  .string("clawExePath", { encoding: "ascii", length: 128, stripNull: true })
  .string("imageSet1", { encoding: "ascii", length: 128, stripNull: true })
  .string("imageSet2", { encoding: "ascii", length: 128, stripNull: true })
  .string("imageSet3", { encoding: "ascii", length: 128, stripNull: true })
  .string("imageSet4", { encoding: "ascii", length: 128, stripNull: true })
  .string("prefix1", { encoding: "ascii", length: 32, stripNull: true })
  .string("prefix2", { encoding: "ascii", length: 32, stripNull: true })
  .string("prefix3", { encoding: "ascii", length: 32, stripNull: true })
  .string("prefix4", { encoding: "ascii", length: 32, stripNull: true })
  .buffer("rest", { readUntil: "eof" });

const planeFlagsParser = new Parser()
  .skip(4)
  .bit3("reserved")
  .bit1("autoTileSize")
  .bit1("yWrapping")
  .bit1("xWrapping")
  .bit1("noDraw")
  .bit1("mainPlane")
  .skip(7);

const wwdPlaneHeaderParser = new Parser()
  .endianess("little")
  .uint32("headerSize", { assert: 160 })
  .nest("flags", { type: planeFlagsParser })
  .string("name", { encoding: "ascii", length: 64, stripNull: true })
  .uint32("pxWide")
  .uint32("pxHigh")
  .uint32("tileWidth")
  .uint32("tileHeigh")
  .uint32("tilesWide")
  .uint32("tilesHigh")
  .skip(8)
  .uint32("moveXPercent")
  .uint32("moveYPercent")
  .uint32("fillColor")
  .uint32("imageSetsNumber")
  .uint32("objectsNumber")
  .uint32("tilesPointer")
  .uint32("imageSetsPointer")
  .uint32("objectsPointer")
  .int32("zCoord")
  .skip(12);

const wwdObjectAddFlagsParser = new Parser()
  .skip(1);

const wwdObjectDynamicFlagsParser = new Parser()
  .skip(1);

const wwdObjectDrawFlagsParser = new Parser()
  .skip(1);

const wwdObjectUserFlagsParser = new Parser()
  .skip(2);

const wwdObjectTypeFlagsParser = new Parser()
  .skip(2);

const wwdObjectParser = new Parser()
  .endianess("little")
  .uint32("id")
  .uint32("nameStringLength")
  .uint32("logicStringLength")
  .uint32("imageSetStringLength")
  .uint32("animationStringLength")
  .uint32("x")
  .uint32("y")
  .uint32("z")
  .uint32("frame")
  .nest("addFlags", { type: wwdObjectAddFlagsParser })
  .skip(3)
  .nest("dynamicFlags", { type: wwdObjectDynamicFlagsParser })
  .skip(3)
  .nest("drawFlags", { type: wwdObjectDrawFlagsParser })
  .skip(3)
  .nest("userFlags", { type: wwdObjectUserFlagsParser })
  .skip(2)
  .uint32("score")
  .uint32("points")
  .uint32("powerup")
  .uint32("damage")
  .uint32("smarts")
  .uint32("health")
  .array("moveRect", { type: "uint32le", length: 4 })
  .array("hitRect", { type: "uint32le", length: 4 })
  .array("attackRect", { type: "uint32le", length: 4 })
  .array("clipRect", { type: "uint32le", length: 4 })
  .array("userRect1", { type: "uint32le", length: 4 })
  .array("userRect2", { type: "uint32le", length: 4 })
  .array("userValues", { type: "uint32le", length: 8 })
  .uint32("minX")
  .uint32("minY")
  .uint32("maxX")
  .uint32("maxY")
  .uint32("speedX")
  .uint32("speedY")
  .uint32("tweakX")
  .uint32("tweakY")
  .uint32("counter")
  .uint32("speed")
  .uint32("width")
  .uint32("height")
  .uint32("direction")
  .uint32("faceDir")
  .uint32("timeDelay")
  .uint32("frameDelay")
  .nest("objectType", { type: wwdObjectTypeFlagsParser })
  .skip(2)
  .nest("objectHitType", { type: wwdObjectTypeFlagsParser })
  .skip(2)
  .uint32("moveResX")
  .uint32("moveResY")
  .string("name", { encoding: "ascii", length: "nameStringLength" })
  .string("logic", { encoding: "ascii", length: "logicStringLength" })
  .string("imageSet", { encoding: "ascii", length: "imageSetStringLength" })
  .string("animation", { encoding: "ascii", length: "animationStringLength" });

const nullTerminatedStringConsumer = new Parser().string("text", { encoding: "ascii", zeroTerminated: true });

const wwdTileAttributeParserSingle = new Parser()
  .endianess("little")
  .uint32("atrib");

const wwdTileAttributeParserDouble = new Parser()
  .endianess("little")
  .uint32("outside")
  .uint32("inside")
  .uint32("x1")
  .uint32("y1")
  .uint32("x2")
  .uint32("y2");

const wwdTileAttributeParser = new Parser()
  .endianess("little")
  .uint32("type")
  .skip(4)
  .uint32("width")
  .uint32("height")
  .choice({
    tag: "type",
    choices: {
      1: wwdTileAttributeParserSingle,
      2: wwdTileAttributeParserDouble
    }
  });

const wwdTileAttributesParser = new Parser()
  .endianess("little")
  .skip(8)
  .uint32("length")
  .skip(20)
  .array("data", {
    type: wwdTileAttributeParser,
    length: "length"
  });

const wwdPlaneBodyParser = new Parser()
  .array("data", {
    type: "uint32le",
    length: "dataLength"
  });

const wwdPlaneImageSetsParser = new Parser()
  .array("imageSets", {
    type: nullTerminatedStringConsumer,
    length: "imageSetsNumber",
    formatter: function (array) {
      return array.map(el => el.text);
    }
  });

const wwdBodyParser = new Parser()
  .array("planes", {
    type: wwdPlaneHeaderParser,
    length: "planesCount",
    formatter: function (planes) {
      planes.forEach(plane => {
        if (plane.flags.mainPlane) vars.mainPlane = plane;
        plane.dataLength = plane.tilesWide * plane.tilesHigh;
      }, 0);
      return planes;
    }
  })
  .array("planes", {
    type: wwdPlaneBodyParser,
    length: "planesCount",
    alreadyExists: true,
    formatter: function (planes) {
      console.log(planes);
      planes.map(plane => {
        plane.data = [].concat.apply([],
          plane.data.map(function(data,i) {
            return i%plane.tilesWide ? [] : [plane.data.slice(i,i+plane.tilesWide)];
          })
        );
      });
      return planes;
    }
  })
  .array("planes", {
    type: wwdPlaneImageSetsParser,
    length: "planesCount",
    alreadyExists: true
  })
  .array("objects", {
    type: wwdObjectParser,
    length: "mainPlane.objectsNumber"
  })
  .nest("tileAttributes", {
    type: wwdTileAttributesParser,
    formatter: function (attributes) {
      return attributes.data.map((tile, index) => {
        tile["id"] = index;
        return tile;
      }).filter(tile => {
        return tile.type !== 1 || tile.atrib !== 0;
      });
    }
  });

class WwdParser {
  parse(buffer) {
    let { rest, ...wwdHeader } = wwdHeaderParser.parse(buffer);

    if (wwdHeader.flags.compressed) {
      rest = Buffer.from(pako.inflate(rest));
    }

    const wwdBody = wwdBodyParser.create(function () {
      return { i: 0, planesCount: wwdHeader.planesCount };
    }).parse(rest);

    return { ...wwdHeader, ...wwdBody };
  }
}

module.exports = WwdParser;