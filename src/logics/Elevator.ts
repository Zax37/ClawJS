import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import ElevatorLike from "./abstract/ElevatorLike";
import Vector2 = Phaser.Math.Vector2;

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
    this.body.setSize(levelData.ElevatorDefRect.width, levelData.ElevatorDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.ElevatorDefRect.left, this.displayOriginY + levelData.ElevatorDefRect.top);

    this.minX = object.minX;
    this.maxX = object.maxX;
    this.minY = object.minY;
    this.maxY = object.maxY;

    this.speedX = (object.speedX || 125);
    this.speedY = (object.speedY || 125);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.moving) {
      let dX = 0, dY = 0;
      if (this.minX && this.maxX) {
        if (this.goingRight) {
          dX = this.speedX * delta / 1100;
          if (this.x >= this.maxX) {
            this.goingRight = false;
          }
        } else {
          dX = - this.speedX * delta / 1100;
          if (this.x <= this.minX) {
            this.goingRight = true;
          }
        }
      }

      if (this.minY && this.maxY) {
        if (this.goingDown) {
          dY = this.speedY * delta / 1100;
          if (this.y >= this.maxY) {
            this.goingDown = false;
          }
        } else {
          dY = - this.speedY * delta / 1100;
          if (this.y <= this.minY) {
            this.goingDown = true;
          }
        }
      }

      this.x += dX;
      this.y += dY;

      this.body.velocity = new Vector2(dX * 0.1, dY * 0.1);
      if (this.objectStandingOnIt && !this.objectStandingOnIt.isBlockedTop) {
        this.objectStandingOnIt.isOnElevator = true;
        this.objectStandingOnIt.x += dX - dX * 0.01;
        this.objectStandingOnIt.y += dY - dY * 0.01;
        this.objectStandingOnIt.body.velocity.add(this.body.velocity);
      }
    }

    this.postUpdate();
  }

  postUpdate() {
    super.postUpdate();
  }
}