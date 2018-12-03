import MapDisplay from "../scenes/MapDisplay";
import {DEFAULTS} from "./abstract/Defaults";
import GenericStackedCrates from "./abstract/GenericStackedCrates";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class FrontStackedCrates extends GenericStackedCrates {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.FRONT);
  }
}