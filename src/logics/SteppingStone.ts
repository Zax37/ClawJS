import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class SteppingStone extends ElevatorLike {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.SteppingStoneDefRect.width, levelData.SteppingStoneDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.SteppingStoneDefRect.left, this.displayOriginY + levelData.SteppingStoneDefRect.top);
  }
}