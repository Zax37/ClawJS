import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import {DEFAULTS} from "./abstract/Defaults";
import AniCycle from "./AniCycle";

export default class FrontAniCandy extends AniCycle {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.FRONT);
  }
}