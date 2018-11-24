import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../../scenes/MapDisplay";

export default class PhysicsObject extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image ? object.image + object.frame : undefined);
    this.depth = 4000;

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(this, mainLayer);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}