import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";

export default class PowderKeg extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);
    this.depth = 4000;

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(this, mainLayer);

    this.setMass(1000);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}