import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import { ObjectCreationData } from '../../model/ObjectData';
import { MapDisplay } from '../../scenes/MapDisplay';
import { ElevatorLike } from '../abstract/ElevatorLike';
import { TimeCycle } from '../abstract/TimeCycle';

export class TogglePeg extends ElevatorLike {
  private cycle: TimeCycle;
  private switchPoint: number;
  private timer = 0;
  private sound: string;
  private static?: boolean;

  constructor(protected scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, { ...object, animation: 'GAME_FORWARD50' });
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.TogglePegDefRect.width, levelData.TogglePegDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.TogglePegDefRect.left, this.displayOriginY + levelData.TogglePegDefRect.top);

    if (object.smarts === 1) {
      this.static = true;
    } else {
      let diff = object.speed || 0;
      if (!diff) {
        switch (object.logic) {
          case 'TogglePeg2':
            diff = 750;
            break;
          case 'TogglePeg3':
            diff = 1500;
            break;
          case 'TogglePeg4':
            diff = 2250;
            break;
          default:
            break;
        }
      }

      const timeOn = object.speedX || 1500;
      const timeOff = object.speedY || 1500;
      const fullCycle = timeOn + timeOff;

      this.cycle = new TimeCycle(diff, fullCycle);
      this.switchPoint = timeOn / fullCycle;

      this.sound = scene.getLevelData().AlternativePegSlideSound || 'LEVEL_PEGSLIDE';
    }
  }

  playSoundIfNearEnough() {
    if (Math.abs(this.x - this.scene.claw.x) < CANVAS_WIDTH && Math.abs(this.y - this.scene.claw.y) < CANVAS_HEIGHT) {
      this.scene.game.soundsManager.playSound(this.sound);
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.static) {
      if (this.cycle.getProgress(this.timer += delta) < this.switchPoint) {
        if (!this.body.enable) {
          this.anims.playReverse(this.animation);
          this.body.enable = true;
          this.playSoundIfNearEnough();
        }
      } else if (this.body.enable) {
        this.anims.play(this.animation);
        this.body.enable = false;
        this.playSoundIfNearEnough();
      }
    }
  }
}
