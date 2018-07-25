const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');
const Parser = require("binary-parser").Parser;
const streamToBuffer = require('stream-to-buffer')
const pako = require('pako');

const fileName = path.join(__dirname, 'Test1.wwd');

let temp = undefined;

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
 
const wwdPlanesParser = new Parser()
  .array("planeHeaders", {
    type: "wwdPlaneHeader",
    length: "planesCount"
  });
 
app.get('/', function (req, res) {
  const readStream = fs.createReadStream(fileName);
  streamToBuffer(readStream, function (err, buffer) {
    let { rest, ...wwdHeader} = wwdHeaderParser.parse(buffer);
    if (wwdHeader.flags.compressed) {
      rest = Buffer.from(pako.inflate(rest));
    }
    
    const { planeHeaders } = wwdPlanesParser.create(function () { 
      let planesCount = wwdHeader.planesCount;
      return { planesCount: wwdHeader.planesCount }; 
    }).parse(rest);
    
    let mainPlane;
    let planesDataLength = planeHeaders.reduce((sum, plane) => {
      if (plane.flags.mainPlane) mainPlane = plane;
      return sum + plane.headerSize + plane.tilesWide * plane.tilesHigh;
    }, 0);
    
    if (mainPlane.objectsNumber > 0) {
      mainPlane.objects = undefined;
    }
    
    res.json(mainPlane);
  });
});
 
app.listen(3000);