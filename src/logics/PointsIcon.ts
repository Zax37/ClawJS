import { DEFAULTS } from '../model/Defaults';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PointsIcon extends DynamicObject {
  private collectTime: number;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: { x: number, y: number }, pointsFrame: number) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      z: DEFAULTS.POINTS.z,
      logic: 'PointsIcon',
      texture: 'GAME',
      image: 'GAME_POINTS',
      frame: pointsFrame,
    });

    this.depth = 8900;
    scene.add.existing(this);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.collectTime) {
      this.collectTime = time;
    } else {
      const timeDiff = time - this.collectTime;
      this.alpha = 1 - Math.max(timeDiff - 500, 0) / 500;
      if (timeDiff >= 1000) {
        this.destroy();
      }
    }

    this.y -= 0.02 * delta;
  }
}