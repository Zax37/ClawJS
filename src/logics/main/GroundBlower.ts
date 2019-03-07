import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import CaptainClaw from './CaptainClaw';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { ObjectCreationData } from '../../model/ObjectData';

export default class GroundBlower extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;

  private jumpHeight: number;
  private time: number;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object, {});

    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, scene.claw, this.overlap.bind(this, scene.claw));

    this.body.immovable = true;
    this.body.allowGravity = false;

    this.jumpHeight = object.maxY || 450;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.time = time;
  }

  overlap(claw: CaptainClaw) {
    claw.jumpingPassively = true;
    claw.passiveJumpHeight = this.jumpHeight;
    claw.jump(this.time);
  }
}
