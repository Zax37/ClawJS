import { ObjectData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class AmbientSound extends Phaser.GameObjects.GameObject {
  sound: Phaser.Sound.BaseSound.AudioSpriteSound;
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectData) {
    super(scene, 'AmbientSound');

    if (object.logic === 'GlobalAmbientSound') {
      this.sound = scene.game.soundsManager.playAmbient(object.animation!, { volume: object.damage });
      scene.sys.updateList.add(this);

      if (object.moveRect) {
        [this.minX, this.minY, this.maxX, this.maxY] = object.moveRect;
      } else if (object.minX || object.maxX) {
        this.minX = object.minX;
        this.minY = object.minY;
        this.maxX = object.maxX;
        this.maxY = object.maxY;
      } else if (object.hitRect) {
        [this.minX, this.minY, this.maxX, this.maxY] = object.hitRect;
      }

      if (!this.isClawInside) {
        this.sound.pause();
      }
    }
  }

  private isClawInside() {
    return !(this.minX && (this.scene.claw.x < this.minX || this.scene.claw.x > this.maxX!
      || this.scene.claw.y < this.minY! || this.scene.claw.y > this.maxY!));

  }

  preUpdate() {
    if (this.sound && this.minX) {
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
