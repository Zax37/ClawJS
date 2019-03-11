import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import { AttackType } from '../../model/AttackType';
import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import { PowerupType } from '../../model/PowerupType';
import MapDisplay from '../../scenes/MapDisplay';
import Tile from '../../tilemap/Tile';
import CaptainClaw from '../main/CaptainClaw';
import Explosion from '../main/Explosion';
import Projectile from '../main/Projectile';
import Container from './Container';
import PhysicsObject from './PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import StaticObject from '../../object/StaticObject';
import CaptainClawAttack from '../main/CaptainClawAttack';


export default class Enemy extends PhysicsObject {
  private attacksCollider: Phaser.Physics.Arcade.Collider;

  protected container: Container;
  damage: number;
  dead = false;

  protected walking = true;
  protected gettingHit = false;
  protected goingRight = true;
  protected attacking = false;

  protected minX: number;
  protected maxX: number;
  protected movingSpeed: number;
  protected seesClaw: boolean;
  protected attackRange = 100;

  dialogLine?: StaticObject;
  noBodyAttack: boolean;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, {...object, z: DEFAULTS.ENEMY.z});
    this.depth = DEFAULTS.ENEMY.z;
    this.container = new Container(scene, mainLayer, object);
    this.container.registerContents(scene.game.treasureRegistry);
    this.damage = 10;

    this.scene.enemies.add(this);
    this.scene.attackable.add(this);

    this.attacksCollider = this.scene.physics.add.collider(scene.attackRects, this, (self, attackSource: CaptainClawAttack | Projectile | Explosion) => {
      if (attackSource.attackType !== AttackType.ENEMY) {
        this.hit(attackSource);
      }
    });
  }

  protected getGroundPatrolArea(object: ObjectCreationData) {
    const tile = this.alignToGround();
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
  }

  protected hit(attackSource: CaptainClawAttack | Projectile | Explosion) {
    this.die(attackSource);
  }

  protected die(attackSource: CaptainClawAttack | Projectile | Explosion) {
    if (this.tilesCollider) {
      this.tilesCollider.destroy();
      this.tilesCollider = undefined;
    }
    this.dead = true;
    this.depth = DEFAULTS.FRONT.z;
    this.setVelocity(attackSource.facingRight ? -100 : 100, -400);
    this.container.dropContents(this.x, this.y, Math.random() * 20 - 5, -300, 20);
    this.scene.game.soundsManager.playSound('GAME_HIT' + Math.floor(1 + Math.random() * 4));
  }

  isOnScreen() {
    return Math.abs(this.x - this.scene.claw.x) < CANVAS_WIDTH && Math.abs(this.y - this.scene.claw.y) < CANVAS_HEIGHT;
  }

  preUpdate(time: number, delta: number) {
    if (this.scene.transitioning) return;
    super.preUpdate(time, delta);

    if (this.dialogLine) {
      this.dialogLine.x = this.x;
      this.dialogLine.y = this.body.top - 30;
    }

    if (!this.dead && !this.gettingHit) {
      if (this.seesClaw) {
        if (!this.attacking) {
          if (this.canSee(this.scene.claw)) {
            this.attack(this.scene.claw);
          } else {
            this.seesClaw = false;
          }
        }
      } else {
        if (this.attackRange && this.canSee(this.scene.claw)) {
          this.seesClaw = true;
          this.walking = false;
        }
        if (this.walking) {
          const dir = this.goingRight ? 1 : -1;
          this.body.setVelocityX(dir);
          this.x += dir * delta * this.movingSpeed;
          if ((this.goingRight && (this.x >= this.maxX || this.body.blocked.right)) || (!this.goingRight && (this.x <= this.minX || this.body.blocked.left))) {
            this.patrolFlip(time);
          }
        } else {
          this.setVelocityX(0);
        }
      }
    }
  }

  protected attack(claw: CaptainClaw) {
    this.attacking = true;
    this.flipX = Math.sign(claw.x - this.x) > 0;
  }

  protected canSee(claw: CaptainClaw) {
    const baseCondition = claw.powerup !== PowerupType.INVISIBILITY && (Math.abs(claw.y - this.y) < 50 && Math.abs(claw.x - this.x) < this.attackRange);
    if (baseCondition) {
      const enemyEyesLevel = 0.4 * this.y + 0.6 * this.body.top;
      const fromX = Math.floor(Math.min(claw.x, this.x) / this.mainLayer.tilemap.tileWidth);
      const fromY = Math.floor(Math.min(claw.y, enemyEyesLevel) / this.mainLayer.tilemap.tileHeight);
      const toX = Math.ceil(Math.max(claw.x, this.x) / this.mainLayer.tilemap.tileWidth);

      const tilesOnTheWay = this.mainLayer.getTilesWithin(fromX, fromY, toX - fromX, 2);
      for (let i = 0; i < tilesOnTheWay.length; i++) {
        const tile: Tile = tilesOnTheWay[i];
        if (tile.isSolid) {
          if (!tile.physics || !tile.physics.rect || tile.physics.invert) {
            return false;
          }
          const rect = tile.physics.rect;
          if (tile.pixelY + rect.bottom > enemyEyesLevel && tile.pixelY + rect.top < enemyEyesLevel) {
            return false;
          }
        }
      }
    }
    return baseCondition;
  }

  protected patrolFlip(time: number, dontFlip?: boolean) {
    this.goingRight = !this.goingRight;
    if (!dontFlip) {
      this.flipX = this.goingRight;
    }
  }

  protected stand(time: number) {
    this.walking = false;
  }

  protected walk() {
    this.walking = true;
  }

  say(dialogLine: string) {
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

  protected shootProjectile(xDiff: number, yDiff: number, texture?: string, image?: string, damage?: number, animation?: string, explodes?: boolean) {
    const projectile = new Projectile(this.scene, this.mainLayer, AttackType.ENEMY, { x: this.x + (this.flipX ? xDiff : -xDiff), y: this.body.top + yDiff, texture, image, animation, damage, direction: !this.flipX }, false, explodes);
    projectile.flipX = !projectile.flipX;
    return projectile;
  }
}
