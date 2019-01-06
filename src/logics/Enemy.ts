import { DEFAULTS } from '../model/Defaults';
import MapDisplay from '../scenes/MapDisplay';
import PhysicsObject from './abstract/PhysicsObject';
import AnimationFrame = Phaser.Animations.AnimationFrame;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Enemy extends PhysicsObject {
  private standingFrames: AnimationFrame[];
  private timer = 0;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);
    if (scene.game.animationManager.request(object.texture, object.image + 10)) {
      this.standingFrames = this.anims.animationManager.get(object.texture + object.image + 10).frames;
    }

    this.setSize(32, 112);
    object.z = DEFAULTS.ENEMY.z;
    this.alignToGround();
    this.scene.enemies.add(this);
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
