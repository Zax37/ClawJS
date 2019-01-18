import Menu from './Menu';
import OptionsMenu from './OptionsMenu';
import MenuScene from '../scenes/MenuScene';

export default class MainMenu extends Menu {
  constructor(protected scene: MenuScene) {
    super(scene, 'MAIN MENU', ['SINGLE PLAYER', 'MULTIPLAYER', 'REPLAY MOVIES', 'OPTIONS', 'CREDITS', 'HELP'], [1,2]);
  }

  confirm(i: number) {
    switch (i) {
      case 0:
        this.scene.game.startLevel(1);
        break;
      case 3:
        this.emit('MenuChange', new OptionsMenu(this.scene, this));
        break;
      case 4:
        this.hide();
        this.scene.background.setTexture('CREDITS_BG');
        this.scene.isMenuOn = false;
        break;
      case 5:
        this.hide();
        this.scene.background.setTexture('HELP_BG');
        this.scene.isMenuOn = false;
        break;
      default:
        break;
    }
  }
}
