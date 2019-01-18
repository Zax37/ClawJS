import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Container from './abstract/Container';
import PhysicsObject from './abstract/PhysicsObject';
import AnimationFrame = Phaser.Animations.AnimationFrame;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Enemy extends PhysicsObject {
  private standingFrames: AnimationFrame[];
  private killFallAnimation: string;
  private timer = 0;

  private deathSound: string;

  private container: Container;
  private dead = false;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);

    this.container = new Container(scene, mainLayer, object);

    if (scene.game.animationManager.request(object.texture, object.image + 10)) {
      this.standingFrames = this.anims.animationManager.get(object.texture + object.image + 10).frames;
    }

    switch (object.logic) {
      case 'Officer':
        this.deathSound = 'LEVEL_OFFICER_00' + (340014 + Math.round(Math.random()));
        if (scene.game.animationManager.request(object.texture, object.image + 95)) {
          this.killFallAnimation = object.texture + object.image + 95;
        }
        break;
      case 'Soldier':
        this.deathSound = 'LEVEL_SOLDIER_00' + (320005 + Math.round(Math.random()));
        if (scene.game.animationManager.request(object.texture, object.image + 90)) {
          this.killFallAnimation = object.texture + object.image + 90;
        }
        break;
      default:
        break;
    }

    this.setSize(32, 112);
    object.z = DEFAULTS.ENEMY.z;
    this.alignToGround();
    this.scene.enemies.add(this);
    this.scene.attackable.add(this);

    const collider = this.scene.physics.add.collider(scene.attackRects, this, (attackSource) => {
      collider.destroy();
      this.tilesCollider.destroy();
      this.scene.game.soundsManager.playVocal(this.deathSound, { volume: this.scene.game.soundsManager.getSoundsVolume() });
      this.play(this.killFallAnimation);
      this.dead = true;
      this.body.velocity.y = -400;
      this.container.dropContents(this.x, this.y, 25, -300);
      this.scene.game.soundsManager.playSound('GAME_HIT' + Math.floor(1 + Math.random() * 4));
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.dead) {
      this.timer += delta;

      if (this.timer > 2000) {
        this.timer = 0;
        this.anims.setCurrentFrame(this.standingFrames[Math.floor(Math.random() * this.standingFrames.length)]);
      }
    }
  }
}
