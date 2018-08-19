const Parser = require("binary-parser").Parser;
const pako = require('pako');
const path = require('path');
const fs = require('fs');

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
  .string("name", {
    encoding: "ascii", length: 64, stripNull: true,
    assert: function (name) {
      vars.baseLevel = parseInt(name.match(/([^0-9]*)([0-9]*).*$/)[2]);
      return vars.baseLevel > 0 && vars.baseLevel <= 14;
    }
  })
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
  .uint32("tileHeight")
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
  .bit2("reserved")
  .bit1("fastCPU")
  .bit1("extraMemory")
  .bit1("multiplayer")
  .bit1("highDetail")
  .bit1("eyeCandy")
  .bit1("difficult");

const wwdObjectDynamicFlagsParser = new Parser()
  .bit4("reserved")
  .bit1("autoHitDamage")
  .bit1("safe")
  .bit1("alwaysActive")
  .bit1("noHit");

const wwdObjectDrawFlagsParser = new Parser()
  .bit4("reserved")
  .bit1("flash")
  .bit1("invert")
  .bit1("mirror")
  .bit1("noDraw")
  ;

const wwdObjectUserFlagsParser = new Parser()
  .bit4("reserved")
  .bit1("userFlag12")
  .bit1("userFlag11")
  .bit1("userFlag10")
  .bit1("userFlag9")
  .bit1("userFlag8")
  .bit1("userFlag7")
  .bit1("userFlag6")
  .bit1("userFlag5")
  .bit1("userFlag4")
  .bit1("userFlag3")
  .bit1("userFlag2")
  .bit1("userFlag1");

const wwdObjectTypeFlagsParser = new Parser()
  .bit4("reserved")
  .bit1("user4")
  .bit1("user3")
  .bit1("user2")
  .bit1("user1")
  .bit1("special")
  .bit1("eshot")
  .bit1("pshot")
  .bit1("shot")
  .bit1("powerup")
  .bit1("enemy")
  .bit1("player")
  .bit1("generic");

const wwdObjectParser = new Parser()
  .endianess("little")
  .uint32("id")
  .uint32("nameStringLength")
  .uint32("logicStringLength")
  .uint32("imageSetStringLength")
  .uint32("animationStringLength")
  .uint32("x")
  .uint32("y")
  .int32("z")
  .int32("frame")
  .nest("addFlags", { type: wwdObjectAddFlagsParser })
  .skip(3)
  .nest("dynamicFlags", { type: wwdObjectDynamicFlagsParser })
  .skip(3)
  .nest("drawFlags", { type: wwdObjectDrawFlagsParser })
  .skip(3)
  .nest("userFlags", { type: wwdObjectUserFlagsParser })
  .skip(2)
  .int32("score")
  .int32("points")
  .int32("powerup")
  .int32("damage")
  .int32("smarts")
  .int32("health")
  .array("moveRect", { type: "int32le", length: 4 })
  .array("hitRect", { type: "int32le", length: 4 })
  .array("attackRect", { type: "int32le", length: 4 })
  .array("clipRect", { type: "int32le", length: 4 })
  .array("userRect1", { type: "int32le", length: 4 })
  .array("userRect2", { type: "int32le", length: 4 })
  .array("userValues", { type: "int32le", length: 8 })
  .uint32("minX")
  .uint32("minY")
  .uint32("maxX")
  .uint32("maxY")
  .int32("speedX")
  .int32("speedY")
  .int32("tweakX")
  .int32("tweakY")
  .int32("counter")
  .int32("speed")
  .int32("width")
  .int32("height")
  .int32("direction")
  .int32("faceDir")
  .int32("timeDelay")
  .int32("frameDelay")
  .nest("objectType", { type: wwdObjectTypeFlagsParser })
  .skip(2)
  .nest("objectHitType", { type: wwdObjectTypeFlagsParser })
  .skip(2)
  .int32("moveResX")
  .int32("moveResY")
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
    alreadyExists: true
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