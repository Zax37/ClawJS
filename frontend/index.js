const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
let camera, cursors;

function preload ()
{
  this.load.image("mario-tiles", "assets/L1_ACTION.png");
}

function create ()
{
  const map = this.make.tilemap({ data: level, tileWidth: 64, tileHeight: 64 });
  const tiles = map.addTilesetImage("mario-tiles");
  const layer = map.createStaticLayer(0, tiles, 0, 0);

  camera = this.cameras.main;
  camera.centerOn(startX, startY);

  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  // Horizontal movement
  if (cursors.left.isDown) {
    camera._scrollX -= 5;
  } else if (cursors.right.isDown) {
    camera._scrollX += 5;
  }

  // Vertical movement
  if (cursors.up.isDown) {
    camera._scrollY -= 5;
  } else if (cursors.down.isDown) {
    camera._scrollY += 5;
  }
}

