import { DEFAULTS } from '../model/Defaults';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import Collectible from './Collectible';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import Vector2 = Phaser.Math.Vector2;

const TRANSITION_TIME = 2500;

export default class EndOfLevelPowerupAnimation extends DynamicObject {
  private startTime: number;
  private curve: Phaser.Curves.CubicBezier;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, protected object: { x: number, y: number, texture: string, image: string, speedX: number, speedY: number }) {
    super(scene, mainLayer, {
      ...object,
      z: DEFAULTS.POWERUP.z,
      logic: 'EndOfLevelPowerup',
      frame: 1,
    });
    this.startTime = scene.time.now;
    this.scene.cameras.main.startFollow(this, true);
    this.curve = new Phaser.Curves.CubicBezier(new Vector2(this.x, this.y), new Vector2(this.x, object.speedY), new Vector2((this.x + object.speedX)/2, object.speedY-32), new Vector2(object.speedX, object.speedY));
  }

  preUpdate(time: number, delay: number) {
    const duration = time - this.startTime;
    const progress = Math.min(duration / TRANSITION_TIME, 1);

    const point = this.curve.getPoint(progress);
    this.x = point.x;
    this.y = point.y;

    if (progress === 1) {
      this.scene.claw.unlock();
      this.scene.cameras.main.stopFollow();
      this.scene.cameras.main.startFollow(this.scene.claw, true);
      const gem = new Collectible(this.scene, this.mainLayer, {
        ...this.object,
        x: this.x,
        y: this.y,
        z: DEFAULTS.POWERUP.z,
        logic: 'EndOfLevelPowerup',
        frame: 1,
      });
      this.destroy();
    }
  }
}