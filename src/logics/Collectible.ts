import { CANVAS_WIDTH } from '../config';
import { DEFAULTS } from '../model/Defaults';
import { ObjectCreationData } from '../model/ObjectData';
import { PowerupType } from '../model/PowerupType';
import { TreasureType } from '../model/TreasureType';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import PointsIcon from './PointsIcon';
import PowerupGlitter from './PowerupGlitter';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Collectible extends DynamicObject {
  body: Phaser.Physics.Arcade.Body;
  collider?: Phaser.Physics.Arcade.Collider;
  private collectCondition?: () => boolean;
  private collectableEffect?: () => void;
  protected glitter?: Phaser.GameObjects.Sprite;
  private treasure?: boolean;

  protected sound: string;

  constructor(protected scene: MapDisplay, protected mainLayer: DynamicTilemapLayer, protected object: ObjectCreationData, protected fromContainer?: boolean) {
    super(scene, mainLayer, object, DEFAULTS.POWERUP, true);

    switch (object.logic) {
      case 'AmmoPowerup':
      case 'BossWarp':
      case 'EndOfLevelPowerup':
      case 'HealthPowerup':
      case 'MagicPowerup':
      case 'SpecialPowerup':
        this.specialPowerup();
        break;
      default:
        this.treasurePowerup();
    }

    scene.physics.add.existing(this);
    this.collider = scene.physics.add.overlap(this, scene.claw, this.collect.bind(this));

    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.setSize(this.body.width + 12, this.body.height + 10);
    this.body.setOffset(-6, -10);

    this.scene = scene;
  }

  private specialPowerup() {
    let value = 0;
    switch (this.object.image) {
      case 'GAME_CATNIPS_NIP1':
      case 'GAME_CATNIPS_NIP2':
        value = this.object.smarts || (this.object.image === 'GAME_CATNIPS_NIP1' ? 15000 : 30000);
        this.collectableEffect = () => this.scene.claw.addPowerup(PowerupType.CATNIP, value);
        this.sound = 'GAME_CATNMAG';
        break;
      case 'GAME_HEALTH_POTION3':
        value += 10;
      case 'GAME_HEALTH_POTION2':
        value += 5;
      case 'GAME_HEALTH_POTION1':
        value += 5;
        this.sound = 'GAME_MILK';
      case 'LEVEL_HEALTH':
        value += 5;
        this.sound = this.sound || 'GAME_FOODITEM';
        this.collectCondition = () => {
          return !this.scene.claw.health.isFull();
        };
        this.collectableEffect = () => {
          this.scene.claw.health.heal(value);
        };
        break;
      case 'GAME_POWERUPS_EXTRALIFE':
      case 'GAME_POWERUPS_GHOST':
      case 'GAME_POWERUPS_INVULNERABLE':
        break;
      case 'GAME_POWERUPS_FIRESWORD':
        this.collectableEffect = () => {
          this.scene.claw.addPowerup(PowerupType.FIRESWORD, this.object.smarts || 15000);
        };
        break;
      case 'GAME_POWERUPS_ICESWORD':
      case 'GAME_POWERUPS_LIGHTNINGSWORD':
      case 'GAME_POWERUPS_PLASMASWORD':
        break;
      case 'GAME_AMMO_DEATHBAG':
        value += 15;
      case 'GAME_AMMO_SHOTBAG':
        value += 5;
      case 'GAME_AMMO_SHOT':
        value += 5;
        this.sound = 'GAME_AMMUNITION';
      case 'GAME_DYNAMITE':
        value += 5;
        this.sound = 'GAME_AMMUNITION';
        break;
      case 'GAME_MAGICCLAW':
        value += 25;
      case 'GAME_MAGIC_STARGLOW':
        value += 5;
      case 'GAME_MAGIC_GLOW':
        value += 5;
        this.sound = 'GAME_MAGICPOWERUP';
        break;
      case 'LEVEL_GEM':
      case 'GAME_MAPPIECE':
        this.sound = 'GAME_MAPPIECE';
        this.collectableEffect = () => this.scene.game.goToBootyScreen();
        break;
      case 'GAME_WARP':
      case 'GAME_VERTWARP':
      case 'GAME_BOSSWARP':
        this.sound = 'GAME_WARP';
        this.collectableEffect = () => {
          this.scene.claw.teleportTo(this.object.speedX!, this.object.speedY!);

          if (this.object.image === 'GAME_BOSSWARP') {
            this.scene.claw.setSpawn(this.object.speedX!, this.object.speedY!);
          }
        };
        break;
      default:
        console.log('Unknown special powerup: ' + this.object.image);
    }

    if (this.object.image !== 'GAME_BOSSWARP' && !this.fromContainer) {
      this.glitter = new PowerupGlitter(this.scene, this.mainLayer, this.object);
    }
  }

  private treasurePowerup() {
    let addGlitter = true;
    let treasureType: TreasureType;
    let score = 0;
    let pointsFrame = 0;

    switch (this.object.image) {
      case 'GAME_TREASURE_CHALICES_BLUE':
      case 'GAME_TREASURE_CHALICES_GREEN':
      case 'GAME_TREASURE_CHALICES_PURPLE':
      case 'GAME_TREASURE_CHALICES_RED':
        treasureType = TreasureType.CHALICE;
        score = 2500;
        pointsFrame = 4;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_COINS':
        addGlitter = false;
        treasureType = TreasureType.COIN;
        score = 100;
        pointsFrame = 1;
        this.sound = 'GAME_COIN';
        break;
      case 'GAME_TREASURE_CROSSES_BLUE':
      case 'GAME_TREASURE_CROSSES_GREEN':
      case 'GAME_TREASURE_CROSSES_PURPLE':
      case 'GAME_TREASURE_CROSSES_RED':
        treasureType = TreasureType.CROSS;
        score = 5000;
        pointsFrame = 5;
        this.sound = 'GAME_CROSS';
        break;
      case 'GAME_TREASURE_CROWNS_BLUE':
      case 'GAME_TREASURE_CROWNS_GREEN':
      case 'GAME_TREASURE_CROWNS_PURPLE':
      case 'GAME_TREASURE_CROWNS_RED':
        treasureType = TreasureType.CROWN;
        score = 15000;
        pointsFrame = 8;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_GECKOS_BLUE':
      case 'GAME_TREASURE_GECKOS_GREEN':
      case 'GAME_TREASURE_GECKOS_PURPLE':
      case 'GAME_TREASURE_GECKOS_RED':
        treasureType = TreasureType.GECKO;
        score = 10000;
        pointsFrame = 7;
        this.sound = 'GAME_PICKUP2';
        break;
      case 'GAME_TREASURE_GOLDBARS':
        treasureType = TreasureType.GOLDBAR;
        score = 500;
        pointsFrame = 2;
        this.sound = 'GAME_TREASURE';
        break;
      case 'GAME_TREASURE_JEWELEDSKULL_BLUE':
      case 'GAME_TREASURE_JEWELEDSKULL_GREEN':
      case 'GAME_TREASURE_JEWELEDSKULL_PURPLE':
      case 'GAME_TREASURE_JEWELEDSKULL_RED':
        treasureType = TreasureType.SKULL;
        score = 25000;
        pointsFrame = 9;
        this.sound = 'GAME_PICKUP1';
        break;
      default:
      case 'GAME_TREASURE_NECKLACE':
        treasureType = TreasureType.NECKLACE;
        score = 2500;
        pointsFrame = 4;
        this.sound = 'GAME_PICKUP1';
        break;
      case 'GAME_TREASURE_RINGS_BLUE':
      case 'GAME_TREASURE_RINGS_GREEN':
      case 'GAME_TREASURE_RINGS_PURPLE':
      case 'GAME_TREASURE_RINGS_RED':
        treasureType = TreasureType.RING;
        score = 1500;
        pointsFrame = 3;
        this.sound = 'GAME_RINGS';
        break;
      case 'GAME_TREASURE_SCEPTERS_BLUE':
      case 'GAME_TREASURE_SCEPTERS_GREEN':
      case 'GAME_TREASURE_SCEPTERS_PURPLE':
      case 'GAME_TREASURE_SCEPTERS_RED':
        treasureType = TreasureType.SCEPTER;
        score = 7500;
        pointsFrame = 6;
        this.sound = 'GAME_SCEPTER';
        break;
    }

    if (!this.fromContainer) {
      this.scene.game.treasureRegistry.register(treasureType);

      if (addGlitter) {
        this.glitter = new PowerupGlitter(this.scene, this.mainLayer, this.object);
      }
    }

    this.collectableEffect = () => {
      this.scene.game.treasureRegistry.collect(treasureType);
      this.scene.claw.score += score;
      this.scene.events.emit('ScoreChange', this.scene.claw.score);

      const points = new PointsIcon(this.scene, this.mainLayer, {
        x: this.x,
        y: this.y,
      }, pointsFrame);
    };

    this.treasure = true;
  }

  protected collect() {
    if (!this.collectCondition || this.collectCondition()) {
      this.depth = DEFAULTS.FRONT.z;
      this.collider!.destroy();
      this.collider = undefined;

      if (this.sound) {
        this.scene.game.soundsManager.playSound(this.sound);
      }

      if (this.glitter) {
        this.glitter.destroy();
      }

      if (this.collectableEffect) {
        this.collectableEffect();
      }

      if (!this.treasure) {
        this.destroy();
      }
    }
  }

  preUpdate(time: number, delta: number) {
    if (this.glitter) {
      this.glitter.x = this.x;
      this.glitter.y = this.y;
    }
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
