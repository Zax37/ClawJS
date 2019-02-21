import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import MapDisplay from './MapDisplay';
import SceneWithMenu from './SceneWithMenu';
import InGameMenu from '../menus/InGameMenu';
import ImageCounter from '../logics/ImageCounter';

export default class GameHUD extends SceneWithMenu {
  game: Game;
  static key = 'GameHUD';

  mapDisplay: MapDisplay;
  private centerText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text;
  private powerupFrame: ImageCounter;
  powerupTime: number;
  private centerTextTime: number;
  private fade: Phaser.GameObjects.Rectangle;
  showFPS = false;

  isMenuOn = false;

  constructor() {
    super({ key: GameHUD.key });
  }

  preload() {
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
  }

  create() {
    this.powerupTime = 0;
    this.centerTextTime = 0;

    const scoreFrame = new ImageCounter(this, 14, 16, 'GAME_INTERFACE_TREASURECHEST',
      'GAME_INTERFACE_SCORENUMBERS', 8, 11, 22, 2, 'GAME_INTERFACE_CHEST');

    const healthFrame = new ImageCounter(this, CANVAS_WIDTH - 32, 16, 'GAME_INTERFACE_HEALTHHEART',
      'GAME_INTERFACE_HEALTHNUMBERS', 3, 11, -20, 0);
    healthFrame.setValue(100);

    this.powerupFrame = new ImageCounter(this, 10, 48, 'GAME_INTERFACE_STOPWATCH',
      'GAME_INTERFACE_SCORENUMBERS', 3, 11, 26, 0);

    this.powerupFrame.visible = false;

    this.centerText = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '', { font: '12px Arial', fill: '#ffffff' });
    this.centerText.setOrigin(0.5, 0.5);
    this.fpsText = this.add.text(10, CANVAS_HEIGHT - 10, '', { font: '12px Arial', fill: '#ffffff' });
    this.fpsText.setOrigin(0, 1);
    this.mapDisplay = this.scene.get(MapDisplay.key) as MapDisplay;
    this.fade = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 1);
    this.fade.setOrigin(0, 0);
    this.fade.alpha = 0;

    this.mapDisplay.events.on('ScoreChange', function (this: GameHUD, newScoreValue: number) {
      scoreFrame.setValue(newScoreValue);
    }, this);

    this.mapDisplay.events.on('HealthChange', function (this: GameHUD, newHealthValue: number) {
      healthFrame.setValue(newHealthValue);
    }, this);

    this.mapDisplay.events.on('PowerupTimeChange', function (this: GameHUD, newPowerupTime: number) {
      this.powerupTime = newPowerupTime;
      this.powerupFrame.setVisible(true);
    }, this);

    this.input.keyboard.on('keydown_ESC', () => this.togglePause());
    this.input.keyboard.on('keydown_M', () => {
      if (this.isMenuOn) {
        this.game.dataManager.set('musicVolume', '0.0');
      }
    });

    this.menu = new InGameMenu(this);
    super.create();
  }

  update(time: number, delta: number) {
    if (this.centerTextTime > 0) {
      this.centerTextTime -= delta;
    } else {
      this.centerText.visible = false;
    }

    if (this.powerupTime > 0) {
      if (!this.isMenuOn) {
        this.powerupTime -= delta;
        this.powerupFrame.setValue(Math.round(this.powerupTime / 1000));

        if (this.powerupTime <= 0) {
          this.mapDisplay.claw.powerup = undefined;
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
  }

  textOut(text: string) {
    this.centerText.setText(text);
    this.centerText.visible = true;
    this.centerTextTime = 2000;
  }

  togglePause(skipSound?: boolean) {
    this.isMenuOn = !this.isMenuOn;
    this.fade.alpha = this.isMenuOn ? 0.5 : 0;

    if (this.isMenuOn) {
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
    } else {
      this.game.soundsManager.setScene(this.mapDisplay);
      this.scene.resume(MapDisplay.key);
      while (!(this.menu instanceof InGameMenu)) {
        this.menu.back();
      }
      this.menu.hide();
    }

    if (!skipSound) {
      this.game.soundsManager.playSound('GAME_SELECT');
    }
  }
}
