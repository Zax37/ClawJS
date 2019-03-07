import MapDisplay from '../../scenes/MapDisplay';
import PhysicsObject from '../abstract/PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { ObjectCreationData } from '../../model/ObjectData';

export default class PowderKeg extends PhysicsObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.setSize(28, 30);
    this.alignToGround();
    this.y -= this.body.height + 8;
    this.setActive(false);
  }
}
