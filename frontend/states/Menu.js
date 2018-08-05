let camera, level;

class Menu extends Phaser.Scene {
  constructor () {
    super({key: "Menu"});
  }

  resize() {
    game.resize(document.body.clientWidth, document.body.clientHeight);
    camera.x = (document.body.clientWidth - CANVAS_WIDTH) / 2;
    camera.y = (document.body.clientHeight - CANVAS_HEIGHT) / 2;
  }

  preload ()
  {
    this.load.image("MENU_BG", `screens/MENU.png`);
    this.load.image("L1", `icons/1.png`);
    this.load.image("L2", `icons/2.png`);
    this.load.image("L3", `icons/3.png`);
  }

  create ()
  {
    camera = this.cameras.main;
    this.resize();
    this.image = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "MENU_BG");
    let icon1 = this.add.sprite(CANVAS_WIDTH / 2 - 64, CANVAS_HEIGHT / 2, "L1").setInteractive(),
        icon2 = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "L2").setInteractive(),
        icon3 = this.add.image(CANVAS_WIDTH / 2 + 64, CANVAS_HEIGHT / 2, "L3").setInteractive();

    let manager = this;
    [icon1, icon2, icon3].forEach((icon, i) => {
      icon.on('pointerover', function (event) {
        this.setTint(0xff0000);
      });

      icon.on('pointerout', function (event) {
        this.clearTint();
      });

      icon.on('pointerdown', function (event) {
        this.setTint(0x00ff00);
        level = i + 1;
        manager.scene.start("MapDisplay");
      });
    });

    window.addEventListener('resize', this.resize);
    const el = document.getElementsByTagName("body")[0];
    const requestFullScreen = el.requestFullscreen || el.msRequestFullscreen
      || el.mozRequestFullScreen || el.webkitRequestFullscreen;

    if(requestFullScreen)
    {
      el.addEventListener("click", requestFullScreen);
    }
  }
}