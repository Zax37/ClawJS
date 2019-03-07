import { AttackType } from '../../model/AttackType';
import DynamicObject from '../../object/DynamicObject';
import MapDisplay from '../../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Explosion extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  attackType = AttackType.ENVIRONMENT;
  damage = 10;
  facingRight: boolean;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, private object: { x: number, y: number, z: number}) {
    super(scene, mainLayer, {
      ...object,
      logic: 'Explosion',
      texture: 'GAME',
      image: 'GAME_DYNAMITEEXPLO',
      animation: 'GAME_FORWARD50',
      frame: 1,
    }, {}, true);

    this.facingRight = Math.random() > 0.5;

    scene.physics.add.existing(this, false);
    scene.attackRects.add(this);

    this.body.setSize(100, 100);

    this.scene.game.soundsManager.playSound('GAME_BOMBEXP');
    this.on('animationupdate', () => this.body.enable = false);
    this.on('animationcomplete', () => this.destroy());
  }
}