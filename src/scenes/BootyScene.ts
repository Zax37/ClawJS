import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import { BootyGem, BootyMapPiece, BootyTreasureLine } from '../logics';
import { TreasureType } from '../model/TreasureType';

export enum BootyState { INIT, TRANSITION, DIALOG, BOOTY, END }

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

    this.load.audio('CURLING1', 'sounds/CURLING1.ogg');
    this.load.audio('IMPACT3', 'sounds/IMPACT3.ogg');
    this.load.audio('GEM', 'sounds/GEM.ogg');
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
