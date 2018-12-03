import Game from "../game";
import {CANVAS_WIDTH} from "../config";
import MapDisplay from "./MapDisplay";

export default class GameHUD extends Phaser.Scene {
  game: Game;
  static key = 'GameHUD';
  private scoreText: Phaser.GameObjects.Text;
  private hpText: Phaser.GameObjects.Text;

  constructor() {
    super({key: GameHUD.key});
  }

  preload() {

  }

  create() {
    this.scoreText = this.add.text(10, 10, 'Score: 0', { font: '24px Arial', fill: '#ffff00' });
    this.hpText = this.add.text(CANVAS_WIDTH - 128, 10, 'Health: 100', { font: '24px Arial', fill: '#ff0000' });
    let mapDisplay = this.scene.get(MapDisplay.key);

    mapDisplay.events.on('ScoreChange', function (this: GameHUD, newScoreValue: number) {
      this.scoreText.setText('Score: ' + newScoreValue);
    }, this);

    mapDisplay.events.on('HealthChange', function (this: GameHUD, newHealthValue: number) {
      this.hpText.setText('Health: ' + newHealthValue);
    }, this);
  }
}
