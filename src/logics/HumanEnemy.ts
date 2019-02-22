import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Health from './abstract/Health';
import CaptainClawAttack from './CaptainClawAttack';
import Enemy from './abstract/Enemy';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

const STAND_DELAY = 4100;
const HURT_DELAY = 350;
const STAND_ANIMATION_CHANGE_DELAY = 1000;

export default class HumanEnemy extends Enemy {
  private animations: {
    [key: string]: Phaser.Animations.Animation;
  };

  protected health: Health;

  protected idleSounds: string[];
  protected deathSound: string;

  private standingSince: number;
  private standingAnimationChangeDelay: number;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);

    this.animations = scene.game.animationManager.requestEnemyAnimations(object.texture, object.image);

    switch (object.logic) {
      case 'Officer':
        this.idleSounds = [ 'LEVEL_OFFICER_EHEM1', 'LEVEL_OFFICER_EHEM2' ];
        this.deathSound = 'LEVEL_OFFICER_00' + (340014 + Math.round(Math.random()));
        break;
      case 'Soldier':
        this.idleSounds = [];
        this.deathSound = 'LEVEL_SOLDIER_00' + (320005 + Math.round(Math.random()));
        break;
      default:
        break;
    }

    this.health = new Health(scene.getBaseLevel() === 1 ? 3 : 7, scene.time);

    this.play(this.animations['FASTADVANCE'].key);
    this.on('animationcomplete', this.animComplete, this);

    this.setSize(32, 112);
    this.getGroundPatrolArea(object);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
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
    this.play(this.animations['FASTADVANCE'].key);
  }

  protected hit(attackSource: CaptainClawAttack) {
    const oldValue = this.health.value;
    this.health.hurt(attackSource.damage, HURT_DELAY);
    if (this.health.isDead()) {
      super.hit(attackSource);
    } else if (oldValue > this.health.value) {
      this.scene.game.soundsManager.playSound('GAME_HIT' + (Math.floor(Math.random() * 4) + 1));
      this.play(attackSource.isHigh ? this.animations['HITHIGH'].key : this.animations['HITLOW'].key, true);
      this.walking = false;
      this.gettingHit = true;
      setTimeout(() => this.gettingHit = false, 150);
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
      this.play(this.animations['STAND'].key);
      this.anims.stop();
    }
  }
}