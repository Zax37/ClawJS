import Game from "../game";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../config";

export default class Booty extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private level: number;

  game: Game;
  static key = 'Booty';

  constructor() {
    super({key: Booty.key});
  }

  init (level: number)
  {
    this.level = level;
  }

  preload() {
    this.load.image("MENU_BG", `screens/MENU.png`);

    this.load.audio('maploop', [
      `music/MAPLOOP.ogg`,
    ]);
  }

  create() {
    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "MENU_BG");
    this.game.musicManager.play(this.sound.add('maploop'));

    this.input.keyboard.on('keydown_SPACE', () => {
      this.game.startLevel(this.level + 1)
    });
  }
}
