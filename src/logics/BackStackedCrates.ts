import MapDisplay from "../scenes/MapDisplay";
import {DEFAULTS} from "./abstract/Defaults";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import GenericStackedCrates from "./abstract/GenericStackedCrates";

export default class BackStackedCrates extends GenericStackedCrates {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.BEHIND);
  }
}