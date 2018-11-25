import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import ElevatorLike from "./abstract/ElevatorLike";

export default class Elevator extends ElevatorLike {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  speedX: number;
  speedY: number;
  goingRight: boolean;
  goingDown: boolean;

  protected moving = true;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    let levelData = scene.getLevelData();
    this.body.setSize(levelData.ElevatorDefRect.width, levelData.ElevatorDefRect.height, true);
    this.body.setOffset(this.body.offset.x + levelData.ElevatorDefRect.offsetX, this.body.offset.y + levelData.ElevatorDefRect.offsetY);

    this.minX = object.minX;
    this.maxX = object.maxX;
    this.minY = object.minY;
    this.maxY = object.maxY;

    this.speedX = object.speedX || 125;
    this.speedY = object.speedY || 125;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.moving) {
      if (this.minX && this.maxX) {
        if (this.goingRight) {
          let dX = this.speedX * delta / 1000;
          this.x += dX;
          if (this.objectStandingOnIt) {
            this.objectStandingOnIt.x += dX;
          }
          if (this.x >= this.maxX) {
            this.goingRight = false;
          }
        } else {
          let dX = this.speedX * delta / 1000;
          this.x -= dX;
          if (this.x <= this.minX) {
            this.goingRight = true;
          }
          if (this.objectStandingOnIt) {
            this.objectStandingOnIt.x -= dX;
          }
        }
      }

      if (this.minY && this.maxY) {
        if (this.goingDown) {
          let dY = this.speedY * delta / 1000;
          this.y += dY;
          if (this.y >= this.maxY) {
            this.goingDown = false;
          }
          if (this.objectStandingOnIt) {
            this.objectStandingOnIt.y += dY;
          }
        } else {
          let dY = this.speedY * delta / 1000;
          this.y -= dY;
          if (this.y <= this.minY) {
            this.goingDown = true;
          }
          if (this.objectStandingOnIt) {
            this.objectStandingOnIt.y -= dY;
          }
        }
      }
    }

    this.postUpdate();
  }

  postUpdate() {
    super.postUpdate();
  }
}