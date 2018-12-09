import MapDisplay from "../scenes/MapDisplay";
import GenericObjectWithDefaults from "./abstract/GenericObjectWithDefaults";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PointsIcon extends GenericObjectWithDefaults {
  private collectTime: number;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any, pointsFrame: number) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      texture: "GAME",
      image: "GAME_POINTS",
      frame: pointsFrame,
    }, {});

    this.depth = 8900;
    scene.add.existing(this);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.collectTime) {
      this.collectTime = time;
    } else {
      let timeDiff = time - this.collectTime;
      this.alpha = 1 - Math.max(timeDiff - 500, 0) / 500;
      if (timeDiff >= 1000) {
        this.destroy();
      }
    }

    this.y -= 0.02 * delta;
  }
}