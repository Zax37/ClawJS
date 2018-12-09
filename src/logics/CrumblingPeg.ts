import ElevatorLike from "./abstract/ElevatorLike";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class CrumblingPeg extends ElevatorLike {
  private animation: string;
  private crumbling = false;
  private attempt = 0;
  private respawns: boolean;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    let levelData = scene.getLevelData();
    this.body.setSize(levelData.CrumblingPegDefRect.width, levelData.CrumblingPegDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.CrumblingPegDefRect.left, this.displayOriginY + levelData.CrumblingPegDefRect.top);

    if (scene.game.animationManager.request(object.texture, object.image, 'GAME_FORWARD50')) {
      this.animation = object.texture + object.image;
    }

    this.respawns = object.logic === 'CrumblingPeg';
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
      } else {
        this.visible = false;
        this.body.checkCollision.none = true;
        this.body.checkCollision.up = false;
      }
    }
  }
}