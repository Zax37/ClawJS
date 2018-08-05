const config = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
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
let camera, cursors, graphics, map;

function preload ()
{
  this.load.image("BACK", `tilesets/L${level.base}_BACK.png`);
  this.load.image("ACTION", `tilesets/L${level.base}_ACTION.png`);
  this.load.image("FRONT", `tilesets/L${level.base}_FRONT.png`);
}

function create ()
{
  map = this.add.map(level);

  camera = this.cameras.main;
  camera.scrollX = level.startX;
  camera.scrollY = level.startY;
  //camera.centerOn(level.startX, level.startY);

  cursors = this.input.keyboard.createCursorKeys();
  var controlConfig = {
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 1
  };
  controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  graphics = this.add.graphics();
  graphics.fillStyle(0xff0000, 1);
  graphics.fillRect(0, 0, 100, 100);
}

function update (time, delta)
{
  controls.update(delta);
  map.update(camera);
}
