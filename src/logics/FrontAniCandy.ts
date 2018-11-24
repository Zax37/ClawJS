import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import GenericObjectWithDefaults from "./abstract/GenericObjectWithDefaults";
import {DEFAULTS} from "./abstract/Defaults";

export default class FrontAniCandy extends GenericObjectWithDefaults {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.FRONT);

    if (scene.game.animationManager.request(object.texture, object.image)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.play(object.image);
    }
  }
}