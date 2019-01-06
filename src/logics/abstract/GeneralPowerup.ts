import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class GeneralPowerup extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  collider?: Phaser.Physics.Arcade.Collider;

  protected sound: string;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, DEFAULTS.POWERUP, true);

    scene.physics.add.existing(this);
    this.collider = scene.physics.add.overlap(this, scene.claw, this.collect.bind(this));

    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.setSize(this.body.width + 12, this.body.height + 10);
    this.body.setOffset(-6, -10);

    this.scene = scene;
  }

  protected collect() {
    this.collider!.destroy();
    this.collider = undefined;

    if (this.sound) {
      this.scene.sound.playAudioSprite('sounds', this.sound);
    }
  }
}