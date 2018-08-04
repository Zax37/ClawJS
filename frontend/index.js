const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  }
};

const game = new Phaser.Game(config);
let camera, cursors, graphics;

function preload ()
{
  this.load.image("BACK", `tilesets/L${level.base}_BACK.png`);
  this.load.image("ACTION", `tilesets/L${level.base}_ACTION.png`);
  this.load.image("FRONT", `tilesets/L${level.base}_FRONT.png`);
}

function repeatX(data) {
  return data.map(chunk => [
    ...chunk, ...chunk
  ])
}

function repeatY(data) {
  return [
    ...data,
    ...data
  ]
}

let layer1, layer3;

function create ()
{
  const map1 = this.make.tilemap({ data: repeatX(repeatY(level.layers[0].data)), tileWidth: 64, tileHeight: 64 });
  const map2 = this.make.tilemap({ data: level.layers[1].data, tileWidth: 64, tileHeight: 64 });
  const map3 = this.make.tilemap({ data: repeatX(level.layers[2].data), tileWidth: 64, tileHeight: 64 });

  //generateTexture( [resolution] [, scaleMode], renderer)
  //const image0 = this.add.tileSprite(400, 300, 800, 600, 'image0');

  const tiles1 = map1.addTilesetImage("BACK", undefined, undefined, undefined, 1, 2);
  const tiles2 = map2.addTilesetImage("ACTION", undefined, undefined, undefined, 1, 2);
  const tiles3 = map3.addTilesetImage("FRONT", undefined, undefined, undefined, 1, 2);

  layer1 = map1.createStaticLayer(0, tiles1, 0, 0);
  const layer2 = map2.createStaticLayer(0, tiles2, 0, 0);
  layer3 = map3.createStaticLayer(0, tiles3, 0, 0);

  console.log(layer1);
  //map1.destroy();

  camera = this.cameras.main;
  camera.centerOn(level.startX, level.startY);

  layer1.x = 160; layer1.y = 120;
  layer1.scrollFactorX  = 0.5;
  layer1.scrollFactorY  = 0.5;

  layer3.x = -160; layer3.y = -70;
  layer3.scrollFactorX  = 1.5;
  layer3.scrollFactorY  = 1.25;

  cursors = this.input.keyboard.createCursorKeys();

  graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 1);
  graphics.fillRect(0, 0, 100, 100);
}

function update ()
{
  // Horizontal movement
  if (cursors.left.isDown) {
    camera._scrollX -= 15;
  } else if (cursors.right.isDown) {
    camera._scrollX += 15;
  }

  // Vertical movement
  if (cursors.up.isDown) {
    camera._scrollY -= 15;
  } else if (cursors.down.isDown) {
    camera._scrollY += 15;
  }

  layer1.x = Math.floor(camera._scrollX * 2 * layer1.scrollFactorX / (layer1.width)) * layer1.width / 2;
  layer1.y = Math.floor(camera._scrollY * 2 * layer1.scrollFactorY / (layer1.height)) * layer1.height / 2;
  layer3.x = Math.floor(camera._scrollX * 2 * layer3.scrollFactorX / (layer3.width)) * layer3.width / 2;
}
