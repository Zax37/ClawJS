import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export default class DoNothing extends Sprite {
  constructor(scene: Scene, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.frame);

    scene.sys.displayList.add(this);
  }
}