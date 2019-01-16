import Vector2 = Phaser.Math.Vector2;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from '../scenes/MapDisplay';
import ElevatorLike from './abstract/ElevatorLike';
import TimeCycle from './abstract/TimeCycle';
import { ObjectCreationData } from '../model/ObjectData';

enum ElevatorType {
  DEFAULT,
  TRIGGER,
  START,
  STOP,
}

const MIN_VAL = 0.0001;

export default class Elevator extends ElevatorLike {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  speedX: number;
  speedY: number;

  private moving = true;
  private elevatorType: ElevatorType;
  private oneWay: boolean;
  private attempt = 0;
  private startX: number;
  private startY: number;

  private verticalCycle: TimeCycle;
  private horizontalCycle: TimeCycle;
  private timerVert = 0;
  private timerHoriz = 0;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    const levelData = scene.getLevelData();
    this.body.setSize(levelData.ElevatorDefRect.width, levelData.ElevatorDefRect.height);
    this.body.setOffset(this.displayOriginX + levelData.ElevatorDefRect.left, this.displayOriginY + levelData.ElevatorDefRect.top);

    this.startX = this.x;
    this.startY = this.y;

    this.minX = object.minX || this.startX;
    this.maxX = object.maxX || this.startX;
    this.minY = object.minY || this.startY;
    this.maxY = object.maxY || this.startY;

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

    let addX = 0, addY = 0;
    if (object.direction === 7 || object.direction === 4 || object.direction === 1) {
      //addX += this.maxX - this.minX + 1;
    }
    if (object.direction === 7 || object.direction === 8 || object.direction === 9) {
      //addY += this.maxY - this.minY + 1;
    }

    this.horizontalCycle = this.timeCycleFromPos(this.x + addX, this.speedX, this.minX, this.maxX);
    this.verticalCycle = this.timeCycleFromPos(this.y + addY, this.speedY, this.minY, this.maxY);
    this.moving = this.elevatorType === ElevatorType.DEFAULT || this.elevatorType === ElevatorType.STOP;
    this.scene = scene;
  }

  timeCycleFromPos(pos: number, speed: number, min: number, max: number) {
    return new TimeCycle(Math.max(0, pos - min),(max + 1 - min) * 2);
  }

  getPosFromCycles() {
    const hProgress = this.horizontalCycle.getProgress(this.timerHoriz);
    const vProgress = this.verticalCycle.getProgress(this.timerVert);

    const x = this.minX + (this.maxX - this.minX) * (1 - Math.abs(0.5 - hProgress) * 2),
          y = this.minY + (this.maxY - this.minY) * (1 - Math.abs(0.5 - vProgress) * 2);

    return new Vector2(x, y);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.scene.claw.attempt !== this.attempt) {
      this.timerHoriz = 0;
      this.timerVert = 0;
      this.x = this.startX;
      this.y = this.startY;
      this.attempt = this.scene.claw.attempt;
      if (this.elevatorType === ElevatorType.TRIGGER) {
        this.moving = false;
      }
    }

    if (this.moving) {
      this.timerHoriz += delta * this.speedX / 1000;
      this.timerVert += delta * this.speedY / 1000;
      const newPos = this.getPosFromCycles();
      const dX = newPos.x - this.x, dY = newPos.y - this.y;
      this.x = newPos.x;
      this.y = newPos.y;

      this.body.velocity = new Vector2(dX > 0 ? MIN_VAL : -MIN_VAL, dY > 0 ? MIN_VAL : -MIN_VAL);
      if (this.objectStandingOnIt && !this.objectStandingOnIt.isBlockedTop) {
        this.objectStandingOnIt.isOnElevator = true;
        this.objectStandingOnIt.x += dX;
        this.objectStandingOnIt.y += dY;
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