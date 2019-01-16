import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class CrumblingPeg extends ElevatorLike {
  private crumbling = false;
  private attempt = 0;
  private respawns: boolean;
  private sound: string;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, { animation: 'GAME_FORWARD50' });
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.CrumblingPegDefRect.width, levelData.CrumblingPegDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.CrumblingPegDefRect.left, this.displayOriginY + levelData.CrumblingPegDefRect.top);

    this.respawns = object.logic === 'CrumblingPeg';
    this.sound = scene.getLevelData().AlternativePegCrumbleSound || 'LEVEL_PEGCRUMBLE';
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.crumbling) {
      if (this.anims.getProgress() > 0.5) {
        if (this.body) {
          this.body.checkCollision.none = true;
          this.body.checkCollision.up = false;
        }
        if (this.anims.getProgress() === 1) {
          if (this.respawns) {
            this.visible = false;
          } else {
            this.destroy();
          }
        }

        if (this.scene.claw.attempt !== this.attempt && this.respawns) {
          this.crumbling = false;
          this.anims.setProgress(0);
          this.anims.stop();
          this.visible = true;
          this.body.checkCollision.none = false;
          this.body.checkCollision.up = true;
          this.attempt = this.scene.claw.attempt;
          this.objectStandingOnIt = undefined;
        }
      }
    } else if (this.objectStandingOnIt) {
      this.crumbling = true;
      this.attempt = this.scene.claw.attempt;
      if (this.animation) {
        this.play(this.animation);
        this.scene.sound.playAudioSprite('sounds', this.sound);
      } else {
        this.visible = false;
        this.body.checkCollision.none = true;
        this.body.checkCollision.up = false;
      }
    }
  }
}