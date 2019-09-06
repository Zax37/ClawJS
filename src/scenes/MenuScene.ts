import { MouseWheelToUpDown } from 'phaser3-rex-plugins';
import { CANVAS_HEIGHT, CANVAS_WIDTH, GAMEPAD_INTERACTION_DELAY } from '../config';
import { TextWindow } from '../logics/abstract/TextWindow';
import { ChangelogWindow } from '../logics/menu/ChangelogWindow';
import { CreditsWindow } from '../logics/menu/CreditsWindow';
import { MainMenu } from '../menus/MainMenu';
import { SceneWithMenu } from './SceneWithMenu';
import p from '../../package.json';

class UpDownCursors {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
}

export enum MenuSceneState {
  MAIN, CREDITS, HELP
}

export class MenuScene extends SceneWithMenu {
  background: Phaser.GameObjects.Image;
  socialIcons: Phaser.GameObjects.Image[] = [];
  scrollableWindow?: TextWindow;
  version: Phaser.GameObjects.Text;

  keyboardCursors: UpDownCursors;
  scrollCursors: UpDownCursors;

  state: MenuSceneState;

  static key = 'MenuScene';

  constructor() {
    super({ key: MenuScene.key });
  }

  preload() {
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
    this.load.image('MENU_BG', `screens/MENU.png`);
    this.load.image('CREDITS_BG', `screens/CREDITS.png`);
    this.load.image('HELP_BG', `screens/HELP.png`);
    this.load.atlas('social-icons', 'ui/social-icons.png', 'ui/social-icons.json');
    this.load.image('frame', `ui/frame.png`);
    this.load.image('paper', `ui/paper.png`);
    this.load.image('scroll', `ui/scroll.png`);
    this.load.image('accept', `ui/accept.png`);

    this.load.atlas('fonts', 'ui/FONTS.png', 'ui/FONTS.json');
    this.load.xml('REGULAR', 'ui/REGULAR.xml');
    this.load.xml('SELECTED', 'ui/SELECTED.xml');

    this.load.audioSprite('sounds', 'sounds/SOUNDS.json');
    this.load.audio('menu_music', [
      `music/MENU.ogg`,
    ]);
  }

  update(time: number, delta: number) {
    if (this.scrollableWindow) {
      if (this.keyboardCursors.up.isDown) {
        this.scrollableWindow.scrollUp();
      } else if (this.keyboardCursors.down.isDown) {
        this.scrollableWindow.scrollDown();
      } else if (this.input.gamepad.total && time > this.lastPadInteraction + GAMEPAD_INTERACTION_DELAY) {
        for (let i = 0; i < this.input.gamepad.total; i++) {
          const pad = this.input.gamepad.getPad(i);

          if (pad.up || pad.leftStick.y < -0.1) {
            this.scrollableWindow.scrollUp();
          } else if (pad.down || pad.leftStick.y > 0.1) {
            this.scrollableWindow.scrollDown();
          } else if (pad.A || pad.B) {
            this.scrollableWindow.destroy();
            this.lastPadInteraction = time;
          }
        }
      }
    } else {
      super.update(time, delta);
    }
  }

  create() {
    this.state = MenuSceneState.MAIN;
    this.keyboardCursors = this.input.keyboard.createCursorKeys() as UpDownCursors;
    this.scrollCursors = new MouseWheelToUpDown(this).createCursorKeys() as UpDownCursors;
    this.scrollCursors.up.onDown = () => this.scrollableWindow && this.scrollableWindow.scrollUp();
    this.scrollCursors.down.onDown = () => this.scrollableWindow && this.scrollableWindow.scrollDown();
    this.sound.pauseOnBlur = false;
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'regular', 'fonts', 'MENU_DEFAULT.png', 'REGULAR');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'selected', 'fonts', 'MENU_SELECTED.png', 'SELECTED');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'disabled', 'fonts', 'MENU_DISABLED.png', 'REGULAR');

    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'MENU_BG');
    this.createSocialIcons();

    this.version = this.add.text(CANVAS_WIDTH - 48, CANVAS_HEIGHT - 32, p.version, { font: '12px Arial', fill: '#ffffff' }).setOrigin(1, 1);
    this.version.setPadding(20, 24, 20, 24);
    this.version.setInteractive({ useHandCursor: true });

    this.menu = new MainMenu(this);
    this.version.on('pointerup', () => this.openPopup(new ChangelogWindow(this)));
    this.game.soundsManager.setScene(this);
    if (this.game.dataManager.get('lastPlayedVersion') !== p.version || p.version.endsWith('-RC')) {
      this.game.dataManager.set('lastPlayedVersion', p.version);
      this.openPopup(new ChangelogWindow(this));
    }

    /*let icons: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 15; i++) {
      let x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2;
      if (i === 14) {
        y += 128;
      } else {
        x += i % 7 * 64 - 192;
        y += i >= 7 ? 64 : 0;
      }
      icons.push(this.add.image(x, y, 'icons', `${i + 1}.png`).setInteractive({ useHandCursor: true }));
    }*/

    this.game.soundsManager.setScene(this);
    this.game.musicManager.play(this.sound.add('menu_music'));
    super.create();
  }

  menuConfirm() {
    if (this.scrollableWindow) {
      this.scrollableWindow.destroy();
    } else if (!this.menu.disabled) {
      super.menuConfirm();
    } else {
      this.setState(MenuSceneState.MAIN);
    }
  }

  menuBack() {
    if (this.scrollableWindow) {
      this.scrollableWindow.destroy();
    } else if (!this.menu.disabled) {
      super.menuBack();
    } else {
      this.setState(MenuSceneState.MAIN);
    }
  }

  setState(state: MenuSceneState) {
    switch (state) {
      case MenuSceneState.CREDITS:
        this.background.setTexture('CREDITS_BG');
        this.setSocialIconsVisible(true);
        break;
      case MenuSceneState.HELP:
        this.background.setTexture('HELP_BG');
        break;
      case MenuSceneState.MAIN:
        this.background.setTexture('MENU_BG');
        this.setSocialIconsVisible(false);
        this.menu.show();
        break;
      default:
        break;
    }
    this.state = state;
    this.menu.disabled = state !== MenuSceneState.MAIN;
  }

  createSocialIcons() {
    [
      { icon: 'facebook', url: 'https://www.facebook.com/Zax37' },
      { icon: 'twitter', url: 'https://twitter.com/Crew37Zax' },
      { icon: 'youtube', url: 'https://www.youtube.com/channel/UCyj4Zn9wuIfOVz547rtXLJw' },
      { icon: 'twitch', url: 'https://www.twitch.tv/zax37' },
      { icon: 'discord', url: 'https://discordapp.com/users/185756278335864833' },
    ].forEach((social, i) => {
      const image = this.add.image(CANVAS_WIDTH / 2 - 50 + i * 48, CANVAS_HEIGHT / 2 + 84, 'social-icons', social.icon);
      image.setScale(0.5, 0.5);
      image.visible = false;
      image.setInteractive({ useHandCursor: true });

      image.on('pointerover', () => image.setTint(0xcc3737));
      image.on('pointerout', () => image.clearTint());
      image.on('pointerdown', () => image.setTint(0x370000));

      image.on('pointerup', () => {
        window.open(social.url, '_blank');
        image.clearTint();
      });

      this.socialIcons.push(image);
    });
  }

  setSocialIconsVisible(on: boolean) {
    this.socialIcons.forEach((icon) => icon.visible = on);
  }

  openPopup(popupWindow: CreditsWindow) {
    if (!this.scrollableWindow) {
      this.version.disableInteractive();
      this.menu.disabled = true;
      this.scrollableWindow = popupWindow;
      this.scrollableWindow.once('destroy', () => {
        this.scrollableWindow = undefined;
        this.menu.disabled = this.state !== MenuSceneState.MAIN;
        this.version.setInteractive({ useHandCursor: true });
      });
    }
  }
}
