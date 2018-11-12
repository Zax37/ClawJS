import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class DoNothing extends Sprite {
  constructor(scene: Scene, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.image + object.frame);

    scene.sys.displayList.add(this);
  }
}