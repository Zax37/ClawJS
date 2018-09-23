let camera, claw, cursors, controls, graphics, gameAnimsLoaded = false, goToMenu = false;

class MapDisplay extends Phaser.Scene {
  constructor () {
    super({key: "MapDisplay"});
  }

  init (level)
  {
    this.level = level;
    this.baseLevel = level === 15 ? 9 : level;
    this.map = null;
  }

  preload ()
  {
    this.load.json(`level${this.level}`, `maps/RETAIL${this.level}.json`);
    this.load.spritesheet(`L${this.baseLevel}_BACK`, `tilesets/L${this.baseLevel}_BACK.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.spritesheet(`L${this.baseLevel}_ACTION`, `tilesets/L${this.baseLevel}_ACTION.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.spritesheet(`L${this.baseLevel}_FRONT`, `tilesets/L${this.baseLevel}_FRONT.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.atlas('CLAW', 'imagesets/CLAW.png', 'imagesets/CLAW.json');
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
    this.load.atlas(
      'LEVEL' + this.baseLevel,
      `imagesets/LEVEL${this.baseLevel}.png`,
      `imagesets/LEVEL${this.baseLevel}.json`
    );

    this.load.audio(`L${this.baseLevel}_MUSIC`, [
      `music/LEVEL${this.baseLevel}.ogg`,
    ]);

    let manager = this;
    this.load.on('complete', function () {
      /*
       * global animations should be created only once after loading first level,
       * they live even after leaving this scene and are same for all levels
       */
      if (!gameAnimsLoaded) {
        gameAnimsLoaded = true;

        manager.anims.create({
          key: 'stand',
          frames: manager.anims.generateFrameNames('CLAW',
            {prefix: 'CLAW_', start: 11, end: 18}),
          frameRate: 10,
          repeat: -1
        });
      }
    });
  }

  create ()
  {
    this.level = this.cache.json.get(`level${this.level}`);
    this.map = this.add.map(this.level);
    camera = this.cameras.main;
    //camera.scrollX = this.level.startX;
    //camera.scrollY = this.level.startY;
    camera.centerOn(this.level.startX, this.level.startY);

    claw = this.map.claw;
    this.physics.add.existing(claw, false);
    this.physics.add.collider(claw, this.map.mainLayer);
    claw.body.setSize(32, 112, -16, -52); //32, 50, -16, 10 for crouching
    claw.body.velocity.y = -100;

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
    this.map.mainLayer.renderDebug(graphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    });

    // graphics.fillStyle(0xff0000, 1);
    // graphics.fillRect(camera.scrollX + CANVAS_WIDTH / 2 - 50, camera.scrollY + CANVAS_HEIGHT / 2 - 70, 100, 140);
    // this.anims.create({
    //   key: 'run',
    //   frames: this.anims.generateFrameNames('CLAW', { prefix: 'FRAME', start: 1, end: 10, zeroPad: 3, suffix: '.png' }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    //
    // this.anims.create({
    //   key: 'boom',
    //   frames: this.anims.generateFrameNames('GAME', { prefix: 'DYNAMITEEXPLO/FRAME', start: 1, end: 18, zeroPad: 2, suffix: '.png' }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    //
    // let claw = this.add.sprite(camera.scrollX + CANVAS_WIDTH / 2, camera.scrollY + CANVAS_HEIGHT / 2, 'CLAW');
    // claw.anims.play('run');
    //
    // boom.anims.play('boom');

    this.music = this.sound.add(`L${this.baseLevel}_MUSIC`);
    this.music.play();

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

    function backToMenu() {
      goToMenu = true;
    }

    this.input.keyboard.on('keydown_ESC', function() {
      history.back();
    });
    window.addEventListener('popstate', backToMenu);
  }

  update (time, delta)
  {
    controls.update(delta);
    if (this.map) {
      this.map.update(camera);
    }
    if (goToMenu) {
      goToMenu = false;
      this.scene.start("Menu");
      this.music.stop();
    }
  }
}