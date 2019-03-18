import { ObjectCreationData } from '../../model/ObjectData';
import { MapDisplay } from '../../scenes/MapDisplay';

export class AmbientSound extends Phaser.GameObjects.GameObject {
  sound: Phaser.Sound.BaseSound.AudioSpriteSound;
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  spot?: boolean;

  switchTime?: number;

  minTimeOn?: number;
  maxTimeOn?: number;
  minTimeOff?: number;
  maxTimeOff?: number;

  constructor(protected scene: MapDisplay, mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, 'AmbientSound');

    if (object.logic === 'SpotAmbientSound' || object.logic === 'AmbientPosSound') {
      [this.minX, this.minY, this.maxX, this.maxY] = [object.x - 640, object.y - 640, object.x + 640, object.y + 640];
      this.spot = true;

      this.sound = scene.game.soundsManager.playAmbient(object.animation!, { volume: object.damage });
      scene.sys.updateList.add(this);
    } else {
      this.sound = scene.game.soundsManager.playAmbient(object.animation!, { volume: object.damage });
      scene.sys.updateList.add(this);

      if (object.minX && object.maxX) {
        this.minX = object.minX;
        this.minY = object.minY;
        this.maxX = object.maxX;
        this.maxY = object.maxY;
      } else if (object.hitRect) {
        [this.minX, this.minY, this.maxX, this.maxY] = object.hitRect;
      }

      if (object.moveRect) {
        [this.minTimeOn, this.maxTimeOn, this.minTimeOff, this.maxTimeOff] = object.moveRect;
        this.sound.pause();
      }

      if (this.minX && this.maxX) {
        this.sound.pause();
        /*this.sound.on('looped', () => {
          if (!this.isClawInside) {
            this.sound.pause();
          } else {
            console.log(this.scene.claw.x, this.scene.claw.y);
            console.log(this.minX, this.minY, this.maxX, this.maxY);
          }
        });*/
      }
    }
  }

  private isClawInside() {
    return !(this.minX && (this.scene.claw.x < this.minX || this.scene.claw.x > this.maxX!
      || this.scene.claw.y < this.minY! || this.scene.claw.y > this.maxY!));

  }

  preUpdate() {
    if (this.sound && this.spot) {
      if (this.sound.isPaused === this.isClawInside()) {
        if (this.sound.isPaused) {
          this.sound.resume();
        } else {
          this.sound.pause();
        }
      }
    }
  }
}
