import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import ImageCounter from '../logics/ImageCounter';
import { TreasureType } from '../model/TreasureType';

enum BootyState { INIT, TRANSITION, DIALOG, BOOTY, END }
const INIT_DURATION = 5000;
const MAIN_TRANSITION_DURATION = 2500;
const TREASURE_TRANSITION_DURATION_BASE = 450;
const TREASURE_TRANSITION_DURATION_BASE_COIN = 300;
const TREASURE_TRANSITION_DELAY = 180;
const TREASURE_TRANSITION_DELAY_COIN = 70;

class BootyMapPiece extends Phaser.GameObjects.Image {
  startTime: number;
  targetX: number;
  targetY: number;
  private curlingSound: Phaser.Sound.BaseSound.AudioSpriteSound;

  constructor(protected scene: BootyScene, protected startX: number, protected startY: number, texture: string) {
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
            this.curlingSound = this.scene.sound.add('CURLING1', { volume: this.scene.game.soundsManager.getSoundsVolume() });
            this.curlingSound.play();
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
        if (timeSinceStart < MAIN_TRANSITION_DURATION) {
          const progress = timeSinceStart / MAIN_TRANSITION_DURATION;
          this.x = (this.targetX - this.startX) * progress + this.startX;
          this.y = (this.targetY - this.startY) * progress + this.startY;
        } else {
          this.x = this.targetX;
          this.y = this.targetY;
          this.scene.state = BootyState.DIALOG;
          this.curlingSound.stop();
          this.scene.sound.add('IMPACT3', { volume: this.scene.game.soundsManager.getSoundsVolume() }).play();
        }
        break;
      default:
        break;
    }
  }

  destroy() {
    if (this.curlingSound) {
      this.curlingSound.destroy();
    }
    super.destroy();
  }
}

class BootySupplyTreasure extends Phaser.GameObjects.Image {
  constructor(protected scene: BootyScene, protected startX: number, protected startY: number, protected targetX: number, protected targetY: number, protected image: string, protected startTime: number, protected duration: number) {
    super(scene, startX, startY, 'GAME', image + 1);
    this.scene.sys.displayList.add(this);
    this.scene.sys.updateList.add(this);
  }

  preUpdate(time: number, delta: number) {
    const timeSinceStart = time - this.startTime;
    if (timeSinceStart < this.duration) {
      const progress = Math.min(timeSinceStart / this.duration, 1.0);
      this.x = (this.targetX - this.startX) * progress + this.startX;
      this.y = (this.targetY - this.startY) * progress + this.startY;
    } else {
      this.emit('end');
      this.destroy();
    }
  }
}

class BootyTreasureLine extends Phaser.GameObjects.Image {
  startTime: number;
  startX: number;
  startY: number;

  value: number;
  collected: number;
  registered: number;

  textOf: Phaser.GameObjects.BitmapText;
  textTimes: Phaser.GameObjects.BitmapText;
  textEquals: Phaser.GameObjects.BitmapText;

  scoreFrame: ImageCounter;
  maxScoreFrame: ImageCounter;
  pointsMultiplierFrame: ImageCounter;
  finalScoreFrame: ImageCounter;

  private duration: number;
  private delay: number;
  private finished: boolean;

  constructor(protected scene: BootyScene, protected targetX: number, protected targetY: number, protected treasure: {image: string, sound: string, type: TreasureType, score: number}) {
    super(scene, -100, targetY, 'GAME', treasure.image + 1);

    this.value = 0;
    this.collected = scene.game.treasureRegistry.getCollected(treasure.type);
    this.registered = scene.game.treasureRegistry.getRegistered(treasure.type);

    this.scoreFrame = new ImageCounter(scene, targetX, targetY, treasure.image, 'GAME_INTERFACE_SCORENUMBERS', this.collected.toString().length, 11, 32, 0);
    this.scoreFrame.setVisible(false);

    this.textOf = scene.add.dynamicBitmapText(targetX + 96, targetY, 'regular', 'OF', 100);
    this.textOf.setOrigin(0.5,0.5);
    this.textOf.setVisible(false);

    this.maxScoreFrame = new ImageCounter(scene, targetX + 132, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', this.registered.toString().length, 11);
    this.maxScoreFrame.setValue(this.registered);
    this.maxScoreFrame.setVisible(false);

    this.textTimes = scene.add.dynamicBitmapText(targetX + 190, targetY, 'regular', 'X', 100);
    this.textTimes.setOrigin(0.5,0.5);
    this.textTimes.setVisible(false);

    this.pointsMultiplierFrame = new ImageCounter(scene, targetX + 210, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', this.treasure.score.toString().length, 11);
    this.pointsMultiplierFrame.setValue(this.treasure.score);
    this.pointsMultiplierFrame.setVisible(false);

    this.textEquals = scene.add.dynamicBitmapText(targetX + 275, targetY, 'regular', '=', 100);
    this.textEquals.setOrigin(0.5,0.5);
    this.textEquals.setVisible(false);

    this.finalScoreFrame = new ImageCounter(scene, targetX + 290, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', 1, 11);
    this.finalScoreFrame.setVisible(false);
  }

  start() {
    this.startTime = this.scene.time.now;
    this.startX = this.x;
    this.startY = this.y;
    this.scene.sys.displayList.add(this);
    this.scene.sys.updateList.add(this);

    this.duration = this.treasure.type === TreasureType.COIN ? TREASURE_TRANSITION_DURATION_BASE_COIN : TREASURE_TRANSITION_DURATION_BASE;
    this.delay = this.treasure.type === TreasureType.COIN ? TREASURE_TRANSITION_DELAY_COIN : TREASURE_TRANSITION_DELAY;
  }

  end() {
    this.finished = true;
    this.startTime = -TREASURE_TRANSITION_DURATION_BASE;
    this.scene.sys.displayList.remove(this);
    this.scene.sys.updateList.remove(this);
    this.scoreFrame.setVisible(true);
    this.scoreFrame.setValue(this.collected);
    this.maxScoreFrame.setVisible(true);
    this.pointsMultiplierFrame.setVisible(true);
    this.finalScoreFrame.setValue(this.collected * this.treasure.score);
    this.finalScoreFrame.setVisible(true);
    this.textOf.setVisible(true);
    this.textTimes.setVisible(true);
    this.textEquals.setVisible(true);
    this.emit('end');
  }

  preUpdate(time: number, delta: number) {
    if (this.startTime > 0) {
      const timeSinceStart = time - this.startTime;
      if (!this.scoreFrame.visible) {
        const progress = Math.min(timeSinceStart / TREASURE_TRANSITION_DURATION_BASE, 1.0);
        this.x = (this.targetX - this.startX) * progress + this.startX;
        this.y = (this.targetY - this.startY) * progress + this.startY;

        if (progress >= 1.0) {
          this.scoreFrame.setVisible(true);
          this.textOf.setVisible(true);
          this.maxScoreFrame.setVisible(true);
          this.textTimes.setVisible(true);
          this.pointsMultiplierFrame.setVisible(true);
          this.textEquals.setVisible(true);
          this.finalScoreFrame.setVisible(true);
          this.scene.game.soundsManager.playSound(this.treasure.sound);
        }
      } else if (timeSinceStart >= this.delay && this.value < this.collected) {
        const supply = new BootySupplyTreasure(this.scene, -100, -100, this.targetX, this.targetY, this.treasure.image, time, this.duration);
        supply.once('end', () => {
          if (!this.finished) {
            this.scoreFrame.increase();
            this.finalScoreFrame.setValue(this.scoreFrame.getValue() * this.treasure.score);
          }
          this.scene.game.soundsManager.playSound('GAME_PUBOUNCE1');
        });
        this.duration -= 1;
        this.delay -= 3;
        this.startTime = time;
        this.value++;
      } else if (this.value === this.collected && this.value === this.scoreFrame.getValue()) {
        this.end();
      }
    }
  }
}

class BootyGem extends Phaser.GameObjects.Sprite {
  private startTime: number;
  private afterInit: boolean;
  private gemSound: Phaser.Sound.BaseSound;

  constructor(protected scene: BootyScene, x: number, y: number) {
    super(scene, x, y, 'gem', 1);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.startTime = scene.time.now;
  }

  preUpdate(time: number, delta: number) {
    const timeSinceStart = time - this.startTime;
    const progress = Math.min(timeSinceStart / (this.afterInit ? MAIN_TRANSITION_DURATION : INIT_DURATION), 1);

    if (this.afterInit) {
      if (progress <= 0.5) {
        this.setFrame(1 + Math.round(progress * 62));
      } else if (progress < 0.9) {
        this.setFrame(33 + Math.round((progress - 0.5) * 21));
      } else {
        this.setFrame(33);
        this.scene.sys.updateList.remove(this);
        this.scene.state = BootyState.DIALOG;
      }
    } else if (progress === 1) {
      this.startTime = time;
      this.afterInit = true;
      this.gemSound = this.scene.sound.add('GEM', { volume: this.scene.game.soundsManager.getSoundsVolume() });
      this.gemSound.play();
    }
  }

  destroy() {
    if (this.gemSound) {
      this.gemSound.destroy();
    }
    super.destroy();
  }
}

export default class BootyScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  private mappiece?: BootyMapPiece;
  private gem?: BootyGem;
  private clawDialog?: Phaser.Sound.BaseSound;
  private treasureLines: BootyTreasureLine[];
  private amuletMusic?: Phaser.Sound.BaseSound;
  level: number;

  game: Game;
  static key = 'BootyScene';

  _state: BootyState;

  get state() {
    return this._state;
  }

  set state(state: BootyState) {
    this._state = state;
    if (state === BootyState.DIALOG) {
      this.clawDialog = this.game.soundsManager.playVocal('CLAW_BOOTY' + this.level, { delay: 3 });
      this.clawDialog.once('ended', () => {
        if (!this.amuletMusic || !this.amuletMusic.isPlaying) {
          this.state = BootyState.BOOTY;
        } else {
          this.amuletMusic.once('ended', () => this.state = BootyState.BOOTY);
        }
      });
    } else if (state === BootyState.BOOTY) {
      if (this.clawDialog) {
        this.clawDialog.stop();
        this.clawDialog.destroy();
        this.clawDialog = undefined;
      }
      if (this.mappiece) {
        this.mappiece.destroy();
        this.mappiece = undefined;
      } else if (this.gem) {
        this.gem.destroy();
        this.gem = undefined;
      }
      if (this.amuletMusic) {
        this.amuletMusic.stop();
      }

      this.background.setTexture(`BOOTY${this.level}B`);
      this.treasureLines[0].start();
      for (let i = 0; i < this.treasureLines.length; i++) {
        const next = i + 1;
        this.treasureLines[i].once('end', () => {
          if (this._state === BootyState.END) return;

          if (i === this.treasureLines.length - 1) {
            this.state = BootyState.END;
          } else {
            this.treasureLines[next].start();
          }
        });
      }
    } else if (state === BootyState.END) {
      if (this.amuletMusic) {
        this.amuletMusic.play();
      }
      this.treasureLines.forEach((treasureLine) => treasureLine.end());
    }
  }

  constructor() {
    super({ key: BootyScene.key });
  }

  init(level: number) {
    this.level = level;
    this._state = BootyState.INIT;
  }

  preload() {
    this.load.image(`BOOTY${this.level}A`, `screens/BOOTY${this.level}A.png`);
    this.load.image(`BOOTY${this.level}B`, `screens/BOOTY${this.level}B.png`);
    this.load.image(`MAPPIECE1`, `ui/MAPPIECE1.png`);
    this.load.atlas('gem', 'ui/gem.png', 'ui/gem.json');

    this.load.audio('maploop', [
      `music/MAPLOOP.ogg`,
    ]);
    this.load.audio('amulet', [
      `music/AMULET.ogg`,
    ]);

    this.load.audio('CURLING1', 'sounds/CURLING1.wav');
    this.load.audio('IMPACT3', 'sounds/IMPACT3.wav');
    this.load.audio('GEM', 'sounds/GEM.wav');
  }

  create() {
    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, `BOOTY${this.level}A`);
    if (this.level === 1) {
      this.mappiece = new BootyMapPiece(this, -50, -150, 'MAPPIECE1');
      this.game.musicManager.play(this.sound.add('maploop'));
    } else {
      this.game.musicManager.stop();
      this.gem = new BootyGem(this, CANVAS_WIDTH / 2 + 44, CANVAS_HEIGHT / 2 - 76);
      this.amuletMusic = this.sound.add('amulet');
      this.amuletMusic.play(undefined, { volume: this.game.musicManager.getVolume() });
    }

    const treasureData = [
      { type: TreasureType.SKULL, image: 'GAME_TREASURE_JEWELEDSKULL_BLUE', sound: 'GAME_SCEPTER', score: 25000 },
      { type: TreasureType.CROWN, image: 'GAME_TREASURE_CROWNS_GREEN', sound: 'GAME_SCEPTER', score: 15000 },
      { type: TreasureType.GECKO, image: 'GAME_TREASURE_GECKOS_RED', sound: 'GAME_SCEPTER', score: 10000 },
      { type: TreasureType.SCEPTER, image: 'GAME_TREASURE_SCEPTERS_PURPLE', sound: 'GAME_SCEPTER', score: 7500 },
      { type: TreasureType.CROSS, image: 'GAME_TREASURE_CROSSES_BLUE', sound: 'GAME_CROSS', score: 5000 },
      { type: TreasureType.CHALICE, image: 'GAME_TREASURE_CHALICES_GREEN', sound: 'GAME_PICKUP1', score: 2500 },
      { type: TreasureType.RING, image: 'GAME_TREASURE_RINGS_PURPLE', sound: 'GAME_RINGS', score: 1500 },
      { type: TreasureType.GOLDBAR, image: 'GAME_TREASURE_GOLDBARS', sound: 'GAME_TREASURE', score: 500 },
      { type: TreasureType.COIN, image: 'GAME_TREASURE_COINS', sound: 'GAME_COIN', score: 100 },
    ];

    this.treasureLines = treasureData.map((treasure, i) => {
      return new BootyTreasureLine(this, 250, 120 + i * 42, treasure);
    });

    this.input.keyboard.on('keydown_SPACE', () => {
      if (this.state === BootyState.END) {
        if (this.amuletMusic) {
          this.amuletMusic.destroy();
        }

        if (this.level === 2) {
          this.game.goToMainMenu();
        } else {
          this.game.startLevel(this.level + 1);
        }
      } else if (this.state === BootyState.BOOTY) {
        this.state = BootyState.END;
      } else {
        this.state = BootyState.BOOTY;
      }
    });
  }
}
