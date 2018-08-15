let camera, cursors, controls, graphics;

class MapDisplay extends Phaser.Scene {
  constructor () {
    super({key: "MapDisplay"});
  }

  init (baseLevel)
  {
    this.baseLevel = baseLevel;
    this.level = null;
    this.map = null;
  }

  preload ()
  {
    this.load.json(`level${this.baseLevel}`, `maps/RETAIL${this.baseLevel}.json`);
    this.load.image(`L${this.baseLevel}_BACK`, `tilesets/L${this.baseLevel}_BACK.png`);
    this.load.image(`L${this.baseLevel}_ACTION`, `tilesets/L${this.baseLevel}_ACTION.png`);
    this.load.image(`L${this.baseLevel}_FRONT`, `tilesets/L${this.baseLevel}_FRONT.png`);
    this.load.atlas('CLAW', 'imagesets/CLAW.png', 'imagesets/CLAW.json');
  }

  create ()
  {
    this.level = this.cache.json.get(`level${this.baseLevel}`);
    this.map = this.add.map(this.level);
    camera = this.cameras.main;
    camera.scrollX = this.level.startX;
    camera.scrollY = this.level.startY;
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

    /*
    graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(camera.scrollX + CANVAS_WIDTH / 2 - 50, camera.scrollY + CANVAS_HEIGHT / 2 - 70, 100, 140);
     */

    this.anims.create({
      key: 'stand',
      frames: this.anims.generateFrameNames('CLAW', { prefix: 'FRAME', start: 11, end: 18, zeroPad: 3, suffix: '.png' }),
      frameRate: 10,
      repeat: -1
    });

    let claw = this.add.sprite(camera.scrollX + CANVAS_WIDTH / 2, camera.scrollY + CANVAS_HEIGHT / 2, 'CLAW');
    claw.anims.play('stand');

    let manager = this;

    let drag = false;
    this.input.on('pointerdown', function (pointer) {
      drag = {
        startX: pointer.position.x,
        startY: pointer.position.y,
        cameraX: camera.scrollX,
        cameraY: camera.scrollY
      };
    });

    this.input.on('pointerup', function () {
      drag = false;
    });

    this.input.on('pointermove', function (pointer) {
      if (drag) {
        camera.scrollX = drag.cameraX + drag.startX - pointer.position.x;
        camera.scrollY = drag.cameraY + drag.startY - pointer.position.y;
      }
    });

    this.input.keyboard.on('keydown_ESC', function() {
      manager.scene.start("Menu", true);
    });
  }

  update (time, delta)
  {
    controls.update(delta);
    if (this.map) {
      this.map.update(camera);
    }
  }

}