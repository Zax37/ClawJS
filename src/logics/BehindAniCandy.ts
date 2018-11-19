import Sprite = Phaser.GameObjects.Sprite;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Game from "../game";
import MapDisplay from "../scenes/MapDisplay";

export default class BehindAniCandy extends Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);

    if (!object.z) {
      object.z = 990;
    }

    if ((scene.game as Game).animationManager.request(object.texture, object.image)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.play(object.image);
    }
  }
}