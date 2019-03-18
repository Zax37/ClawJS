import { DEFAULT_PLAYER_DATA } from '../model/PlayerData';
import { MenuScene, MenuSceneState } from '../scenes/MenuScene';
import { Menu } from './Menu';
import { OptionsMenu } from './OptionsMenu';

export class MainMenu extends Menu {
  constructor(protected scene: MenuScene) {
    super(scene, 'MAIN MENU', ['SINGLE PLAYER', 'MULTIPLAYER', 'REPLAY MOVIES', 'OPTIONS', 'CREDITS', 'HELP'], [1,2]);
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
        this.hide();
        this.scene.setState(MenuSceneState.CREDITS);
        break;
      case 5:
        this.hide();
        this.scene.setState(MenuSceneState.HELP);
        break;
      default:
        break;
    }
  }
}
