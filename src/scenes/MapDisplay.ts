import Game from "../game";
import MapFactory from "../tilemap/MapFactory";
import {config} from "../config";

export default class MapDisplay extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private claw: Phaser.GameObjects.GameObject;
  private graphics: Phaser.GameObjects.Graphics;

  private level: any;
  private baseLevel: number;
  private map: any;

  game: Game;
  static key = 'MapDisplay';

  private gameAnimsLoaded = false;

  constructor () {
    super({
      key: MapDisplay.key,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: { y: 2000 },
          fps: 480,
        }
      },
    });
  }

  init (level: any)
  {
    this.level = level;
    this.baseLevel = level === 15 ? 9 : level;
    this.map = null;
  }

  preload ()
  {
    this.load.json(`level${this.level}`, `maps/RETAIL${this.level}.json`);
    this.load.spritesheet(`L${this.baseLevel}_BACK`, `tilesets/L${this.baseLevel}_BACK.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.spritesheet(`L${this.baseLevel}_ACTION`, `tilesets/L${this.baseLevel}_ACTION.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.spritesheet(`L${this.baseLevel}_FRONT`, `tilesets/L${this.baseLevel}_FRONT.png`, { frameWidth: 64, frameHeight: 64, margin: 1, spacing: 2 });
    this.load.atlas('CLAW', 'imagesets/CLAW.png', 'imagesets/CLAW.json');
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
    this.load.atlas(
      'LEVEL' + this.baseLevel,
      `imagesets/LEVEL${this.baseLevel}.png`,
      `imagesets/LEVEL${this.baseLevel}.json`
    );

    this.load.audio(`L${this.baseLevel}_MUSIC`, [
      `music/LEVEL${this.baseLevel}.ogg`,
    ]);

    this.load.on('complete', () => this.game.animationManager.loadBase());
  }

  create ()
  {
    this.level = this.cache.json.get(`level${this.level}`);
    this.map = MapFactory.parse(this, this.level);
    this.camera = this.cameras.main;
    this.camera.centerOn(this.level.startX, this.level.startY);

    let claw = this.map.claw;
    this.camera.startFollow(claw);

    this.graphics = this.add.graphics();
    this.map.mainLayer.renderDebug(this.graphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    });

    this.game.musicManager.play(this.sound.add(`L${this.baseLevel}_MUSIC`));

    this.input.keyboard.on('keydown_LEFT', () => claw.inputs.LEFT = true);
    this.input.keyboard.on('keyup_LEFT', () => claw.inputs.LEFT = false);
    this.input.keyboard.on('keydown_RIGHT', () => claw.inputs.RIGHT = true);
    this.input.keyboard.on('keyup_RIGHT', () => claw.inputs.RIGHT = false);
    this.input.keyboard.on('keydown_DOWN', () => claw.inputs.DOWN = true);
    this.input.keyboard.on('keyup_DOWN', () => claw.inputs.DOWN = false);
    this.input.keyboard.on('keydown_SPACE', () => claw.inputs.JUMP = true);
    this.input.keyboard.on('keyup_SPACE', () => claw.inputs.JUMP = false);

    this.input.keyboard.on('keydown_ESC', () => this.game.goToMainMenu());
    window.addEventListener('popstate', () => this.game.goToMainMenu());
  }

  update(time: number, delta: number)
  {
    if (this.map) {
      this.map.update(this.camera);
    }
  }
}