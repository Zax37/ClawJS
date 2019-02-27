import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import { AttackType } from '../model/AttackType';
import { ObjectCreationData } from '../model/ObjectData';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import Projectile from './Projectile';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

const SHOOTING_DELAY = 3000;

export default class TowerCannon extends DynamicObject {
  private isRight: boolean;
  private lastShotTime: number;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, {
      ...object,
      x: object.x - 1,
      y: object.y + 1,
      animation: 'GAME_FORWARD100',
    });

    if (object.logic === 'TowerCannonRight') {
      this.isRight = true;
    }
    this.lastShotTime = scene.time.now;

    const defaultFrame = object.image + 1;
    this.on('animationupdate', this.animUpdate, this);
    this.on('animationcomplete', () => this.setFrame(defaultFrame));
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (time - this.lastShotTime > SHOOTING_DELAY) {
      this.lastShotTime = time;
      this.playAnimation();

      if (this.isOnScreen()) {
        this.scene.game.soundsManager.playSound('LEVEL_CANONSH1');
      }
    }
  }

  isOnScreen() {
    return Math.abs(this.x - this.scene.claw.x) < CANVAS_WIDTH && Math.abs(this.y - this.scene.claw.y) < CANVAS_HEIGHT;
  }

  private animUpdate(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) {
    if (frame.index === 2) {
      const projectile = new Projectile(this.scene, this.mainLayer, AttackType.ENEMY, { x: this.x + (this.isRight ? 20 : -20), y: this.y + 4, texture: 'LEVEL2', image: 'LEVEL_CANNONBALL', damage: 10, direction: !this.isRight });
    }
  }
}