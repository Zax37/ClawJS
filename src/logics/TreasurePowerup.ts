import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { CANVAS_WIDTH } from '../config';
import TreasureRegistry from '../managers/TreasureRegistry';
import { ObjectCreationData } from '../model/ObjectData';
import { TreasureType } from '../model/TreasureType';
import MapDisplay from '../scenes/MapDisplay';
import GeneralPowerup from './abstract/GeneralPowerup';
import PointsIcon from './PointsIcon';
import PowerupGlitter from './PowerupGlitter';

export default class TreasurePowerup extends GeneralPowerup {
  treasureType: TreasureType;
  treasureRegistry: TreasureRegistry;
  private glitter: Phaser.GameObjects.Sprite;
  private score = 0;
  private pointsFrame = 0;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.treasureRegistry = scene.game.treasureRegistry;

    let addGlitter = true;

    switch (object.image) {
      case 'GAME_TREASURE_CHALICES_BLUE':
      case 'GAME_TREASURE_CHALICES_GREEN':
      case 'GAME_TREASURE_CHALICES_PURPLE':
      case 'GAME_TREASURE_CHALICES_RED':
        this.treasureType = TreasureType.CHALICE;
        this.score = 2500;
        this.pointsFrame = 4;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_COINS':
        addGlitter = false;
        this.treasureType = TreasureType.COIN;
        this.score = 100;
        this.pointsFrame = 1;
        this.sound = 'GAME_COIN';
        break;
      case 'GAME_TREASURE_CROSSES_BLUE':
      case 'GAME_TREASURE_CROSSES_GREEN':
      case 'GAME_TREASURE_CROSSES_PURPLE':
      case 'GAME_TREASURE_CROSSES_RED':
        this.treasureType = TreasureType.CROSS;
        this.score = 5000;
        this.pointsFrame = 5;
        this.sound = 'GAME_CROSS';
        break;
      case 'GAME_TREASURE_CROWNS_BLUE':
      case 'GAME_TREASURE_CROWNS_GREEN':
      case 'GAME_TREASURE_CROWNS_PURPLE':
      case 'GAME_TREASURE_CROWNS_RED':
        this.treasureType = TreasureType.CROWN;
        this.score = 15000;
        this.pointsFrame = 8;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_GECKOS_BLUE':
      case 'GAME_TREASURE_GECKOS_GREEN':
      case 'GAME_TREASURE_GECKOS_PURPLE':
      case 'GAME_TREASURE_GECKOS_RED':
        this.treasureType = TreasureType.GECKO;
        this.score = 10000;
        this.pointsFrame = 7;
        this.sound = 'GAME_PICKUP2';
        break;
      case 'GAME_TREASURE_GOLDBARS':
        this.treasureType = TreasureType.GOLDBAR;
        this.score = 500;
        this.pointsFrame = 2;
        this.sound = 'GAME_TREASURE';
        break;
      case 'GAME_TREASURE_JEWELEDSKULL_BLUE':
      case 'GAME_TREASURE_JEWELEDSKULL_GREEN':
      case 'GAME_TREASURE_JEWELEDSKULL_PURPLE':
      case 'GAME_TREASURE_JEWELEDSKULL_RED':
        this.treasureType = TreasureType.SKULL;
        this.score = 25000;
        this.pointsFrame = 9;
        this.sound = 'GAME_PICKUP1';
        break;
      default:
      case 'GAME_TREASURE_NECKLACE':
        this.treasureType = TreasureType.NECKLACE;
        this.score = 2500;
        this.pointsFrame = 4;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_RINGS_BLUE':
      case 'GAME_TREASURE_RINGS_GREEN':
      case 'GAME_TREASURE_RINGS_PURPLE':
      case 'GAME_TREASURE_RINGS_RED':
        this.treasureType = TreasureType.RING;
        this.score = 1500;
        this.pointsFrame = 3;
        this.sound = 'GAME_RINGS';
        break;
      case 'GAME_TREASURE_SCEPTERS_BLUE':
      case 'GAME_TREASURE_SCEPTERS_GREEN':
      case 'GAME_TREASURE_SCEPTERS_PURPLE':
      case 'GAME_TREASURE_SCEPTERS_RED':
        this.treasureType = TreasureType.SCEPTER;
        this.score = 7500;
        this.pointsFrame = 6;
        this.sound = 'GAME_SCEPTER';
        break;
    }

    this.treasureRegistry.register(this.treasureType);

    if (addGlitter) {
      this.glitter = new PowerupGlitter(scene, mainLayer, object);
    }
  }

  protected collect() {
    super.collect();
    this.treasureRegistry.collect(this.treasureType);
    this.scene.claw.score += this.score;
    this.scene.events.emit('ScoreChange', this.scene.claw.score);

    if (this.glitter) {
      this.glitter.destroy();
    }

    const points = new PointsIcon(this.scene, this.mainLayer, this.object, this.pointsFrame);
  }

  preUpdate(time: number, delta: number) {
    if (!this.collider) {
      this.x -= delta * 0.6;
      this.y -= delta * 0.5;

      if (this.scene.claw.x - this.x > CANVAS_WIDTH / 2) {
        this.destroy();
      }
    } else {
      super.preUpdate(time, delta);
    }
  }
}