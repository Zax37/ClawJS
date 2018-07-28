var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image("mario-tiles", "assets/L1_BACK.png");
}

function create ()
{
  console.log(level);
  const map = this.make.tilemap({ data: level, tileWidth: 64, tileHeight: 64 });
  const tiles = map.addTilesetImage("mario-tiles");
  const layer = map.createStaticLayer(0, tiles, 0, 0);
}

function update ()
{
}

