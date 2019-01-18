import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';

enum BootyState { INIT, TRANSITION, DIALOG, BOOTY }
const INIT_DURATION = 5000;
const TRANSITION_DURATION = 2500;

class MapPiece extends Phaser.GameObjects.Image {
  startTime: number;
  targetX: number;
  targetY: number;

  constructor(protected scene: Booty, protected startX: number, protected startY: number, texture: string) {
    super(scene, startX, startY, texture);

    scene.sys.updateList.add(this);
  }

  preUpdate(time: number, delta: number) {
    switch (this.scene.state) {
      case BootyState.INIT:
        if (this.startTime) {
          if (time - this.startTime > INIT_DURATION) {
            this.scene.sys.displayList.add(this);
            this.scene.state = BootyState.TRANSITION;
            this.scene.sound.play('CURLING1', {volume: 0.5});
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
          this.x = (this.targetX - this.startX) * progress + this.startX;
          this.y = (this.targetY - this.startY) * progress + this.startY;
        } else {
          this.x = this.targetX;
          this.y = this.targetY;
          this.scene.state = BootyState.DIALOG;
          this.scene.sound.play('IMPACT3', {volume: 0.5});
        }
        break;
      default:
        break;
    }
  }
}

export default class Booty extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private mappiece?: MapPiece;
  private clawDialog?: Phaser.Sound.BaseSound;
  level: number;

  game: Game;
  static key = 'Booty';

  _state: BootyState = BootyState.INIT;

  get state() {
    return this._state;
  }

  set state(state: BootyState) {
    this._state = state;
    if (state === BootyState.DIALOG) {
      this.clawDialog = this.game.soundsManager.playVocal('CLAW_BOOTY' + this.level, { delay: 3 });
      this.clawDialog.once('ended', () => this.state = BootyState.BOOTY);
    } else if (state === BootyState.BOOTY) {
      if (this.clawDialog) {
        this.clawDialog.stop();
        this.clawDialog.destroy();
        this.clawDialog = undefined;
      }
      if (this.mappiece) {
        this.mappiece.destroy();
        this.mappiece = undefined;
      }

      this.background.setTexture(`BOOTY${this.level}B`);
    }
  }

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
    this.mappiece = new MapPiece(this, -50, -150, 'MAPPIECE1');
    this.game.musicManager.play(this.sound.add('maploop'));

    this.input.keyboard.on('keydown_SPACE', () => {
      if (this.state === BootyState.BOOTY) {
        this.game.startLevel(this.level + 1);
      } else {
        this.state = BootyState.BOOTY;
      }
    });
  }
}
