import { Menu } from '../menus/Menu';
import { Scene } from './Scene';

export class SceneWithMenu extends Scene {
  menu: Menu;
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
    this.input.keyboard.on('keydown_ESC', () => this.menuBack());
    this.menu.on('MenuChange', this.updateMenu.bind(this));
  }

  protected menuConfirm() {
    if (this.isMenuOn) {
      this.menu.confirm(this.menu.selected);
      this.game.soundsManager.playSound('GAME_SELECT');
    }
  }

  protected menuBack() {
    this.menu.back();
  }

  protected updateMenu(menu: Menu) {
    this.menu = menu;
    menu.on('MenuChange', this.updateMenu.bind(this));
  }
}
