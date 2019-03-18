import { AttackType } from '../../model/AttackType';
import { MapDisplay } from '../../scenes/MapDisplay';
import { CaptainClaw } from './CaptainClaw';

const SWORD_ATTACK_RECT = { x: 70, y: -2, width: 42, height: 21 };

export class CaptainClawAttack extends Phaser.GameObjects.Zone {
  body: Phaser.Physics.Arcade.Body;
  xDiff: number;
  yDiff: number;
  damage: number;
  targetInSwordRange = false;
  lastOverlap = 0;
  facingRight = false;
  isHigh = false;
  isSpecial = false;
  attackType = AttackType.PLAYER;

  constructor(protected scene: MapDisplay, protected claw: CaptainClaw) {
    super(scene, claw.x + SWORD_ATTACK_RECT.x, claw.y - SWORD_ATTACK_RECT.y, SWORD_ATTACK_RECT.width, SWORD_ATTACK_RECT.height);
    this.xDiff = SWORD_ATTACK_RECT.x;
    this.yDiff = SWORD_ATTACK_RECT.y;
    this.damage = 0;

    this.setOrigin(0, 0);
    scene.physics.add.existing(this);
    this.body.allowGravity = false;

    scene.physics.add.overlap(this, scene.attackable, () => {
      this.targetInSwordRange = true;
      this.lastOverlap = scene.time.now + 10;
    });

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
    this.facingRight = this.claw.flipX;
    const x = this.claw.flipX ? this.claw.body.left - (this.xDiff + this.width) : this.claw.body.right + this.xDiff;
    this.setPosition(x, this.claw.y + this.yDiff);

    if (time - delta > this.lastOverlap) {
      this.targetInSwordRange = false;
    }
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
