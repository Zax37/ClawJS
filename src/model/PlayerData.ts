import { WeaponType } from './WeaponType';

export interface PlayerDataInterface {
  lives: number;
  health: number;
  score: number;
  pistol: number;
  magic: number;
  tnt: number;
  weapon: WeaponType;
}

export const DEFAULT_PLAYER_DATA = {
  lives: 6,
  health: 100,
  score: 0,
  pistol: 10,
  magic: 5,
  tnt: 3,
  weapon: WeaponType.pistol,
};

export const SCORE_FOR_EXTRA_LIFE = 500000;

export class PlayerDataContainer extends Phaser.Events.EventEmitter implements PlayerDataInterface {
  private _lives: number;
  private _health: number;
  private _score: number;
  private _pistol: number;
  private _magic: number;
  private _tnt: number;
  private _weapon: number;

  constructor(data: PlayerDataInterface) {
    super();
    this._lives = data.lives;
    this._health = data.health;
    this._score = data.score;
    this._pistol = data.pistol;
    this._magic = data.magic;
    this._tnt = data.tnt;
    this._weapon = data.weapon;
  }

  get lives() { return this._lives; }
  set lives(value: number) { this.emit('change', 'lives', value); this._lives = value; }

  get health() { return this._health; }
  set health(value: number) { this.emit('change', 'health', value); this._health = value; }

  get score() { return this._score; }
  set score(value: number) {
    this.emit('change', 'score', value);
    if (Math.floor(this._score / SCORE_FOR_EXTRA_LIFE) < Math.floor(value / SCORE_FOR_EXTRA_LIFE)) {
      this.emit('extralife');
      this.lives++;
    }
    this._score = value;
  }

  get pistol() { return this._pistol; }
  set pistol(value: number) { this.emit('change', 'pistol', value); this._pistol = value; }

  get magic() { return this._magic; }
  set magic(value: number) { this.emit('change', 'magic', value); this._magic = value; }

  get tnt() { return this._tnt; }
  set tnt(value: number) { this.emit('change', 'tnt', value); this._tnt = value; }

  get weapon() { return this._weapon; }
  set weapon(value: WeaponType) { this.emit('change', 'weapon', value); this._weapon = value; }
}
