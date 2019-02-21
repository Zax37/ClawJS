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
  protected scene: MapDisplay;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
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

    this.scene = scene;
  }

  protected break() {
    this.container.dropContents(this.x, this.y, this.speedX, this.speedY);
    this.playAnimation();
    this.on('animationcomplete', this.animComplete, this);
    if (Math.random() * 100 >= 50) {
      this.scene.game.soundsManager.playSound('GAME_CRATEBREAK2');
    } else {
      this.scene.game.soundsManager.playSound('GAME_CRATEBREAK');
    }
  }

  private animComplete() {
    this.destroy();
  }
}
