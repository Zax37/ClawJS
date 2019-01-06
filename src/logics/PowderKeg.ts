import MapDisplay from '../scenes/MapDisplay';
import PhysicsObject from './abstract/PhysicsObject';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PowderKeg extends PhysicsObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    this.setSize(28, 30);
    this.alignToGround();
    this.y -= this.body.height + 8;
    this.setActive(false);
  }
}
