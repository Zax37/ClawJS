const http = require('http');
const path = require('path');
const fs = require('fs');
const Parser = require("binary-parser").Parser;
const streamToBuffer = require('stream-to-buffer');
const pako = require('pako');

const port = process.env.PORT || 3000;

const fileName = path.join(__dirname, 'db', 'Test1.wwd');

const wwdFlagsParser = new Parser()
  .bit6("reserved")
  .bit1("compressed")
  .bit1("usesZCoords")
  .skip(3);

const wwdHeaderParser = new Parser()
  .endianess("little")
  .uint32("headerSize")
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
  .namely("wwdPlaneHeader")
  .endianess("little")
  .uint32("headerSize")
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
  .namely("wwdObject")
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
  .namely("tileAttribute")
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
    type: "tileAttribute",
    length: "length"
  });
  
const wwdBodyParser = new Parser()
  .array("planeHeaders", {
    type: "wwdPlaneHeader",
    length: "planesCount"
  })
  .buffer("data", { length: function() {
    this.imageSetsNumber = 0;
    return this.planeHeaders.reduce((sum, plane) => {
      this.imageSetsNumber += plane.imageSetsNumber;
      if (plane.flags.mainPlane) this.mainPlane = plane;
      return sum + plane.tilesWide * plane.tilesHigh * 4;
    }, 0);
  }})
  .array("imageSetStrings", {
    type: nullTerminatedStringConsumer,
    length: "imageSetsNumber"
  })
  .array("objects", {
    type: "wwdObject",
    length: "mainPlane.objectsNumber"
  })
  .nest("tileAttributes", { type: wwdTileAttributesParser });

// Start minimal UI endpoint
http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        const readStream = fs.createReadStream(fileName);
        streamToBuffer(readStream, function (err, buffer) {
            let { rest, ...wwdHeader } = wwdHeaderParser.parse(buffer);

            if (wwdHeader.flags.compressed) {
                rest = Buffer.from(pako.inflate(rest));
            }

            const wwdBody = wwdBodyParser.create(function () {
                return { planesCount: wwdHeader.planesCount };
            }).parse(rest);

            wwdBody.tileAttributes.data = wwdBody.tileAttributes.data.map(
                (tile, index) => {
                    tile["id"] = index;
                    return tile;
                }
            ).filter(
                (tile) => {
                    return tile.type !== 1 || tile.atrib !== 0;
                }
            );

            const { data, ...out } = wwdBody;

            res.write(JSON.stringify(out), null, 4);
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(port);