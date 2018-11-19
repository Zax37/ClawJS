import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../config";
import logics from "../logics/index";
import Tile from "./Tile";
import CaptainClaw from "../logics/CaptainClaw";
import MapDisplay from "../scenes/MapDisplay";

export default class MapFactory {
  static parse(scene: MapDisplay, data: any) {
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
          z: layer.zCoord,
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

    layersData.forEach((layer: any, index: number) => {
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

              row.push(tileIndex === -1
                ? null
                : new Tile(layer, tileIndex, x + rx * layer.width, y + ry * layer.height,
                    layer.tileWidth, layer.tileHeight, index === data.mainLayerIndex ? data.tileAttributes[tileIndex] : null));

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
      const { speedX, speedY, z } = layer.properties;
      layer = map.createDynamicLayer(i, tileSets[layer.properties.imageSet],
        i === data.mainLayerIndex ? 0 : xOffset * (1 - speedX), i === data.mainLayerIndex ? 0 : yOffset * (1 - speedY));
      layer.depth = z;
      if (i === data.mainLayerIndex) {
        const colliding = data.tileAttributes
          .map((ta: any, id: number) => ({...ta, id}))
          .filter((ta: any) => ta.atrib === 1)
          .map((ta: any) => ta.id);
        layer.setCollision(colliding);

        claw = new CaptainClaw(scene, layer, {
          x: data.startX,
          y: data.startY,
          imageSet: 'CLAW',
        });

        for (let objectData of data.objects) {
          let imageSetPath = objectData.imageSet.split("_");
          let texture = imageSetPath[0] === 'LEVEL' ? 'LEVEL' + data.base : imageSetPath[0];

          objectData.image = objectData.imageSet;

          if (objectData.imageSet === 'BACK') {
            texture = `L${data.base}_BACK`;
            objectData.image = 0;
          } else
          if (objectData.imageSet === 'ACTION') {
            texture = `L${data.base}_ACTION`;
            objectData.image = 0;
          } else if (objectData.imageSet === 'FRONT') {
            texture = `L${data.base}_FRONT`;
            objectData.image = 0;
          }

          let object;
          let warn = console.warn;
          let imageNotFound = false;

          console.warn = function() {
            imageNotFound = true;
          };

          if (objectData.frame <= 0) {
            objectData.frame = 1; // first frame of animation
          }

          if (logics[objectData.logic]) {
            objectData.texture = texture;
            object = new logics[objectData.logic](scene, layer, objectData);
          } else {
            object = scene.add.sprite(objectData.x, objectData.y, texture, objectData.image + objectData.frame);
          }

          if (object) {
            if (objectData.z) {
              object.depth = objectData.z;
            }

            if (imageNotFound) {
              imageNotFound = false;
              object.setFrame(objectData.image + 1);
              if (imageNotFound) {
                console.error(`Imageset not found: ${objectData.image + 1}. Couldn't fall back to default frame.`);
              }
            }

            if (objectData.drawFlags) {
              if (objectData.drawFlags.mirror) {
                object.flipX = true;
              }
              if (objectData.drawFlags.invert) {
                object.flipY = true;
              }
            }
          }

          console.warn = warn;
        }
        mainLayer = layer;
      }
      layer.scrollFactorX = speedX;
      layer.scrollFactorY = speedY;
    });

    return { map, mainLayer, update: function (camera: Phaser.Cameras.Scene2D.Camera) {
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
    }};
  }
}