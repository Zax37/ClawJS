import { CANVAS_WIDTH } from '../../config';
import { ObjectCreationData } from '../../model/ObjectData';
import MapDisplay from '../../scenes/MapDisplay';
import Health from '../abstract/Health';
import CaptainClaw from './CaptainClaw';
import CaptainClawAttack from './CaptainClawAttack';
import Enemy from '../abstract/Enemy';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

const STAND_DELAY = 4100;
const HURT_DELAY = 350;
const STAND_ANIMATION_CHANGE_DELAY = 1000;

export default class HumanEnemy extends Enemy {
  protected animations: {
    [key: string]: Phaser.Animations.Animation;
  };

  health: Health;

  protected idleSounds: string[] = [];
  protected attackSound?: string;
  protected deathSound: string;
  protected strikeSound?: string;

  private standingSince: number;
  private standingAnimationChangeDelay: number;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData) {
    super(scene, mainLayer, object);

    this.animations = scene.game.animationManager.requestEnemyAnimations(object.texture, object.image);

    switch (object.logic) {
      case 'Officer':
        this.idleSounds = [ 'LEVEL_OFFICER_EHEM1', 'LEVEL_OFFICER_EHEM2' ];
        this.attackSound = 'LEVEL_OFFICER_00340024';
        this.deathSound = 'LEVEL_OFFICER_00' + (340014 + Math.round(Math.random()));
        this.strikeSound = 'LEVEL_OFCSWSTB8-22';
        break;
      case 'Soldier':
        this.attackSound = 'LEVEL_SOLDIER_00320020';
        this.deathSound = 'LEVEL_SOLDIER_00' + (320005 + Math.round(Math.random()));
        this.attackRange = CANVAS_WIDTH / 2;
        this.strikeSound = 'LEVEL_SOLGUNFR8-22';
        break;
      default:
        break;
    }

    this.health = new Health(scene.getBaseLevel() === 1 ? 3 : 7, scene.time);
    this.movingSpeed = 0.1;
    this.flipX = true;

    this.play(this.animations['FASTADVANCE'].key);
    this.on('animationupdate', this.animUpdate, this);
    this.on('animationcomplete', this.animComplete, this);

    this.setSize(32, 112);
    this.getGroundPatrolArea(object);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.gettingHit) {
      this.setVelocityX(this.body.velocity.x * 0.75);
    }

    if (!this.dead && !this.walking && !this.gettingHit) {
      if (time - this.standingSince < STAND_DELAY) {
        this.standingAnimationChangeDelay -= delta;
        if (this.standingAnimationChangeDelay <= 0) {
          this.stand(time);
        }
      } else {
        this.walk();
      }
    }
  }

  protected patrolFlip(time: number) {
    super.patrolFlip(time);

    if (Math.random() * 100 >= 50) {
      this.stand(time);
    }
  }

  protected attack(claw: CaptainClaw) {
    super.attack(claw);
    this.play(this.animations['STRIKE'].key);
    if (Math.random() > 0.75 && this.attackSound) {
      this.say(this.attackSound);
      if (this.object.logic === 'Soldier') {
        this.attackSound = undefined;
      }
    }
  }

  protected stand(time: number) {
    if (this.walking) {
      this.standingSince = time;
      if (this.idleSounds.length && Math.random() * 100 >= 50) {
        if (this.isOnScreen()) {
          this.say(this.idleSounds[Math.floor(Math.random() * this.idleSounds.length)]);
        }
      }
    }
    super.stand(time);
    this.play(this.animations['STAND'].key, true, Math.floor(Math.random() * this.animations['STAND'].frames.length));
    this.anims.stop();
    this.standingAnimationChangeDelay = STAND_ANIMATION_CHANGE_DELAY;
  }

  protected walk() {
    super.walk();
    this.play(this.animations[this.movingSpeed >= 0.1 ? 'FASTADVANCE' : 'ADVANCE'].key);
    this.flipX = this.goingRight;
  }

  protected hit(attackSource: CaptainClawAttack) {
    if (this.health.isBeingHurt()) return;
    this.health.hurt(attackSource.damage, HURT_DELAY);
    if (this.health.isDead()) {
      super.hit(attackSource);
    } else {
      this.scene.game.soundsManager.playSound('GAME_HIT' + (Math.floor(Math.random() * 4) + 1));
      this.play(attackSource.isHigh ? this.animations['HITHIGH'].key : this.animations['HITLOW'].key, true);
      this.walking = false;
      this.gettingHit = true;
      this.body.allowGravity = false;
      this.flipX = attackSource.facingRight;
      const dir = attackSource.facingRight ? -1 : 1;
      this.setVelocity(dir * 128, -1);
    }
  }

  protected die(attackSource: CaptainClawAttack) {
    super.die(attackSource);
    this.scene.game.soundsManager.playVocalHurtSound(this.deathSound);
    if (attackSource.isSpecial) {
      this.anims.stop();
      this.frame = this.animations['HITSPECIAL'].frames[0].frame;
    } else {
      this.play(this.animations['KILLFALL'] ? this.animations['KILLFALL'].key : this.animations['FALL'].key);
    }
  }

  private animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (animation.key === this.animations['HITHIGH'].key
      || animation.key === this.animations['HITLOW'].key) {
      this.gettingHit = false;
      this.body.allowGravity = true;
      this.setVelocity(0, 0);
      this.play(this.animations['STAND'].key);
      this.anims.stop();
    } else if (!this.dead && animation.key === this.animations['STRIKE'].key) {
      this.attacking = false;
      if (this.walking) {
        this.flipX = this.goingRight;
        this.walk();
      } else {
        this.stand(this.scene.time.now);
      }
    }
  }

  private animUpdate(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (animation.key === this.animations['STRIKE'].key && frame.index === 2 && this.object.logic === 'Raux') {
      if (this.strikeSound) {
        this.scene.game.soundsManager.playSound(this.strikeSound);
      }
    }
    if (animation.key === this.animations['STRIKE'].key && frame.index === 4) {
      if (this.strikeSound && this.object.logic !== 'Raux') {
        this.scene.game.soundsManager.playSound(this.strikeSound);
      }

      if (this.object.logic === 'Soldier') {
        this.shootProjectile(60, 22, this.object.texture, 'LEVEL_MUSKETBALL', 10);
      } else if (this.canSee(this.scene.claw)) {
        this.scene.claw.hit(this);
      }
    }
  }
}