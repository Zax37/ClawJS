import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import MapDisplay from "../scenes/MapDisplay";
import GenericObjectWithDefaults from "./abstract/GenericObjectWithDefaults";
import CaptainClaw from "./CaptainClaw";
//import {DEFAULTS} from "./abstract/Defaults";

export default class TreasurePowerup extends GenericObjectWithDefaults {
  body: Phaser.Physics.Arcade.Body;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object, {z: 1000});

    if (scene.game.animationManager.request(object.texture, object.image)) {
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      this.play(object.image);
    }

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