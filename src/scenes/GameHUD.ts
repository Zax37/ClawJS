import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import { PowerupType } from '../model/PowerupType';
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
  private healthFrame: ImageCounter;
  private powerupFrame: ImageCounter;
  private livesFrame: ImageCounter;
  powerupTime: number;
  private centerTextTime: number;
  private fade: Phaser.GameObjects.Rectangle;
  private level: number;
  showFPS = false;

  isMenuOn = false;

  constructor() {
    super({ key: GameHUD.key });
  }

  init(level: number) {
    this.level = level;
  }

  preload() {
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
    this.load.image(`LOADING${this.level}`, `screens/LOADING${this.level}.png`);
  }

  create() {
    this.powerupTime = 0;
    this.centerTextTime = 0;

    const scoreFrame = new ImageCounter(this, 14, 14, 'GAME_INTERFACE_TREASURECHEST',
      'GAME_INTERFACE_SCORENUMBERS', 8, 11, 22, 0, 'GAME_INTERFACE_CHEST');

    this.healthFrame = new ImageCounter(this, CANVAS_WIDTH - 32, 14, 'GAME_INTERFACE_HEALTHHEART',
      'GAME_INTERFACE_HEALTHNUMBERS', 3, 11, -20, 0);
    this.healthFrame.setValue(100);

    const ammoFrame = new ImageCounter(this, CANVAS_WIDTH - 26, 44, 'GAME_INTERFACE_WEAPONS_PISTOL',
      'GAME_INTERFACE_SMALLNUMBERS', 2, 9, -17, 2);
    ammoFrame.setValue(5);

    this.livesFrame = new ImageCounter(this, CANVAS_WIDTH - 18, 72, 'GAME_INTERFACE_LIVESHEAD',
      'GAME_INTERFACE_SMALLNUMBERS', 1, 9, -15, 1);
    this.livesFrame.setValue(6);

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

    if (!this.mapDisplay.ready) {
      const background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, `LOADING${this.level}`);

      this.mapDisplay.events.on('load', () => {
        background.destroy();
        this.updateHealth(this.mapDisplay.claw.health.value);
        this.updateLives(this.mapDisplay.claw.lives);
        scoreFrame.setValue(this.mapDisplay.claw.score);
      });
    } else {
      this.updateHealth(this.mapDisplay.claw.health.value);
      this.updateLives(this.mapDisplay.claw.lives);
      scoreFrame.setValue(this.mapDisplay.claw.score);
    }
  }

  updateHealth(newValue: number) {
    this.healthFrame.setValue(newValue);
  }

  updateLives(lives: number) {
    this.livesFrame.setValue(lives);
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
          if (this.mapDisplay.claw.powerup === PowerupType.INVISIBILITY) {
            this.mapDisplay.claw.alpha = 1;
          }
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
