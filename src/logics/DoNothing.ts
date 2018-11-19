import Sprite = Phaser.GameObjects.Sprite;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";

export default class DoNothing extends Sprite {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);

    scene.sys.displayList.add(this);
  }
}