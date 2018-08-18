Phaser.GameObjects.GameObjectFactory.register('map', function (data)
{
  const mainLayer = data.layers[data.mainLayerIndex];

  const tileSets = {};
  const layersData = data.layers.map(layer => {
    layer.imageSets.forEach(name => {
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

  layersData.forEach(layer => {
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
            : new Phaser.Tilemaps.Tile(layer, tileIndex, x + rx * layer.width, y + ry * layer.height, layer.tileWidth, layer.tileHeight);

          if (tileIndex === layer.properties.fillTileIndex) {
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

  const map = new Phaser.Tilemaps.Tilemap(this.scene, mapData);

  Object.keys(tileSets).forEach(set => {
    tileSets[set] = map.addTilesetImage(`L${data.base}_${set}`, undefined, undefined, undefined, 1, 2);
  });

  layersData.forEach((layer, i) => {
    const {speedX, speedY} = layer.properties;
    layer = map.createDynamicLayer(i, tileSets[layer.properties.imageSet], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    if (i === data.mainLayerIndex) {
      for (let object of data.objects) {
        let imageSetPath = object.imageSet.split("_");
        let set = imageSetPath[0] === 'LEVEL' ? 'LEVEL' + data.base : imageSetPath[0];
        this.scene.add.sprite(
          object.x + CANVAS_WIDTH / 2,
          object.y + CANVAS_HEIGHT / 2,
          set, object.imageSet + 1); // first frame of animation
      }
      let claw = this.scene.add.sprite(data.startX + CANVAS_WIDTH / 2, data.startY + CANVAS_HEIGHT / 2, 'CLAW');
      claw.anims.play('stand');
    }
    layer.scrollFactorX = speedX;
    layer.scrollFactorY = speedY;
  });

  return { map, update: function (camera) {
    layersData.forEach(layer => {
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
});