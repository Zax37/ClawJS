import Menu from '../menus/Menu';
import Game from '../game';

export default class SceneWithMenu extends Phaser.Scene {
  menu: Menu;
  game: Game;
  isMenuOn = true;

  create() {
    this.input.keyboard.on('keydown_UP', () => {
      if (this.isMenuOn) {
        this.menu.upPress();
        this.game.soundsManager.playSound('GAME_CLICK');
      }
    });
    this.input.keyboard.on('keydown_DOWN', () => {
      if (this.isMenuOn) {
        this.menu.downPress();
        this.game.soundsManager.playSound('GAME_CLICK');
      }
    });
    this.input.keyboard.on('keydown_LEFT', () => {
      if (this.isMenuOn) {
        this.menu.leftPress();
      }
    });
    this.input.keyboard.on('keydown_RIGHT', () => {
      if (this.isMenuOn) {
        this.menu.rightPress();
      }
    });
    this.input.keyboard.on('keydown_ENTER', () => this.menuConfirm());
    this.menu.on('MenuChange', this.updateMenu.bind(this));
  }

  protected menuConfirm() {
    if (this.isMenuOn) {
      this.menu.confirm(this.menu.selected);
      this.game.soundsManager.playSound('GAME_SELECT');
    }
  }

  protected updateMenu(menu: Menu) {
    this.menu = menu;
    menu.on('MenuChange', this.updateMenu.bind(this));
  }
}
