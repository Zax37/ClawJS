import Menu from './Menu';
import OptionsMenu from './OptionsMenu';
import GameHUD from '../scenes/GameHUD';

export default class InGameMenu extends Menu {
  constructor(protected scene: GameHUD) {
    super(scene, '', ['RESUME GAME', 'END LIFE', 'OPTIONS', 'END GAME']);
    this.hide();
  }

  confirm(i: number) {
    switch (i) {
      case 0:
        this.scene.togglePause(true);
        break;
      case 1:
        this.scene.mapDisplay.claw.killFall();
        this.scene.togglePause();
        break;
      case 2:
        this.emit('MenuChange', new OptionsMenu(this.scene, this));
        break;
      case 3:
        this.scene.togglePause();
        this.scene.game.goToMainMenu();
        break;
      default:
        break;
    }
  }
}
