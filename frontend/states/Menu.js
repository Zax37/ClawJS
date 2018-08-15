class Menu extends Phaser.Scene {
  constructor () {
    super({key: "Menu"});
  }

  init (backFromGame)
  {
    if (backFromGame === true) {
      //this.scene.stop("MapDisplay");
    }
  }

  preload ()
  {
    this.load.image("MENU_BG", `screens/MENU.png`);
    for (let i = 1; i <= 14; i++) {
      this.load.image(`L${i}`, `icons/${i}.png`);
    }
  }

  create ()
  {
    camera = this.cameras.main;
    this.image = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "MENU_BG");
    let icons = [];
    for (let i = 0; i < 14; i++) {
      icons.push(this.add.image(
        CANVAS_WIDTH / 2 - 192 + (i%7 * 64),
        CANVAS_HEIGHT / 2 + (i>=7 ? 32 : -32),
        `L${i+1}`
      ).setInteractive({ useHandCursor: true }));
    }

    let manager = this;
    icons.forEach((icon, i) => {
      icon.on('pointerover', function () {
        this.setTint(0xff0000);
      });

      icon.on('pointerout', function () {
        this.clearTint();
      });

      icon.on('pointerdown', function () {
        manager.scene.start("MapDisplay", i + 1);
      });
    });

    window.addEventListener('resize', resize);
    const el = document.getElementsByTagName("body")[0];
    const requestFullScreen = el.requestFullscreen || el.msRequestFullscreen
      || el.mozRequestFullScreen || el.webkitRequestFullscreen;

    if(requestFullScreen)
    {
      el.addEventListener("dblclick", requestFullScreen);
    }
  }
}