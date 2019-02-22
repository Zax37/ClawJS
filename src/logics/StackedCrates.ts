import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Container from './abstract/Container';
import Crate from './Crate';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

class ChildCrate extends Crate {
  above?: ChildCrate;
  falling = false;
  fallY: number;
  fallSpeed = 0;
  bounce = 0;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);

    this.body.width -= 10;
    this.body.height -= 10;
    this.body.offset.y += 10;
    this.fallY = this.y;
  }

  protected break() {
    if (this.above) {
      this.above.fall(this.fallY);
    }

    super.break();
    if (this.scene) {
      this.scene.game.soundsManager.playSound('GAME_PURELEASE1');
    }
  }

  protected fall(y: number) {
    if (this.above) {
      this.above.fall(this.fallY);
    }
    this.fallY = y;
    if (!this.falling) {
      this.falling = true;
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.falling) {
      if (this.y >= this.fallY) {
        this.falling = false;
      } else {
        this.y += delta * this.fallSpeed / 1000;
        this.fallSpeed += delta;
      }
    } else if (this.fallSpeed > 1) {
      this.y -= this.bounce;
      this.bounce++;
      this.fallSpeed /= 10;
    } else if (this.bounce && this.y < this.fallY) {
      this.y += this.bounce;
      this.bounce--;
    } else {
      this.y = this.fallY;
    }
  }
}

export default class StackedCrates {
  childCrates: ChildCrate[] = [];
  container: Container;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData) {
    this.container = new Container(scene, mainLayer, object);
    const z = object.z ? object.z : object.logic === 'FrontStackedCrates' ? DEFAULTS.FRONT.z : DEFAULTS.BEHIND.z;

    for (let i = 0; i < this.container.rawContents.length; i++) {
      const childCrate = new ChildCrate(scene, mainLayer, {
        x: object.x,
        y: object.y - 42 * i,
        z: z + i,
        logic: 'CRATE',
        powerup: this.container.rawContents[i] || 33,
        frame: object.frame,
        image: object.image,
        texture: object.texture,
      });
      childCrate.speedX = 25 * (i - this.container.rawContents.length / 2);
      childCrate.speedY = -(Math.random() * 301 + 200);
      if (this.childCrates.length) {
        this.childCrates[this.childCrates.length - 1].above = childCrate;
      }
      this.childCrates.push(childCrate);
    }
  }
}
