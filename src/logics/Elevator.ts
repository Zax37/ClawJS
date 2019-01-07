import Vector2 = Phaser.Math.Vector2;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';

enum ElevatorType {
  DEFAULT,
  TRIGGER,
  START,
  STOP,
}

export default class Elevator extends ElevatorLike {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  speedX: number;
  speedY: number;
  goingRight: boolean;
  goingDown: boolean;

  private moving = true;
  private elevatorType: ElevatorType;
  private oneWay: boolean;
  private attempt = 0;
  private startX: number;
  private startY: number;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.ElevatorDefRect.width, levelData.ElevatorDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.ElevatorDefRect.left, this.displayOriginY + levelData.ElevatorDefRect.top);

    this.startX = this.x;
    this.startY = this.y;

    this.minX = object.minX;
    this.maxX = object.maxX;
    this.minY = object.minY;
    this.maxY = object.maxY;

    this.speedX = (object.speedX || 125);
    this.speedY = (object.speedY || 125);

    switch (object.logic) {
      case 'OneWayTriggerElevator':
        this.oneWay = true;
      case 'TriggerElevator':
        this.elevatorType = ElevatorType.TRIGGER;
        break;
      case 'OneWayStartElevator':
        this.oneWay = true;
      case 'StartElevator':
        this.elevatorType = ElevatorType.START;
        break;
      case 'StopElevator':
        this.elevatorType = ElevatorType.STOP;
        break;
      default:
        this.elevatorType = ElevatorType.DEFAULT;
        break;
    }

    this.moving = this.elevatorType === ElevatorType.DEFAULT || this.elevatorType === ElevatorType.STOP;
    this.scene = scene;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.scene.claw.attempt !== this.attempt) {
      this.x = this.startX;
      this.y = this.startY;

      this.attempt = this.scene.claw.attempt;
    }

    if (this.moving) {
      let dX = 0, dY = 0;
      if (this.minX && this.maxX) {
        if (this.goingRight) {
          dX = this.speedX * delta / 1100;
          if (this.x >= this.maxX) {
            this.goingRight = false;
          }
        } else {
          dX = -this.speedX * delta / 1100;
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
          dY = -this.speedY * delta / 1100;
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
    if (this.elevatorType === ElevatorType.TRIGGER) {
      if (!this.moving && this.objectStandingOnIt) {
        this.moving = true;
      }
    } else if (this.elevatorType !== ElevatorType.DEFAULT) {
      this.moving = (this.elevatorType === ElevatorType.START) !== !this.objectStandingOnIt;
      if (!this.moving) {
        this.body.velocity.set(0, 0);
      }
    }
    super.postUpdate();
  }
}