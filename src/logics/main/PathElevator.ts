import { ObjectCreationData } from '../../model/ObjectData';
import { MapDisplay } from '../../scenes/MapDisplay';
import { ElevatorLike } from '../abstract/ElevatorLike';

export class PathElevator extends ElevatorLike {
  speedX: number;
  speedY: number;

  constructor(scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.ElevatorDefRect.width, levelData.ElevatorDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.ElevatorDefRect.left, this.displayOriginY + levelData.ElevatorDefRect.top);

    this.speedX = (object.speedX || 125);
    this.speedY = (object.speedY || 125);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.postUpdate();
  }

  postUpdate() {
    super.postUpdate();
  }
}
