import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export default class BehindCandy extends Sprite {
  constructor(scene: Scene, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.frame);

    if (!object.z) {
      object.z = 990;
    }

    scene.sys.displayList.add(this);
  }
}