import PhysicsObject from "./abstract/PhysicsObject";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import AnimationFrame = Phaser.Animations.AnimationFrame;
import {DEFAULTS} from "./abstract/Defaults";

export default class Enemy extends PhysicsObject {
  private standingFrames: AnimationFrame[];
  private timer: number = 0;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    if (scene.game.animationManager.request(object.texture, object.image + 10)) {
      this.standingFrames = this.anims.animationManager.get(object.texture + object.image + 10).frames;
    }

    this.setSize(32, 112);
    object.z = DEFAULTS.ENEMY.z;
    this.alignToGround();
    this.body.enable = false;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.timer += delta;

    if (this.timer > 2000) {
      this.timer = 0;
      this.anims.setCurrentFrame(this.standingFrames[Math.floor(Math.random() * this.standingFrames.length)]);
    }
  }
}
