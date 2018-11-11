import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export default class FrontCandy extends Sprite {
  constructor(scene: Scene, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.frame);

    if (!object.z) {
      object.z = 5100;
    }

    scene.sys.displayList.add(this);
  }
}