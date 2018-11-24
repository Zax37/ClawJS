import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import GenericObjectWithDefaults from "./abstract/GenericObjectWithDefaults";
import {DEFAULTS} from "./abstract/Defaults";

export default class BehindCandy extends GenericObjectWithDefaults {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.BEHIND);

    scene.sys.displayList.add(this);
  }
}