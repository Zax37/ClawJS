import EventEmitter = Phaser.Events.EventEmitter;

let currentBossHealth: Health | undefined;

const DEFAULT_HURT_TIME = 1000;

export default class Health extends EventEmitter {
  value: number;
  max: number;
  timeout: number;

  constructor(health: number, private clock: Phaser.Time.Clock) {
    super();
    this.value = health;
    this.max = health;
    this.timeout = 0;
  }

  isDead() {
    return this.value === 0;
  }

  isAlive() {
    return this.value > 0;
  }

  isFull() {
    return this.value === this.max;
  }

  heal(amount: number) {
    if (this.value < this.max) {
      this.value = Math.min(this.value + amount, this.max);
      this.emit('change');
    }
  }

  hurt(damage: number, hurtTime?: number) {
    if (this.timeout < this.clock.now) {
      this.value = Math.max(this.value - damage, 0);
      this.emit('change');
      if (this.value === 0) {
        this.emit('death');
      }
      this.timeout = this.clock.now + (hurtTime || DEFAULT_HURT_TIME);
    }
  }

  reset() {
    this.value = this.max;
  }

  static get BossHealth() {
    return currentBossHealth;
  }

  setAsBossHealth() {
    currentBossHealth = this;
  }
}