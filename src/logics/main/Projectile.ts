import { AttackType } from '../../model/AttackType';
import { DEFAULTS } from '../../model/Defaults';
import { DynamicObject } from '../../object/DynamicObject';
import { MapDisplay } from '../../scenes/MapDisplay';
import { Explosion } from './Explosion';
import Vector2 = Phaser.Math.Vector2;

const MIN_VAL = 0.001;

class TileFix extends Phaser.GameObjects.GameObject {
  isSolid?: boolean;
}

export class Projectile extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  damage: number;
  facingRight: boolean;
  prevX = 0;
  private moveSpeed: number;

  constructor(protected scene: MapDisplay, protected mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, public attackType: AttackType, private object: { x: number, y: number, damage?: number, texture?: string, image?: string, animation?: string, direction: boolean }, public isSpecial?: boolean, public explodes?: boolean) {
    super(scene, mainLayer, {
      ...DEFAULTS.BULLET,
      x: object.x,
      y: object.y,
      texture: object.texture || DEFAULTS.BULLET.texture,
      image: object.image || DEFAULTS.BULLET.image,
      animation: object.animation || 'GAME_CYCLE50',
    }, {}, true);

    this.damage = object.damage || 8;
    this.moveSpeed = attackType === AttackType.PLAYER ? 0.8 : 0.5;

    this.facingRight = this.flipX = object.direction;
    scene.physics.add.existing(this, false);
    scene.attackRects.add(this);

    this.scene.physics.add.overlap(this, mainLayer, (self, tile: TileFix) => {
      if (tile.isSolid) {
        this.collision();
      }
    });

    this.body.velocity = new Vector2(object.direction ? -MIN_VAL : MIN_VAL, 0);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.object.direction) {
      this.x -= delta * this.moveSpeed;
    } else {
      this.x += delta * this.moveSpeed;
    }

    if (this.prevX === this.x) {
      this.collision();
    } else {
      this.prevX = this.x;
    }
  }

  collision() {
    if (this.explodes) {
      const explosion = new Explosion(this.scene, this.mainLayer, {
        x: this.x,
        y: this.y + 10,
        z: this.z,
      });
    }
    this.destroy();
  }
}
