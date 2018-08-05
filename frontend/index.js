const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const config = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  scene: [ Menu, MapDisplay ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  autoResize: true
};

const game = new Phaser.Game(config);
let camera, level;

function resize() {
  game.resize(document.body.clientWidth, document.body.clientHeight);
  camera.x = (document.body.clientWidth - CANVAS_WIDTH) / 2;
  camera.y = (document.body.clientHeight - CANVAS_HEIGHT) / 2;
}
