import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";

export default class Menu extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private music: Phaser.Sound.BaseSound;

  goToLevel(level: any, replace?: boolean) {
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

  preload() {
    this.load.image("MENU_BG", `screens/MENU.png`);
    this.load.multiatlas('icons', 'icons/icons.json', 'icons');

    this.load.audio('music', [
      `music/MENU.ogg`,
    ]);
  }

  create() {
    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "MENU_BG");
    let icons = [];
    for (let i = 0; i < 15; i++) {
      let x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2;
      if (i === 14) {
        y += 128;
      } else {
        x += i % 7 * 64 - 192;
        y += i >= 7 ? 64 : 0;
      }
      icons.push(this.add.image(x, y, 'icons', `${i + 1}.png`).setInteractive({useHandCursor: true}));
    }

    this.music = this.sound.add('music');
    this.music.play();

    let manager = this;
    icons.forEach((icon, i) => {
      icon.on('pointerover', function (this: Phaser.GameObjects.Image) {
        this.setTint(0xff0000);
      });

      icon.on('pointerout', function (this: Phaser.GameObjects.Image) {
        this.clearTint();
      });

      icon.on('pointerdown', function (this: Phaser.GameObjects.Image) {
        this.setTint(0x660000);
      });

      icon.on('pointerup', function (this: Phaser.GameObjects.Image) {
        manager.music.stop();
        manager.goToLevel(i + 1);
      });
    });

    const el = document.getElementsByTagName("body")[0];
    const requestFullScreen = el.requestFullscreen;

    if (requestFullScreen) {
      el.addEventListener("dblclick", requestFullScreen);
    }
  }
}