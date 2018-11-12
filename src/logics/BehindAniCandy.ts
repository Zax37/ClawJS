import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import Game from "../game";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class BehindAniCandy extends Sprite {
  constructor(scene: Scene, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.image + object.frame);

    if (!object.z) {
      object.z = 990;
    }

    if ((scene.game as Game).animationManager.request(object.imageSet, object.image)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.play(object.image);
    }
  }
}