import MapDisplay from "../scenes/MapDisplay";
import {DEFAULTS} from "./abstract/Defaults";
import GenericCrate from "./abstract/GenericCrate";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class BehindCrate extends GenericCrate {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.BEHIND);
  }
}