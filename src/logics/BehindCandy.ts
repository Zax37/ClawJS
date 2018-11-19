import Sprite = Phaser.GameObjects.Sprite;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";

export default class BehindCandy extends Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);

    if (!object.z) {
      object.z = 990;
    }

    scene.sys.displayList.add(this);
  }
}