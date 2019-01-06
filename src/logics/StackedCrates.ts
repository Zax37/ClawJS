import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Container from './abstract/Container';
import Crate from './Crate';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

class ChildCrate extends Crate {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);

    this.depth = object.z!;
    this.body.width -= 10;
    this.body.height -= 10;
    this.body.offset.y += 10;
  }

  protected break() {
    super.break();
    this.scene.sound.playAudioSprite('sounds', 'GAME_PURELEASE1');
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
        powerup: this.container.rawContents[i],
        frame: object.frame,
        image: object.image,
        texture: object.texture,
      });
      this.childCrates.push(childCrate);
    }
  }
}