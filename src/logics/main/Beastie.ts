import { CANVAS_WIDTH } from '../../config';
import { AttackType } from '../../model/AttackType';
import { ObjectCreationData } from '../../model/ObjectData';
import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import CaptainClaw from './CaptainClaw';
import CaptainClawAttack from './CaptainClawAttack';
import Enemy from '../abstract/Enemy';
import Projectile from './Projectile';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Beastie extends Enemy {
  private cannon?: DynamicObject;
  private nonMoving?: boolean;
  private beenInRange?: boolean;

  private animations: {
    [key: string]: Phaser.Animations.Animation;
  };

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData) {
    super(scene, mainLayer, object);
    const animKeys: string[] = [];

    if (object.logic === 'PunkRat') {
      this.minX = this.x - 30;
      this.maxX = this.x + 15;
      this.body.allowGravity = false;
      this.noBodyAttack = true;
      animKeys.push('LEVEL_PUNKRAT_STRIKE');
      animKeys.push('LEVEL_PUNKRAT_RECOIL');

      const mirror = (object.drawFlags && object.drawFlags.mirror) !== undefined;
      this.cannon = new DynamicObject(scene, mainLayer, {
        x: (mirror ? -20 : 0) + object.x,
        y: object.y + 15,
        z: object.z - 1,
        logic: 'GroundCannon',
        texture: object.texture,
        image: 'LEVEL_CANNON',
        animation: 'GAME_FORWARD100',
        frame: 1,
      });
      this.cannon.flipX = mirror;
      this.cannon.depth = this.cannon.z;
      this.cannon.on('animationupdate', (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
        if (frame.index === 2) {
          if (this.dead) {
            this.cannon!.anims.stop();
            this.cannon!.setFrame('LEVEL_CANNON1');
          } else {
            const projectile = new Projectile(this.scene, this.mainLayer, AttackType.ENEMY, {
              x: this.cannon!.x + (mirror ? -50 : 50),
              y: this.cannon!.y + 4,
              texture: 'LEVEL2',
              image: 'LEVEL_CANNONBALL',
              damage: 10,
              direction: mirror
            });
          }
        }
      });
      this.cannon.on('animationcomplete', () => this.cannon!.setFrame('LEVEL_CANNON1'));
      this.attackRange = 0;
    } else if (object.logic === 'Rat') {
      if (object.userValues && object.userValues[0]) {
        this.nonMoving = true;
      }
      this.setSize(32, 52);
      this.getGroundPatrolArea(object);
      this.maxX += 16;
      this.attackRange = CANVAS_WIDTH / 2;
    }

    if (!this.nonMoving) {
      this.movingSpeed = 0.07;
      animKeys.push('LEVEL_RAT_WALK');
      animKeys.push('LEVEL_RAT_THROW');
    }

    this.on('animationcomplete', this.animComplete, this);
    this.on('animationupdate', this.animUpdate, this);

    this.animations = this.scene.game.animationManager.requestBeastieAnimations(object.texture, object.image, animKeys);
    if (!this.nonMoving) {
      this.play(this.animations['walk'].key);
    }
  }

  protected attack(claw: CaptainClaw) {
    super.attack(claw);
    if (this.animations['throw']) {
      this.play(this.animations['throw'].key);
    }
  }

  protected patrolFlip(time: number) {
    super.patrolFlip(time, true);
    if (this.animations['walk']) {
      this.play(this.animations['walk'].key);
    }

    if (this.object.logic === 'PunkRat' && this.isOnScreen()) {
      if (this.cannon!.flipX !== this.x <= this.minX) {
        this.nonMoving = true;
        if (this.animations['strike']) {
          this.play(this.animations['strike'].key);
        }
      }
    }
  }

  protected die(attackSource: CaptainClawAttack) {
    super.die(attackSource);
    this.body.allowGravity = true;
    this.anims.stop();
    this.setFrame(this.object.image + 7);
    this.scene.game.soundsManager.playSound('GAME_MOUSEKILL');
  }

  preUpdate(time: number, delta: number) {
    if (!this.beenInRange && this.isOnScreen()) {
      this.beenInRange = true;
      this.scene.game.soundsManager.playSound('GAME_EEHH');
    }
    this.walking = !this.nonMoving;
    super.preUpdate(time, delta);
  }

  private animUpdate(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (this.isOnScreen()) {
      if (this.animations['throw'] && animation.key === this.animations['throw'].key) {
        if (frame.index === 2) {
          this.scene.game.soundsManager.playSound('GAME_HOLDAIM');
        } else if (frame.index === 3) {
          this.scene.game.soundsManager.playSound('GAME_THRWBOMB');
          this.shootProjectile(8, -12, this.object.texture, 'LEVEL_RATBOMB', 10, 'LEVEL_RATBOMB', true);
        }
      } else if (this.animations['walk'] && animation.key === this.animations['walk'].key) {
        if (frame.index === 2) {
          this.scene.game.soundsManager.playSound('GAME_MLF');
        } else if (frame.index === 3) {
          this.scene.game.soundsManager.playSound('GAME_MRF');
        }
      }
    }
  }

  private animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (this.animations['strike'] && animation.key === this.animations['strike'].key && !this.dead) {
      this.cannon!.playAnimation();
      this.play(this.animations['recoil'].key);
      this.scene.game.soundsManager.playSound('LEVEL_CANONSH1', { delay: 0.1 });
      this.y -= 20;
    } else if (this.animations['recoil'] && animation.key === this.animations['recoil'].key) {
      this.play(this.animations['walk'].key);
      this.nonMoving = false;
      this.y += 20;
    } else if (!this.dead && this.animations['throw'] && animation.key === this.animations['throw'].key) {
      this.attacking = false;
      if (!this.nonMoving && this.animations['walk']) {
        this.play(this.animations['walk'].key);
        this.walk();
      }
    }
  }
}
