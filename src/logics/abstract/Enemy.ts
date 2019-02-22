import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import MapDisplay from '../../scenes/MapDisplay';
import Container from './Container';
import PhysicsObject from './PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import StaticObject from '../../object/StaticObject';
import CaptainClawAttack from '../CaptainClawAttack';


export default class Enemy extends PhysicsObject {
  private attacksCollider: Phaser.Physics.Arcade.Collider;

  protected container: Container;
  damage: number;

  protected walking = true;
  protected gettingHit = false;
  dead = false;
  private goingRight = true;

  protected minX: number;
  protected maxX: number;
  protected movingSpeed: number;

  private dialogLine?: StaticObject;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, {...object, z: DEFAULTS.ENEMY.z});
    this.depth = DEFAULTS.ENEMY.z;
    this.container = new Container(scene, mainLayer, object);
    this.damage = 10;

    this.movingSpeed = 0.12;

    this.scene.enemies.add(this);
    this.scene.attackable.add(this);

    this.attacksCollider = this.scene.physics.add.collider(scene.attackRects, this, (self, attackSource: CaptainClawAttack) => this.hit(attackSource));
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

  protected hit(attackSource: CaptainClawAttack) {
    this.die(attackSource);
  }

  protected die(attackSource: CaptainClawAttack) {
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
    super.preUpdate(time, delta);

    if (!this.dead) {
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

  protected say(dialogLine: string) {
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
}
