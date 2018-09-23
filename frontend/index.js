const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const config = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  scene: [ Menu, MapDisplay ],
  parent: 'game',
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 100 }
    }
  }
};

const game = new Phaser.Game(config);
