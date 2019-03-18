import { ObjectCreationData } from '../../model/ObjectData';
import { MapDisplay } from '../../scenes/MapDisplay';
import { PhysicsObject } from '../abstract/PhysicsObject';

export class PowderKeg extends PhysicsObject {
  constructor(scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.setSize(28, 30);
    this.alignToGround();
    this.y -= this.body.height + 8;
    this.setActive(false);
  }
}
