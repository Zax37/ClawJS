import ElevatorLike from "./abstract/ElevatorLike";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class TogglePeg extends ElevatorLike {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    let levelData = scene.getLevelData();
    this.body.setSize(levelData.TogglePegDefRect.width, levelData.TogglePegDefRect.height);
    this.body.setOffset(levelData.TogglePegDefRect.offsetX, levelData.TogglePegDefRect.offsetY);
  }
}