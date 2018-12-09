import PhysicsObject from "./abstract/PhysicsObject";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PowderKeg extends PhysicsObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    this.setSize(35, 30);
    this.alignToGround();
    this.y -= this.body.height + 8;
    this.setActive(false);
  }
}
