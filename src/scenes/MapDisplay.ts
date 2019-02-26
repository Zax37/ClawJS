import Game from '../game';
import CaptainClaw from '../logics/CaptainClaw';
import { LEVEL_DEFAULTS, LevelData } from '../model/LevelDefaults';
import MapFactory from '../tilemap/MapFactory';
import GameHUD from './GameHUD';

export default class MapDisplay extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.Camera;
  claw: CaptainClaw;

  attackRects: Phaser.Physics.Arcade.Group;
  attackable: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;

  private level: any;
  private baseLevel: number;
  private map: any;
  private levelData: LevelData;

  game: Game;
  hud: GameHUD;
  static key = 'MapDisplay';

  bossMusic: Phaser.Sound.BaseSound;
  powerupMusic: Phaser.Sound.BaseSound;
  ready = false;
  transitioning = false;

  constructor() {
    super({
      key: MapDisplay.key,
      physics: {
        default: 'arcade',
        arcade: {
          //debug: true,
          gravity: { y: 655 },
          timeScale: 0.6,
        },
        fps: {
          min: 50,
          target: 60,
          panicMax: 80,
          deltaHistory: 3,
        },
      },
    });
  }

  init(level: number) {
    this.level = level;
    this.baseLevel = level === 15 ? 9 : level;
    this.map = null;
    this.ready = false;
  }

  preload() {
    this.load.json(`level${this.level}`, `maps/RETAIL${this.level}.json`);
    this.load.spritesheet(`L${this.baseLevel}_BACK`, `tilesets/L${this.baseLevel}_BACK.png`, {
      frameWidth: 64,
      frameHeight: 64,
      margin: 1,
      spacing: 2,
    });
    this.load.spritesheet(`L${this.baseLevel}_ACTION`, `tilesets/L${this.baseLevel}_ACTION.png`, {
      frameWidth: 64,
      frameHeight: 64,
      margin: 1,
      spacing: 2,
    });
    this.load.spritesheet(`L${this.baseLevel}_FRONT`, `tilesets/L${this.baseLevel}_FRONT.png`, {
      frameWidth: 64,
      frameHeight: 64,
      margin: 1,
      spacing: 2,
    });
    this.load.atlas('CLAW', 'imagesets/CLAW.png', 'imagesets/CLAW.json');
    this.load.atlas('GAME', 'imagesets/GAME.png', 'imagesets/GAME.json');
    this.load.atlas(
      'LEVEL' + this.baseLevel,
      `imagesets/LEVEL${this.baseLevel}.png`,
      `imagesets/LEVEL${this.baseLevel}.json`,
    );

    this.load.audio('BOSS', ['music/BOSS.ogg']);
    this.load.audio('POWERUP', ['music/POWERUP.ogg']);
    this.load.audio(`L${this.baseLevel}_MUSIC`, [
      `music/LEVEL${this.baseLevel}.ogg`,
    ]);

    this.load.audioSprite('voc', 'sounds/VOC_EN.json');
    this.load.on('complete', () => this.game.animationManager.loadBase());
  }

  create() {
    this.hud = this.scene.get(GameHUD.key) as GameHUD;
    this.game.treasureRegistry.reset();
    this.levelData = LEVEL_DEFAULTS[this.baseLevel - 1];
    this.level = this.cache.json.get(`level${this.level}`);
    this.map = MapFactory.parse(this, this.level);

    // this.map.mainLayer.renderDebug(this.add.graphics());

    this.camera = this.cameras.main;
    this.camera.centerOn(this.level.startX, this.level.startY);

    this.camera.startFollow(this.claw, true);

    this.bossMusic = this.sound.add('BOSS');
    this.powerupMusic = this.sound.add('POWERUP');
    this.game.soundsManager.setScene(this);
    this.game.musicManager.play(this.sound.add(`L${this.baseLevel}_MUSIC`));
    this.game.cheatManager.registerCheats(this);

    this.input.keyboard.on('keydown_LEFT', () => this.claw.inputs.LEFT = true);
    this.input.keyboard.on('keyup_LEFT', () => this.claw.inputs.LEFT = false);
    this.input.keyboard.on('keydown_RIGHT', () => this.claw.inputs.RIGHT = true);
    this.input.keyboard.on('keyup_RIGHT', () => this.claw.inputs.RIGHT = false);
    this.input.keyboard.on('keydown_DOWN', () => this.claw.inputs.DOWN = true);
    this.input.keyboard.on('keyup_DOWN', () => this.claw.inputs.DOWN = false);
    this.input.keyboard.on('keydown_UP', () => this.claw.inputs.UP = true);
    this.input.keyboard.on('keyup_UP', () => this.claw.inputs.UP = false);
    this.input.keyboard.on('keydown_SPACE', () => this.claw.inputs.JUMP = true);
    this.input.keyboard.on('keyup_SPACE', () => this.claw.inputs.JUMP = false);
    this.input.keyboard.on('keydown_CTRL', () => this.claw.inputs.ATTACK = true);
    this.input.keyboard.on('keyup_CTRL', () => this.claw.inputs.ATTACK = false);
    /*this.input.keyboard.on('keyup_ALT', () => this.claw.inputs.SECONDARY_ATTACK = false);

    document.addEventListener('keydown', (e) => {
      if (e.which === 18) {
        e.preventDefault();
        this.claw.inputs.SECONDARY_ATTACK = true
      }
    });*/

    window.addEventListener('popstate', () => this.game.goToMainMenu());
    this.events.emit('load');
    this.ready = true;
  }

  update(time: number, delta: number) {
    if (this.map) {
      this.map.update(this.camera);
    }
  }

  getBaseLevel() {
    return this.baseLevel;
  }

  getLevelData() {
    return { ...this.levelData };
  }
}
