import { WaterRockDefRect } from '../model/LevelBasedData';
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class SpringBoard extends ElevatorLike {
  private jumpHeight: number;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();

    if (object.logic === 'WaterRock') {
      this.body.setSize(WaterRockDefRect.width, WaterRockDefRect.height);
      this.body.setOffset(this.displayOriginX + WaterRockDefRect.left, this.displayOriginY + WaterRockDefRect.top);
    } else {
      this.body.setSize(levelData.SpringBoardDefRect.width, levelData.SpringBoardDefRect.height);
      this.body.setOffset(this.displayOriginX + levelData.SpringBoardDefRect.left, this.displayOriginY + levelData.SpringBoardDefRect.top);
    }

    this.jumpHeight = object.maxY || 450;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    /*if (this.objectStandingOnIt instanceof CaptainClaw) {
      this.objectStandingOnIt.jumpingPassively = true;
      this.objectStandingOnIt.passiveJumpHeight = this.jumpHeight;
      this.objectStandingOnIt.jump(time);
    }*/

    this.postUpdate();
  }

  postUpdate() {
    super.postUpdate();
  }
}