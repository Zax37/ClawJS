import Menu from '../menus/Menu';

export default class SceneWithMenu extends Phaser.Scene {
  menu: Menu;
  isMenuOn = true;

  create() {
    this.input.keyboard.on('keydown_UP', () => {
      if (this.isMenuOn) {
        this.menu.upPress();
        this.sound.playAudioSprite('sounds', 'GAME_CLICK');
      }
    });
    this.input.keyboard.on('keydown_DOWN', () => {
      if (this.isMenuOn) {
        this.menu.downPress();
        this.sound.playAudioSprite('sounds', 'GAME_CLICK');
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
      this.sound.playAudioSprite('sounds', 'GAME_SELECT');
    }
  }

  protected updateMenu(menu: Menu) {
    this.menu = menu;
    menu.on('MenuChange', this.updateMenu.bind(this));
  }
}