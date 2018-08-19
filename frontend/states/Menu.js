class Menu extends Phaser.Scene {
  constructor () {
    super({key: "Menu"});
  }

  goToLevel(level, replace) {
    if (replace) {
      history.replaceState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    } else {
      history.pushState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    }
    this.scene.start("MapDisplay", level);

    if (this.music) {
      this.music.stop();
    }
  }

  init ()
  {
    if(window.location.hash && window.location.hash.startsWith('#RETAIL')) {
      let level = parseInt(window.location.hash.match(/([^0-9]*)([0-9]*).*$/)[2]);
      if (level >= 1 && level <=15) {
        this.goToLevel(level, true);
      } else {
        console.error("Level " + level + " does not exist.")
      }
    } else {
      history.replaceState(null, 'ClawJS Menu', '.');
    }
  }

  preload ()
  {
    this.load.image("MENU_BG", `screens/MENU.png`);
    this.load.multiatlas('icons', 'icons/icons.json', 'icons');

    this.load.audio('music', [
      `music/MENU.ogg`,
    ]);
  }

  create ()
  {
    this.image = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "MENU_BG");
    let icons = [];
    for (let i = 0; i < 15; i++) {
      let x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2;
      if (i === 14) {
        y += 128;
      } else {
        x += i%7 * 64 - 192;
        y += i>=7 ? 64 : 0;
      }
      icons.push(this.add.image(x, y, 'icons', `${i+1}.png`).setInteractive({ useHandCursor: true }));
    }

    let music = this.music = this.sound.add('music');
    this.music.play();

    let manager = this;
    icons.forEach((icon, i) => {
      icon.on('pointerover', function () {
        this.setTint(0xff0000);
      });

      icon.on('pointerout', function () {
        this.clearTint();
      });

      icon.on('pointerdown', function () {
        this.setTint(0x660000);
      });

      icon.on('pointerup', function () {
        music.stop();
        manager.goToLevel(i + 1);
      });
    });

    const el = document.getElementsByTagName("body")[0];
    const requestFullScreen = el.requestFullscreen || el.msRequestFullscreen
      || el.mozRequestFullScreen || el.webkitRequestFullscreen;

    if(requestFullScreen)
    {
      el.addEventListener("dblclick", requestFullScreen);
    }
  }
}