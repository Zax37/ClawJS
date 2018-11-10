import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import logics from "./logics";

export default class MapFactory {
  static parse(scene: Phaser.Scene, data: any) {
    let mainLayer = data.layers[data.mainLayerIndex];

    const tileSets = {};
    const layersData = data.layers.map((layer: any) => {
      layer.imageSets.forEach((name: string) => {
        tileSets[name] = null; // only list tilesets, to load them later
      });
      return new Phaser.Tilemaps.LayerData({
        tileWidth: layer.tileWidth,
        tileHeight: layer.tileHeight,
        width: layer.tilesWide,
        height: layer.tilesHigh,
        widthInPixels: layer.pxWide,
        heightInPixels: layer.pxHigh,
        data: layer.data,
        properties: {
          fillTileIndex: layer.fillTileIndex,
          fillColor: layer.fillColor,
          imageSet: layer.imageSets[0], // currently only one imageset supported
          speedX: layer.moveXPercent / 100,
          speedY: layer.moveYPercent / 100,
          repeatX: layer.flags.xWrapping === 1,
          repeatY: layer.flags.yWrapping === 1,
        }
      })
    });

    const mapData = new Phaser.Tilemaps.MapData({
      name: "map",
      tileWidth: mainLayer.tileWidth,
      tileHeight: mainLayer.tileHeight,
      format: Phaser.Tilemaps.Formats.ARRAY_2D,
      layers: layersData,
      width: mainLayer.tilesWide,
      height: mainLayer.tilesHigh,
      widthInPixels: mainLayer.pxWide,
      heightInPixels: mainLayer.pxHigh
    });

    layersData.forEach((layer: any) => {
      layer.repeatX = layer.properties.repeatX ? 1 + Math.ceil(CANVAS_WIDTH / layer.widthInPixels) : 1;
      layer.repeatY = layer.properties.repeatY ? 1 + Math.ceil(CANVAS_HEIGHT / layer.heightInPixels) : 1;

      const newData = [];
      for (let ry = 0, i = 0; ry < layer.repeatY; ry++, i = 0)
        for (let y = 0; y < layer.height; y++)
        {
          const row = []; let start = i;
          for (let rx = 0; rx < layer.repeatX; rx++) {
            i = start;
            for (let x = 0; x < layer.width; x++, i++) {
              const tileIndex = layer.data[i];
              const tile = tileIndex === -1
                ? null
                : new Phaser.Tilemaps.Tile(layer, tileIndex, x + rx * layer.width, y + ry * layer.height, layer.tileWidth, layer.tileHeight, layer.tileWidth, layer.tileHeight);

              if (tileIndex === layer.properties.fillTileIndex && tile) {
                tile.tint = layer.properties.fillColor;
              }

              row.push(tile);
            }
          }
          newData.push(row);
        }
      layer.data = newData;
      layer.width *= layer.repeatX;
      layer.widthInPixels *= layer.repeatX;
      layer.height *= layer.repeatY;
      layer.heightInPixels *= layer.repeatY;
    });

    const map = new Phaser.Tilemaps.Tilemap(scene, mapData);

    Object.keys(tileSets).forEach(set => {
      tileSets[set] = map.addTilesetImage(`L${data.base}_${set}`, undefined, undefined, undefined, 1, 2);
    });

    let claw;
    let xOffset = CANVAS_WIDTH / 2;
    let yOffset = CANVAS_HEIGHT / 2;

    layersData.forEach((layer: any, i: number) => {
      const {speedX, speedY} = layer.properties;
      layer = map.createDynamicLayer(i, tileSets[layer.properties.imageSet],
        i === data.mainLayerIndex ? 0 : xOffset * (1 - speedX), i === data.mainLayerIndex ? 0 : yOffset * (1 - speedY));
      if (i === data.mainLayerIndex) {
        for (let object of data.objects) {
          let imageSetPath = object.imageSet.split("_");
          let set = imageSetPath[0] === 'LEVEL' ? 'LEVEL' + data.base : imageSetPath[0];

          if (object.imageSet === 'BACK') {
            set = `L${data.base}_BACK`;
            object.imageSet = 0;
          } else
          if (object.imageSet === 'ACTION') {
            set = `L${data.base}_ACTION`;
            object.imageSet = 0;
          } else if (object.imageSet === 'FRONT') {
            set = `L${data.base}_FRONT`;
            object.imageSet = 0;
          }

          let sprite;
          let warn = console.warn;
          let imageNotFound = false;

          console.warn = function() {
            imageNotFound = true;
          };

          const imgSet = object.imageSet;
          object.frame = object.imageSet + (object.frame > 0 ? object.frame : 1); // first frame of animation
          object.imageSet = set;

          if (logics[object.logic]) {
            sprite = new logics[object.logic](scene, object);
          } else {
            sprite = scene.add.sprite(object.x, object.y, object.imageSet, object.frame);
          }

          if (imageNotFound) {
            imageNotFound = false;
            sprite.setFrame(imgSet + 1);
            if (imageNotFound) {
              console.error(`Imageset not found: ${imgSet + 1}. Couldn't fall back to default frame.`);
            }
          }

          if (object.drawFlags) {
            if (object.drawFlags.mirror) {
              sprite.flipX = true;
            }
            if (object.drawFlags.invert) {
              sprite.flipY = true;
            }
          }

          console.warn = warn;
        }
        claw = scene.add.sprite(data.startX, data.startY, 'CLAW');
        claw.anims.play('stand');

        const colliding = data.tileAttributes.map((ta: any, id: number) => ({...ta, id})).filter((ta: any) => ta.type === 1 && ta.atrib === 1).map((ta: any) => ta.id);
        layer.setCollision(colliding);
        mainLayer = layer;
      }
      layer.scrollFactorX = speedX;
      layer.scrollFactorY = speedY;
    });

    return { claw, mainLayer, map, update: function (camera: Phaser.Cameras.Scene2D.Camera) {
      layersData.forEach((layer: any) => {
        if (layer.properties.repeatX) {
          while (camera.scrollX * layer.properties.speedX - layer.tilemapLayer.x + CANVAS_WIDTH > layer.widthInPixels / layer.repeatX) {
            layer.tilemapLayer.x += layer.widthInPixels / layer.repeatX;
          }

          while (camera.scrollX * layer.properties.speedX - layer.tilemapLayer.x + CANVAS_WIDTH < layer.widthInPixels / layer.repeatX) {
            layer.tilemapLayer.x -= layer.widthInPixels / layer.repeatX;
          }
        }

        if (layer.properties.repeatY) {
          while (camera.scrollY * layer.properties.speedY - layer.tilemapLayer.y + CANVAS_HEIGHT > layer.heightInPixels / layer.repeatY) {
            layer.tilemapLayer.y += layer.heightInPixels / layer.repeatY;
          }

          while (camera.scrollY * layer.properties.speedY - layer.tilemapLayer.y + CANVAS_HEIGHT < layer.heightInPixels / layer.repeatY) {
            layer.tilemapLayer.y -= layer.heightInPixels / layer.repeatY;
          }
        }
      });

      //objectsArray.forEach(object => object.logic(object));
    }};
  }
}