import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Collectable from './Collectable';
import PowerupGlitter from './PowerupGlitter';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class BouncingGoodie extends Collectable {
  body: Phaser.Physics.Arcade.Body;
  mapCollider: Phaser.Physics.Arcade.Collider;
  lastCollide = 0;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData) {
    super(scene, mainLayer, object, true);

    this.mapCollider = scene.physics.add.collider(this, mainLayer, () => {
      if (scene.time.now - this.lastCollide > 100) {
        scene.sound.playAudioSprite('sounds', 'GAME_PUBOUNCE1');
      } else if (this.body.blocked.down) {
        this.body.setBounce(0, 0);
        this.body.setVelocity(0, 0);
      }
      this.lastCollide = scene.time.now;
    });

    this.body.setBounce(0, 0.5);
    this.body.setVelocity(object.speedX! * 2, object.speedY! * 0.6 - 50);
    this.body.setDrag(-object.speedX! * 0.3, 10);
  }

  protected collect() {
    super.collect();

    if (!this.collider) {
      if (this.body) {
        this.body.allowGravity = false;
        this.body.velocity.set(0, 0);
      }
      this.mapCollider.destroy();
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.body) {
      if (!this.body.allowGravity && this.collider) {
        this.body.velocity.y += delta * 0.5;
        if (this.body.velocity.y > 10) {
          this.body.allowGravity = true;
        }
      } else if (this.collider && !this.glitter && this.body.blocked.down && Math.abs(this.body.velocity.x) <= 1) {
        this.glitter = new PowerupGlitter(this.scene, this.mainLayer, {
          x: this.x,
          y: this.y
        });
        this.glitter.depth = this.depth + 1;
      }
    }
  }
}