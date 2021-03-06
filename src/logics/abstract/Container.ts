import { TreasureRegistry } from '../../managers/TreasureRegistry';
import { DEFAULTS } from '../../model/Defaults';
import { ObjectCreationData } from '../../model/ObjectData';
import { TreasureType } from '../../model/TreasureType';
import { MapDisplay } from '../../scenes/MapDisplay';
import { BouncingGoodie } from '../main/BouncingGoodie';
import { EndOfLevelPowerupAnimation } from '../main/EndOfLevelPowerupAnimation';

const END_OF_LEVEL_POWERUP_ID = 31;

export class Container {
  rawContents: number[] = [];

  constructor(protected scene: MapDisplay, protected mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, protected object: ObjectCreationData) {
    if (object.powerup) {
      this.rawContents.push(object.powerup);
    }
    if (object.userRect1) {
      object.userRect1.forEach((num) => {
        if (num) {
          this.rawContents.push(num);
        }
      });
    }
    if (object.userRect2) {
      object.userRect2.forEach((num) => {
        if (num) {
          this.rawContents.push(num);
        }
      });
    }
  }

  dropContents(fromX: number, fromY: number, speedX: number, speedY: number, speedIncrement?: number) {
    let incY = 0;
    if (speedIncrement) {
      speedX -= this.rawContents.length / 2 * speedIncrement;
      incY -= this.rawContents.length * speedIncrement;
    }

    let collectableId = this.rawContents.pop();
    while (collectableId) {
      const collectableImage = this.imageFromCollectableId(collectableId);
      if (collectableId === END_OF_LEVEL_POWERUP_ID && this.object.speedX && this.object.speedY) {
        const gem = new EndOfLevelPowerupAnimation(this.scene, this.mainLayer, {
          x: fromX,
          y: fromY,
          texture: collectableImage.startsWith('LEVEL') ? ('LEVEL' + this.scene.getBaseLevel()) : 'GAME',
          image: collectableImage,
          speedX: this.object.speedX,
          speedY: this.object.speedY,
        });
      } else {
        const collectable = new BouncingGoodie(this.scene, this.mainLayer, {
          x: fromX,
          y: fromY,
          z: DEFAULTS.POWERUP.z,
          logic: this.logicFromCollectableId(collectableId),
          texture: collectableImage.startsWith('LEVEL') ? ('LEVEL' + this.scene.getBaseLevel()) : 'GAME',
          image: collectableImage,
          speedX, speedY: speedY + Math.abs(incY) - Math.random() * 25,
          frame: 1,
        });
      }

      collectableId = this.rawContents.pop();

      if (speedIncrement) {
        speedX += speedIncrement - Math.random() * 20 + 7;
        speedY += speedIncrement - Math.random() * 20 + 5;
      }
    }
  }

  logicFromCollectableId(id: number) {
    if (id >= 35 && id <= 40) {
      return 'CursePowerup';
    }
    if (id <= 18 || id === 33 || (id >= 41 && id <= 52)) {
      return 'TreasurePowerup';
    }
    return 'SpecialPowerup';
  }

  imageFromCollectableId(id: number) {
    switch (id) {
      case 1:
        return 'GAME_TREASURE_GOLDBARS';
      case 2:
        return 'GAME_TREASURE_RINGS_RED';
      case 3:
        return 'GAME_TREASURE_RINGS_GREEN';
      case 4:
        return 'GAME_TREASURE_RINGS_BLUE';
      case 5:
        return 'GAME_TREASURE_RINGS_PURPLE';
      case 6:
        return 'GAME_TREASURE_NECKLACE';
      case 7:
        return 'GAME_TREASURE_CROSSES_RED';
      case 8:
        return 'GAME_TREASURE_CROSSES_GREEN';
      case 9:
        return 'GAME_TREASURE_CROSSES_BLUE';
      case 10:
        return 'GAME_TREASURE_CROSSES_PURPLE';
      case 11:
        return 'GAME_TREASURE_SCEPTERS_RED';
      case 12:
        return 'GAME_TREASURE_SCEPTERS_GREEN';
      case 13:
        return 'GAME_TREASURE_SCEPTERS_BLUE';
      case 14:
        return 'GAME_TREASURE_SCEPTERS_PURPLE';
      case 15:
        return 'GAME_TREASURE_GECKOS_RED';
      case 16:
        return 'GAME_TREASURE_GECKOS_GREEN';
      case 17:
        return 'GAME_TREASURE_GECKOS_BLUE';
      case 18:
        return 'GAME_TREASURE_GECKOS_PURPLE';
      case 19:
        return 'GAME_AMMO_DEATHBAG';
      case 20:
        return 'GAME_AMMO_SHOT';
      case 21:
        return 'GAME_AMMO_SHOTBAG';
      case 22:
        return 'GAME_CATNIPS_NIP1';
      case 23:
        return 'GAME_CATNIPS_NIP2';
      case 24:
        return 'LEVEL_HEALTH';
      case 25:
        return 'GAME_HEALTH_POTION3';
      case 26:
        return 'GAME_HEALTH_POTION1';
      case 27:
        return 'GAME_HEALTH_POTION2';
      case 28:
        return 'GAME_MAGIC_GLOW';
      case 29:
        return 'GAME_MAGIC_STARGLOW';
      case 30:
        return 'GAME_MAGICCLAW';
      case END_OF_LEVEL_POWERUP_ID:
        return 'LEVEL_GEM'; // or GAME_MAPPIECE
      case 32:
        return 'GAME_WARP';
      default:
      case 33:
        return 'GAME_TREASURE_COINS';
      case 34:
        return 'GAME_DYNAMITE';
      case 35:
        return 'GAME_CURSES_AMMO';
      case 36:
        return 'GAME_CURSES_MAGIC';
      case 37:
        return 'GAME_CURSES_HEALTH';
      case 38:
        return 'GAME_CURSES_LIFE';
      case 39:
        return 'GAME_CURSES_TREASURE';
      case 40:
        return 'GAME_CURSES_FREEZE';
      case 41:
        return 'GAME_TREASURE_CHALICES_RED';
      case 42:
        return 'GAME_TREASURE_CHALICES_GREEN';
      case 43:
        return 'GAME_TREASURE_CHALICES_BLUE';
      case 44:
        return 'GAME_TREASURE_CHALICES_PURPLE';
      case 45:
        return 'GAME_TREASURE_CROWNS_RED';
      case 46:
        return 'GAME_TREASURE_CROWNS_GREEN';
      case 47:
        return 'GAME_TREASURE_CROWNS_BLUE';
      case 48:
        return 'GAME_TREASURE_CROWNS_PURPLE';
      case 49:
        return 'GAME_TREASURE_JEWELEDSKULL_RED';
      case 50:
        return 'GAME_TREASURE_JEWELEDSKULL_GREEN';
      case 51:
        return 'GAME_TREASURE_JEWELEDSKULL_BLUE';
      case 52:
        return 'GAME_TREASURE_JEWELEDSKULL_PURPLE';
      case 53:
        return 'GAME_POWERUPS_GHOST';
      case 54:
        return 'GAME_POWERUPS_INVULNERABLE';
      case 55:
        return 'GAME_POWERUPS_EXTRALIFE';
      case 56:
        return 'GAME_POWERUPS_FIRESWORD';
      case 57:
        return 'GAME_POWERUPS_LIGHTNINGSWORD';
      case 58:
        return 'GAME_POWERUPS_ICESWORD';
      case 59:
        return 'GAME_POWERUPS_PLASMASWORD';
      case 60:
        return 'GAME_VERTWARP';
      case 61:
        return 'LEVEL_HEALTH';
    }
  }

  registerContents(treasureRegistry: TreasureRegistry) {
    for (let i = 0; i < this.rawContents.length; i++) {
      switch (this.rawContents[i]) {
        default:
          break;
        case 1:
          treasureRegistry.register(TreasureType.GOLDBAR);
          break;
        case 2:
        case 3:
        case 4:
        case 5:
          treasureRegistry.register(TreasureType.RING);
          break;
        case 6:
          treasureRegistry.register(TreasureType.NECKLACE);
          break;
        case 7:
        case 8:
        case 9:
        case 10:
          treasureRegistry.register(TreasureType.CROSS);
          break;
        case 11:
        case 12:
        case 13:
        case 14:
          treasureRegistry.register(TreasureType.SCEPTER);
          break;
        case 15:
        case 16:
        case 17:
        case 18:
          treasureRegistry.register(TreasureType.GECKO);
          break;
        case 33:
          treasureRegistry.register(TreasureType.COIN);
          break;
        case 41:
        case 42:
        case 43:
        case 44:
          treasureRegistry.register(TreasureType.CHALICE);
          break;
        case 45:
        case 46:
        case 47:
        case 48:
          treasureRegistry.register(TreasureType.CROWN);
          break;
        case 49:
        case 50:
        case 51:
        case 52:
          treasureRegistry.register(TreasureType.SKULL);
          break;
      }
    }
  }
}
