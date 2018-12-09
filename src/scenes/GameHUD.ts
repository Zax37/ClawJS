import Game from "../game";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../config";
import MapDisplay from "./MapDisplay";

export default class GameHUD extends Phaser.Scene {
  game: Game;
  static key = 'GameHUD';
  private scoreText: Phaser.GameObjects.Text;
  private hpText: Phaser.GameObjects.Text;
  private centerText: Phaser.GameObjects.Text;
  private powerupTimeText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text;
  private powerupTime: number = 0;
  private centerTextTime: number = 0;
  showFPS: boolean = false;

  constructor() {
    super({key: GameHUD.key});
  }

  preload() {

  }

  create() {
    this.scoreText = this.add.text(10, 10, 'Score: 0', { font: '24px Arial', fill: '#ffff00' });
    this.hpText = this.add.text(CANVAS_WIDTH - 10, 10, 'Health: 100', { font: '24px Arial', fill: '#ff0000' });
    this.hpText.setOrigin(1, 0);
    this.centerText = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '', { font: '12px Arial', fill: '#ffffff' });
    this.centerText.setOrigin(0.5, 0.5);
    this.fpsText = this.add.text(10, CANVAS_HEIGHT - 10, '', { font: '12px Arial', fill: '#ffffff' });
    this.fpsText.setOrigin(0, 1);
    this.powerupTimeText = this.add.text(10, 30, 'Time: 0', { font: '24px Arial', fill: '#ffff00' });
    this.powerupTimeText.visible = false;
    let mapDisplay = this.scene.get(MapDisplay.key);

    mapDisplay.events.on('ScoreChange', function (this: GameHUD, newScoreValue: number) {
      this.scoreText.setText('Score: ' + newScoreValue);
    }, this);

    mapDisplay.events.on('HealthChange', function (this: GameHUD, newHealthValue: number) {
      this.hpText.setText('Health: ' + newHealthValue);
    }, this);

    mapDisplay.events.on('PowerupTimeChange', function (this: GameHUD, newPowerupTime: number) {
      this.powerupTime = newPowerupTime;
      this.powerupTimeText.visible = true;
    }, this);
  }

  update(time: number, delta: number) {
    if (this.centerTextTime > 0) {
      this.centerTextTime -= delta;
    } else {
      this.centerText.visible = false;
    }

    if (this.powerupTime > 0) {
      this.powerupTime -= delta;
      this.powerupTimeText.setText('Time: ' + Math.round(this.powerupTime / 1000));
    } else {
      this.powerupTimeText.visible = false;
    }

    if (this.showFPS) {
      this.fpsText.setText('FPS: ' + this.game.loop.actualFps);
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
}
