import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';

enum BootyState { INIT, TRANSITION, DIALOG, BOOTY }
const INIT_DURATION = 5000;
const TRANSITION_DURATION = 4000;

class MapPiece extends Phaser.GameObjects.Image {
  startTime: number;
  targetX: number;
  targetY: number;
  clawDialog: Phaser.Sound.BaseSound;

  constructor(protected scene: Booty, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.sys.updateList.add(this);
  }

  preUpdate(time: number, delta: number) {
    switch (this.scene.state) {
      case BootyState.INIT:
        if (this.startTime) {
          if (time - this.startTime > INIT_DURATION) {
            this.scene.sys.displayList.add(this);
            this.scene.state = BootyState.TRANSITION;
            this.scene.sound.play('CURLING1');
            this.startTime = time;
          }
        } else {
          this.startTime = time;
          this.targetX = CANVAS_WIDTH - 166;
          this.targetY = CANVAS_HEIGHT - 162;
        }
        break;
      case BootyState.TRANSITION:
        const timeSinceStart = time - this.startTime;
        if (timeSinceStart < TRANSITION_DURATION) {
          const progress = timeSinceStart / TRANSITION_DURATION;
          this.x = this.targetX * progress;
          this.y = (this.targetY + 100) * progress - 100;
        } else {
          this.x = this.targetX;
          this.y = this.targetY;
          this.scene.state = BootyState.DIALOG;
          this.scene.sound.play('IMPACT3');
          this.clawDialog = this.scene.sound.addAudioSprite('voc');
          this.clawDialog.play( 'CLAW_BOOTY' + this.scene.level, { delay: 4 });
        }
        break;
      default:
        break;
    }
  }

  skip() {
    if (this.clawDialog) {
      this.clawDialog.stop();
      this.clawDialog.destroy();
    }
    this.destroy();
  }
}

export default class Booty extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private mappiece?: MapPiece;
  level: number;

  game: Game;
  static key = 'Booty';

  state: BootyState = BootyState.INIT;

  constructor() {
    super({ key: Booty.key });
  }

  init(level: number) {
    this.level = level;
  }

  preload() {
    this.load.image(`BOOTY${this.level}A`, `screens/BOOTY${this.level}A.png`);
    this.load.image(`BOOTY${this.level}B`, `screens/BOOTY${this.level}B.png`);
    this.load.image(`MAPPIECE1`, `ui/MAPPIECE1.png`);

    this.load.audio('maploop', [
      `music/MAPLOOP.ogg`,
    ]);

    this.load.audio('CURLING1', 'sounds/CURLING1.wav');
    this.load.audio('IMPACT3', 'sounds/IMPACT3.wav');
  }

  create() {
    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, `BOOTY${this.level}A`);
    this.mappiece = new MapPiece(this, 0, -100, 'MAPPIECE1');
    this.game.musicManager.play(this.sound.add('maploop'));

    this.input.keyboard.on('keydown_SPACE', () => {
      if (this.state === BootyState.BOOTY) {
        this.game.startLevel(this.level + 1);
      } else {
        this.state = BootyState.BOOTY;
        this.background.setTexture(`BOOTY${this.level}B`);
        this.mappiece!.skip();
      }
    });
  }
}
