import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import { DEFAULTS } from '../model/Defaults';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Vector2 = Phaser.Math.Vector2;
import GameObject = Phaser.GameObjects.GameObject;

const MIN_VAL = 0.001;

class TileFix extends GameObject {
  isSolid?: boolean;
}

export default class Projectile extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  damage: number;
  facingRight: boolean;
  prevX = 0;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, private object: { x: number, y: number, damage?: number, image?: string, direction: boolean }, public isSpecial?: boolean) {
    super(scene, mainLayer, {
      ...DEFAULTS.BULLET,
      x: object.x,
      y: object.y,
      image: object.image || 'GAME_BULLETS',
    });

    this.damage = object.damage || 8;

    this.facingRight = this.flipX = object.direction;
    scene.physics.add.existing(this, false);
    scene.attackRects.add(this);

    this.scene.physics.add.overlap(this, mainLayer, (self, tile: TileFix) => {
      if (tile.isSolid) {
        this.destroy();
      }
    });

    this.body.velocity = new Vector2(object.direction ? -MIN_VAL : MIN_VAL, 0);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.object.direction) {
      this.x -= delta;
    } else {
      this.x += delta;
    }

    if (this.prevX === this.x) {
      this.destroy();
    } else {
      this.prevX = this.x;
    }
  }
}
