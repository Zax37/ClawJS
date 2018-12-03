import GeneralPowerup from "./abstract/GeneralPowerup";
import MapDisplay from "../scenes/MapDisplay";
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { PowerupType } from "../model/PowerupType";
import { MAX_HEALTH } from "./CaptainClaw";
import PowerupGlitter from "./PowerupGlitter";

export default class SpecialPowerup extends GeneralPowerup {
  private collectCondition?: () => boolean;
  private powerupEffect?: () => void;
  private glitter?: Phaser.GameObjects.Sprite;

  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, mainLayer, object);

    let heal = 0;
    switch (object.image) {
      case 'GAME_CATNIPS_NIP1':
        this.powerupEffect = () => scene.claw.addPowerup(PowerupType.CATNIP, 1.5);
        break;
      case 'GAME_CATNIPS_NIP2':
        this.powerupEffect = () => scene.claw.addPowerup(PowerupType.CATNIP, 3);
        break;
      case 'GAME_HEALTH_POTION3':
        heal += 10;
      case 'GAME_HEALTH_POTION2':
        heal += 5;
      case 'GAME_HEALTH_POTION1':
        heal += 5;
      case 'LEVEL_HEALTH':
        heal += 5;
        this.collectCondition = () => {
          return scene.claw.health < MAX_HEALTH;
        };
        this.powerupEffect = () => {
          scene.claw.health += heal;
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
      case 'GAME_AMMO_DEATHBAG':
      case 'GAME_AMMO_SHOT':
      case 'GAME_AMMO_SHOTBAG':
      case 'GAME_DYNAMITE':
      case 'GAME_MAGIC_GLOW':
      case 'GAME_MAGIC_STARGLOW':
      case 'GAME_MAGICCLAW':
        break;
      case 'GAME_MAPPIECE':
        this.powerupEffect = () => scene.game.goToBootyScreen();
        break;
      case 'GAME_WARP':
      case 'GAME_VERTWARP':
      case 'GAME_BOSSWARP':
        this.powerupEffect = () => {
          scene.claw.x = object.speedX;
          scene.claw.y = object.speedY;
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