import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export default class Elevator extends Sprite {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  goingRight: boolean;
  goingDown: boolean;

  constructor(scene: Scene, object: any) {
    super(scene, object.x, object.y, object.imageSet, object.frame);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

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
        if (this.x >= this.maxX) {
          this.goingRight = false;
        }
      } else {
        this.x -= 2;
        if (this.x <= this.minX) {
          this.goingRight = true;
        }
      }
    }

    if (this.minY && this.maxY) {
      if (this.goingDown) {
        this.y += 2;
        if (this.y >= this.maxY) {
          this.goingDown = false;
        }
      } else {
        this.y -= 2;
        if (this.y <= this.minY) {
          this.goingDown = true;
        }
      }
    }
  }
}