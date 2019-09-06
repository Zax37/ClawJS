import { GAMEPAD_INTERACTION_DELAY } from '../config';
import { Menu } from '../menus/Menu';
import { Scene } from './Scene';

export class SceneWithMenu extends Scene {
  menu: Menu;
  protected lastPadInteraction = 0;

  private menuUp = () => {
    if (!this.menu.disabled) {
      this.menu.upPress();
      this.game.soundsManager.playSound('GAME_CLICK');
    }
  };

  private menuDown = () => {
    if (!this.menu.disabled) {
      this.menu.downPress();
      this.game.soundsManager.playSound('GAME_CLICK');
    }
  };

  private menuLeft = () => {
    if (!this.menu.disabled) {
      this.menu.leftPress();
    }
  };

  private menuRight = () => {
    if (!this.menu.disabled) {
      this.menu.rightPress();
    }
  };

  create() {
    this.input.keyboard.on('keydown_UP', this.menuUp);
    this.input.keyboard.on('keydown_DOWN', this.menuDown);
    this.input.keyboard.on('keydown_LEFT', this.menuLeft);
    this.input.keyboard.on('keydown_RIGHT', this.menuRight);
    this.input.keyboard.on('keydown_ENTER', () => this.menuConfirm());
    this.input.keyboard.on('keydown_ESC', () => this.menuBack());
    this.menu.on('MenuChange', this.updateMenu.bind(this));
  }

  update(time: number, delta: number): void {
    if (this.input.gamepad.total && time > this.lastPadInteraction + GAMEPAD_INTERACTION_DELAY) {
      for (let i = 0; i < this.input.gamepad.total; i++) {
        const pad = this.input.gamepad.getPad(i);

        if (pad.leftStick.y < -0.5) {
          this.menuUp();
          this.lastPadInteraction = time;
        } else if (pad.leftStick.y > 0.5) {
          this.menuDown();
          this.lastPadInteraction = time;
        } else if (pad.A) {
          this.menuConfirm();
          this.lastPadInteraction = time;
        } else if (pad.B) {
          this.menuBack();
          this.lastPadInteraction = time;
        }
      }
    }
  }

  protected menuConfirm() {
    if (!this.menu.disabled) {
      this.menu.confirm(this.menu.selectedOption);
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
