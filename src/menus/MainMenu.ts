import { DEFAULT_PLAYER_DATA } from '../model/PlayerData';
import { MenuScene } from '../scenes/MenuScene';
import { AboutMenu } from './AboutMenu';
import { Menu } from './Menu';
import { OptionsMenu } from './OptionsMenu';

export class MainMenu extends Menu {
  constructor(protected scene: MenuScene) {
    super(scene, 'MAIN MENU', ['SINGLE PLAYER', 'MULTIPLAYER', 'REPLAY MOVIES', 'OPTIONS', 'ABOUT'], [1,2], undefined, 40);
  }

  confirm(i: number) {
    switch (i) {
      case 0:
        this.scene.game.dataManager.setPlayerData(DEFAULT_PLAYER_DATA);
        this.scene.game.treasureRegistry.setGameScore(0);
        this.scene.game.startLevel(1);
        break;
      case 3:
        this.emit('MenuChange', new OptionsMenu(this.scene, this));
        break;
      case 4:
        this.emit('MenuChange', new AboutMenu(this.scene, this));
        break;
      default:
        break;
    }
  }
}
