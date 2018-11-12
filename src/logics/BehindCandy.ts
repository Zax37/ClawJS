import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class BehindCandy extends Sprite {
  constructor(scene: Scene, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.image + object.frame);

    if (!object.z) {
      object.z = 990;
    }

    scene.sys.displayList.add(this);
  }
}