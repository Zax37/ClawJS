import MapDisplay from '../scenes/MapDisplay';
import CaptainClaw from './CaptainClaw';

const SWORD_ATTACK_RECT = { x: 80, y: -2, width: 32, height: 21 };

export default class CaptainClawAttack extends Phaser.GameObjects.Zone {
  body: Phaser.Physics.Arcade.Body;
  xDiff: number;
  yDiff: number;
  damage: number;

  constructor(protected scene: MapDisplay, protected claw: CaptainClaw) {
    super(scene, claw.x + SWORD_ATTACK_RECT.x, claw.y - SWORD_ATTACK_RECT.y, SWORD_ATTACK_RECT.width, SWORD_ATTACK_RECT.height);
    this.xDiff = SWORD_ATTACK_RECT.x;
    this.yDiff = SWORD_ATTACK_RECT.y;
    this.damage = 0;

    this.setOrigin(0, 0);
    scene.physics.add.existing(this);
    this.body.allowGravity = false;

    scene.sys.updateList.add(this);
  }

  setAttacking(on: boolean) {
    if (on) {
      this.scene.attackRects.add(this);
    } else {
      this.scene.attackRects.remove(this);
      this.xDiff = SWORD_ATTACK_RECT.x;
      this.yDiff = SWORD_ATTACK_RECT.y;
      this.body.setSize(SWORD_ATTACK_RECT.width, SWORD_ATTACK_RECT.height);
    }
  }

  preUpdate(time: number, delta: number) {
    const x = this.claw.flipX ? this.claw.body.left - (this.xDiff + this.width) : this.claw.body.right + this.xDiff;
    this.setPosition(x, this.claw.y + this.yDiff);
  }

  updateRect(xDiff: number, yDiff: number, width: number, height: number) {
    this.xDiff = xDiff;
    this.yDiff = yDiff;

    if (this.claw.flipX) {
      xDiff = -xDiff - width;
    }

    this.setPosition(this.claw.x + xDiff, this.claw.y + yDiff);
    this.body.setSize(width, height);
  }
}