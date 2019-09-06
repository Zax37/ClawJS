import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import { ImageCounter } from '../logics/main/ImageCounter';
import { InGameMenu } from '../menus/InGameMenu';
import { WeaponType } from '../model/WeaponType';
import { MapDisplay } from './MapDisplay';
import { SceneWithMenu } from './SceneWithMenu';

const TEXT_FONT = '12px "Lucida Console", Monaco, monospace';

export class GameHUD extends SceneWithMenu {
  static key = 'GameHUD';

  mapDisplay: MapDisplay;
  private cheatText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text;
  private powerupFrame: ImageCounter;
  powerupTime: number;
  private centerTextTime: number;
  private fade: Phaser.GameObjects.Rectangle;
  private level: number;
  showFPS = false;

  constructor() {
    super({ key: GameHUD.key });
  }

  init(level: number) {
    this.level = level;
  }

  preload() {
    this.load.image(`LOADING${this.level}`, `screens/LOADING${this.level}.png`);
  }

  create() {
    this.powerupTime = 0;
    this.centerTextTime = 0;

    const playerData = this.game.dataManager.getPlayerData();
    const getAmmoInterfaceImage = (weapon: WeaponType) => {
      switch (weapon) {
        case WeaponType.pistol:
          return 'GAME_INTERFACE_WEAPONS_PISTOL';
        case WeaponType.magic:
          return 'GAME_INTERFACE_WEAPONS_MAGIC';
        case WeaponType.tnt:
          return 'GAME_INTERFACE_WEAPONS_DYNAMITE';
        default:
          return '';
      }
    };

    const scoreFrame = new ImageCounter(this, 14, 14, 'GAME_INTERFACE_TREASURECHEST',
      'GAME_INTERFACE_SCORENUMBERS', 8, 11, 22, 0, 'GAME_INTERFACE_CHEST');
    scoreFrame.setValue(playerData.score);

    const healthFrame = new ImageCounter(this, CANVAS_WIDTH - 32, 14, 'GAME_INTERFACE_HEALTHHEART',
      'GAME_INTERFACE_HEALTHNUMBERS', 3, 11, -20, 0);
    healthFrame.setValue(playerData.health);

    const ammoFrame = new ImageCounter(this, CANVAS_WIDTH - 26, 44, getAmmoInterfaceImage(playerData.weapon),
      'GAME_INTERFACE_SMALLNUMBERS', 2, 9, -17, 2);
    ammoFrame.setValue(playerData[WeaponType[playerData.weapon]]);
    Object.keys(WeaponType)
      .filter(key => !isNaN(Number(key)) && WeaponType[key] !== playerData.weapon)
      .forEach(weapon => {
        ammoFrame.requestAnimation('GAME', getAmmoInterfaceImage(Number(weapon)));
      });

    const livesFrame = new ImageCounter(this, CANVAS_WIDTH - 18, 72, 'GAME_INTERFACE_LIVESHEAD',
      'GAME_INTERFACE_SMALLNUMBERS', 1, 9, -15, 1);
    livesFrame.setValue(playerData.lives);

    this.powerupFrame = new ImageCounter(this, 10, 48, 'GAME_INTERFACE_STOPWATCH',
      'GAME_INTERFACE_SCORENUMBERS', 3, 11, 26, 0);
    this.powerupFrame.visible = false;

    this.cheatText = this.add.text(CANVAS_WIDTH / 2, 110, '', { font: TEXT_FONT, fill: '#ffffff' });
    this.cheatText.setOrigin(0.5, 0.5);
    this.fpsText = this.add.text(10, CANVAS_HEIGHT - 10, '', { font: TEXT_FONT, fill: '#ffffff' });
    this.fpsText.setOrigin(0, 1);
    this.mapDisplay = this.scene.get(MapDisplay.key) as MapDisplay;
    this.fade = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 1);
    this.fade.setOrigin(0, 0);
    this.fade.alpha = 0;

    playerData.on('change', (dataType: string, newValue: number) => {
      switch (dataType) {
        case 'lives':
          livesFrame.setValue(newValue);
          break;
        case 'health':
          healthFrame.setValue(newValue);
          break;
        case 'score':
          scoreFrame.setValue(newValue);
          break;
        case 'pistol':
        case 'magic':
        case 'tnt':
          if (dataType === WeaponType[playerData.weapon]) {
            ammoFrame.setValue(newValue);
          }
          break;
        case 'weapon':
          ammoFrame.playAnimation('GAME' + getAmmoInterfaceImage(newValue));
          ammoFrame.setValue(playerData[WeaponType[newValue]]);
          break;
        default:
          break;
      }
    });

    this.mapDisplay.events.on('PowerupTimeChange', (newPowerupTime: number) => {
      this.powerupTime = newPowerupTime;
      this.powerupFrame.setVisible(true);
    });

    this.input.keyboard.on('keydown_ESC', () => this.togglePause());
    this.input.keyboard.on('keydown_M', () => {
      if (!this.menu.disabled) {
        this.game.dataManager.set('musicVolume', '0.0');
      }
    });

    this.menu = new InGameMenu(this);
    this.menu.disabled = true;
    super.create();

    if (!this.mapDisplay.ready) {
      const background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, `LOADING${this.level}`);

      this.mapDisplay.events.on('load', () => {
        background.destroy();
      });
    }
  }

  update(time: number, delta: number) {
    if (this.centerTextTime > 0) {
      this.centerTextTime -= delta;
    } else {
      this.cheatText.visible = false;
    }

    if (this.powerupTime > 0) {
      if (this.menu.disabled) {
        this.powerupTime -= delta;
        this.powerupFrame.setValue(Math.round(this.powerupTime / 1000));

        if (this.powerupTime <= 0) {
          this.mapDisplay.claw.clearPowerup();
          this.game.musicManager.resumePaused();
        }
      }
    } else {
      this.powerupFrame.setVisible(false);
    }

    if (this.showFPS) {
      this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));
      this.fpsText.visible = true;
    } else {
      this.fpsText.visible = false;
    }

    super.update(time, delta);
  }

  textOut(text: string) {
    this.cheatText.setText(text);
    this.cheatText.visible = true;
    this.centerTextTime = 5000;
  }

  togglePause(skipSound?: boolean) {
    this.menu.disabled = !this.menu.disabled;
    this.fade.alpha = this.menu.disabled ? 0 : 0.5;

    if (this.menu.disabled) {
      this.game.soundsManager.setScene(this.mapDisplay);
      this.scene.resume(MapDisplay.key);
      while (!(this.menu instanceof InGameMenu)) {
        this.menu.back();
      }
      this.menu.hide();
    } else {
      this.mapDisplay.claw.inputs = {
        LEFT: false,
        RIGHT: false,
        UP: false,
        DOWN: false,
        JUMP: false,
        ATTACK: false,
        SECONDARY_ATTACK: false,
      };
      this.game.soundsManager.setScene(this);
      this.scene.pause(MapDisplay.key);
      this.menu.show();
    }

    if (!skipSound) {
      this.game.soundsManager.playSound('GAME_SELECT');
    }
  }
}
