import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Container from './abstract/Container';
import Health from './abstract/Health';
import PhysicsObject from './abstract/PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import StaticObject from '../object/StaticObject';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import CaptainClawAttack from './CaptainClawAttack';

const STAND_DELAY = 4100;
const STAND_ANIMATION_CHANGE_DELAY = 1000;
const HURT_DELAY = 350;

export default class Enemy extends PhysicsObject {
  private animations: {
    [key: string]: Phaser.Animations.Animation;
  };

  protected idleSounds: string[];
  protected deathSound: string;

  private attacksCollider: Phaser.Physics.Arcade.Collider;

  protected container: Container;
  protected health: Health;
  protected damage: number;

  protected walking = true;
  protected dead = false;
  private goingRight = true;

  private minX: number;
  private maxX: number;

  private standingSince: number;
  private standingAnimationChangeDelay: number;
  private dialogLine?: StaticObject;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, {...object, z: DEFAULTS.ENEMY.z});
    this.depth = DEFAULTS.ENEMY.z;
    this.container = new Container(scene, mainLayer, object);
    this.health = new Health(scene.getBaseLevel() === 1 ? 3 : 7, scene.time);
    this.damage = 10;

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

    this.play(this.animations['FASTADVANCE'].key);
    this.flipX = true;

    this.setSize(32, 112);
    const tile = this.alignToGround();
    this.scene.enemies.add(this);
    this.scene.attackable.add(this);

    if (tile) {
      let prevTile = tile;
      do {
        this.minX = (prevTile.physics.rect ? prevTile.pixelX + prevTile.physics.rect.left : prevTile.pixelX) + 16;
        prevTile = prevTile.tilemap.getTileAt(prevTile.x - 1, prevTile.y);
      } while (prevTile && (prevTile.collides || prevTile.customCollision));

      let nextTile = tile;
      do {
        this.maxX = (nextTile.physics.rect ? nextTile.pixelX + nextTile.physics.rect.right + 1 : nextTile.pixelX + nextTile.width) - 16;
        nextTile = nextTile.tilemap.getTileAt(nextTile.x + 1, nextTile.y);
      } while (nextTile && (nextTile.collides || nextTile.customCollision));

      this.maxX = object.maxX ? Math.min(this.maxX, object.maxX) : this.maxX;
      this.minX = object.minX ? Math.max(this.minX, object.minX) : this.minX;
    }

    this.attacksCollider = this.scene.physics.add.collider(scene.attackRects, this, (self, attackSource: CaptainClawAttack) => {
      let oldValue = this.health.value;
      this.health.hurt(attackSource.damage, HURT_DELAY);
      if (this.health.isDead()) {
        this.die(attackSource.leftDirection, attackSource.isSpecial);
      } else if (oldValue > this.health.value) {
        this.scene.game.soundsManager.playSound('GAME_HIT' + (Math.floor(Math.random() * 4) + 1));
        this.play(attackSource.body.top > this.body.center.y ? this.animations['HITLOW'].key : this.animations['HITHIGH'].key, true);
        this.walking = false;
      }
    });
    this.on('animationcomplete', this.animComplete, this);
  }

  private die(hitFromLeft?: boolean, special?: boolean) {
    if (this.tilesCollider) {
      this.tilesCollider.destroy();
      this.tilesCollider = undefined;
    }
    this.scene.game.soundsManager.playVocal(this.deathSound, { volume: this.scene.game.soundsManager.getSoundsVolume() });
    if (special) {
      this.anims.stop();
      this.frame = this.animations['HITSPECIAL'].frames[0].frame;
    } else {
      this.play(this.animations['KILLFALL'] ? this.animations['KILLFALL'].key : this.animations['FALL'].key);
    }
    this.dead = true;
    this.body.velocity.x = hitFromLeft ? -100 : 100;
    this.body.velocity.y = -400;
    this.container.dropContents(this.x, this.y, Math.random() * 20 - 5, -300, 20);
    this.scene.game.soundsManager.playSound('GAME_HIT' + Math.floor(1 + Math.random() * 4));
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.dead) {
      if (this.walking) {
        const dir = this.goingRight ? 1 : -1;
        this.body.setVelocityX(dir);
        this.x += dir * delta * 0.12;
        if ((this.goingRight && (this.x >= this.maxX || this.body.blocked.right)) || (!this.goingRight && (this.x <= this.minX || this.body.blocked.left))) {
          this.goingRight = !this.goingRight;
          this.flipX = this.goingRight;

          if (Math.random() * 100 >= 50) {
            this.walking = false;
            this.standingSince = time;
            this.standingAnimationChangeDelay = 0;

            if (this.idleSounds.length && Math.random() * 100 >= 50) {
              if (Math.abs(this.x - this.scene.claw.x) < CANVAS_WIDTH && Math.abs(this.y - this.scene.claw.y) < CANVAS_HEIGHT) {
                this.say(this.idleSounds[Math.floor(Math.random() * this.idleSounds.length)]);
              }
            }
          }
        }
      } else {
        this.body.setVelocityX(0);

        if (this.anims.currentAnim.key === this.animations['HITHIGH'].key
          || this.anims.currentAnim.key === this.animations['HITLOW'].key) {
          // ...
        } else if (time - this.standingSince < STAND_DELAY) {
          this.standingAnimationChangeDelay -= delta;
          if (this.standingAnimationChangeDelay <= 0) {
            this.play(this.animations['STAND'].key, true, Math.floor(Math.random() * this.animations['STAND'].frames.length));
            this.anims.stop();
            this.standingAnimationChangeDelay = STAND_ANIMATION_CHANGE_DELAY;
          }
        } else {
          this.walking = true;
          this.play(this.animations['FASTADVANCE'].key);
        }
      }
    }
  }

  private say(dialogLine: string) {
    if (!this.dialogLine) {
      this.dialogLine = new StaticObject(this.scene, this.mainLayer, {
        x: this.x,
        y: this.body.top - 30,
        z: this.depth + 1,
        logic: 'EnemyDialog',
        texture: 'GAME',
        image: 'GAME_EXCLAMATION',
        frame: 1,
      });

      this.scene.game.soundsManager.playVocal(dialogLine).on('ended', () => {
        this.dialogLine!.destroy();
        this.dialogLine = undefined;
      });
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
