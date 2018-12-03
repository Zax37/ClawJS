import AniCycle from "../AniCycle";
import MapDisplay from "../../scenes/MapDisplay";
import {DEFAULTS} from "./Defaults";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class GeneralPowerup extends AniCycle {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, DEFAULTS.POWERUP);

    scene.physics.add.existing(this);
    scene.physics.add.overlap(this, scene.claw, this.collect.bind(this));

    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.setSize(this.body.width + 12, this.body.height + 12, true);
    this.body.setOffset(this.body.offset.x, this.body.offset.x - 6);
  }

  protected collect() {
    this.destroy();
  }
}