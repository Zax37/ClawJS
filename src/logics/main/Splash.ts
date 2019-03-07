import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Splash extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: { x: number, y: number, z: number }) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y - scene.getLevelData().SplashY + 2,
      z: object.z + 2,
      logic: 'Splash',
      texture: `LEVEL${scene.getBaseLevel()}`,
      image: 'LEVEL_SPLASH',
      animation: 'GAME_SPLASH',
      frame: 1,
    }, undefined, true);

    this.on('animationcomplete', this.destroy, this);
  }
}
