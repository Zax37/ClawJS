import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";

export default class Elevator extends Phaser.Physics.Arcade.Sprite {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  goingRight: boolean;
  goingDown: boolean;
  elevatorUser?: Phaser.Physics.Arcade.Sprite;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.texture, object.image + object.frame);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(scene.claw, this, function (paramA: Phaser.Physics.Arcade.Sprite, paramB: Elevator) {
      paramB.elevatorUser = paramA;
      paramA.body.blocked.down = true;
    }, undefined);
    // @ts-ignore
    this.body.allowGravity = false;
    this.body.immovable = true;

    this.body.checkCollision = {
      none: false,
      up: true,
      left: false,
      right: false,
      down: false,
    };

    this.minX = object.minX;
    this.maxX = object.maxX;
    this.minY = object.minY;
    this.maxY = object.maxY;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.minX && this.maxX) {
      if (this.goingRight) {
        this.x += 2;
        if (this.elevatorUser) {
          this.elevatorUser.x += 2;
        }
        if (this.x >= this.maxX) {
          this.goingRight = false;
        }
      } else {
        this.x -= 2;
        if (this.x <= this.minX) {
          this.goingRight = true;
        }
        if (this.elevatorUser) {
          this.elevatorUser.x -= 2;
        }
      }
    }

    if (this.minY && this.maxY) {
      if (this.goingDown) {
        this.y += 2;
        if (this.y >= this.maxY) {
          this.goingDown = false;
        }
        if (this.elevatorUser) {
          this.elevatorUser.y += 2;
        }
      } else {
        this.y -= 2;
        if (this.y <= this.minY) {
          this.goingDown = true;
        }
        if (this.elevatorUser) {
          this.elevatorUser.y -= 2;
        }
      }
    }

    this.elevatorUser = undefined;
  }
}