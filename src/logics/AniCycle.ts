import GenericObjectWithDefaults from "./abstract/GenericObjectWithDefaults";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class AniCycle extends GenericObjectWithDefaults {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any, defaults: any) {
    super(scene, mainLayer, object, defaults);

    if (scene.game.animationManager.request(object.texture, object.image, object.animation)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.play(object.texture + object.image);
    }
  }
}
