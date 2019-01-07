import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import Container from './abstract/Container';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Crate extends DynamicObject {
  private container: Container;
  body: Phaser.Physics.Arcade.Body;
  speedX = 0;
  speedY = -300;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, DEFAULTS[object.logic]);
    this.container = new Container(scene, mainLayer, object);
    if (this.container.rawContents.length === 0) {
      this.container.rawContents.push(33);
    }

    scene.physics.add.existing(this);
    scene.attackable.add(this);
    this.body.allowGravity = false;

    const collider = scene.physics.add.collider(scene.attackRects, this, () => {
      this.break();
      collider.active = false;
    });
  }

  protected break() {
    this.container.dropContents(this.speedX, this.speedY);
    this.playAnimation();
    this.on('animationcomplete', this.animComplete, this);
    this.scene.sound.playAudioSprite('sounds', 'GAME_CRATEBREAK2');
  }

  private animComplete() {
    this.destroy();
  }
}