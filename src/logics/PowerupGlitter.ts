import AniCycle from "./AniCycle";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PowerupGlitter extends AniCycle {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      texture: "GAME",
      image: "GAME_GLITTER",
      animation: "GAME_CYCLE100",
    }, {});

    this.depth = object.z + 1;
  }
}