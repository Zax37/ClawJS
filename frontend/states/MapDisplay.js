let cursors, controls, graphics, map, manager;

class MapDisplay extends Phaser.Scene {
  constructor () {
    super({key: "MapDisplay"});
  }

  preload ()
  {
    manager = this;
    this.load.json('level', `maps/RETAIL${level}.json`);
    this.load.image("BACK", `tilesets/L${level}_BACK.png`);
    this.load.image("ACTION", `tilesets/L${level}_ACTION.png`);
    this.load.image("FRONT", `tilesets/L${level}_FRONT.png`);
  }

  create ()
  {
    level = this.cache.json.get('level');
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

    /*graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 100, 100);*/

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
  }

  update (time, delta)
  {
    controls.update(delta);
    map.update(camera);
  }

}