import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class TogglePeg extends ElevatorLike {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.TogglePegDefRect.width, levelData.TogglePegDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.TogglePegDefRect.left, this.displayOriginY + levelData.TogglePegDefRect.top);
  }
}