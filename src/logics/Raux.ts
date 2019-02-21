import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Health from './abstract/Health';
import Enemy from './Enemy';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Raux extends Enemy {
  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.health = new Health(1, scene.time);
    this.container.rawContents = [31];
    this.idleSounds = ['LEVEL_RAUX_00840003'];
    this.deathSound = 'LEVEL_RAUX_00840005';
  }

  preUpdate(time: number, delta: number) {
    this.walking = false;
    super.preUpdate(time, delta);
  }
}