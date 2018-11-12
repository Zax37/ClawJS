import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Scene = Phaser.Scene;

export default class PowderKeg extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.image + object.frame);
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