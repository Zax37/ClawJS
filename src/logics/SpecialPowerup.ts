import { ObjectCreationData } from '../model/ObjectData';
import { PowerupType } from '../model/PowerupType';
import MapDisplay from '../scenes/MapDisplay';
import GeneralPowerup from './abstract/GeneralPowerup';
import { MAX_HEALTH } from './CaptainClaw';
import PowerupGlitter from './PowerupGlitter';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class SpecialPowerup extends GeneralPowerup {
  private collectCondition?: () => boolean;
  private powerupEffect?: () => void;
  private glitter?: Phaser.GameObjects.Sprite;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);

    let value = 0;
    switch (object.image) {
      case 'GAME_CATNIPS_NIP2':
        value += 15000;
      case 'GAME_CATNIPS_NIP1':
        value += 15000;
        this.powerupEffect = () => scene.claw.addPowerup(PowerupType.CATNIP, value);
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
          return scene.claw.health < MAX_HEALTH;
        };
        this.powerupEffect = () => {
          scene.claw.health += value;
          scene.events.emit('HealthChange', scene.claw.health);
        };
        break;
      case 'GAME_POWERUPS_EXTRALIFE':
      case 'GAME_POWERUPS_GHOST':
      case 'GAME_POWERUPS_INVULNERABLE':
      case 'GAME_POWERUPS_FIRESWORD':
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
        this.powerupEffect = () => scene.game.goToBootyScreen();
        break;
      case 'GAME_WARP':
      case 'GAME_VERTWARP':
      case 'GAME_BOSSWARP':
        this.sound = 'GAME_WARP';
        this.powerupEffect = () => {
          scene.claw.teleportTo(object.speedX!, object.speedY!);

          if (object.image === 'GAME_BOSSWARP') {
            scene.claw.setSpawn(object.speedX!, object.speedY!);
          }
        };
        break;
      default:
        console.log('Unknown special powerup: ' + object.image);
    }

    if (object.image !== 'GAME_BOSSWARP') {
      this.glitter = new PowerupGlitter(scene, mainLayer, object);
    }
  }

  protected collect() {
    if (!this.collectCondition || this.collectCondition()) {
      super.collect();
      if (this.powerupEffect) {
        this.powerupEffect();
      }
      if (this.glitter) {
        this.glitter.destroy();
      }
      this.destroy();
    }
  }
}