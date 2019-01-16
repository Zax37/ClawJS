import Menu from './Menu';
import MenuScene from '../scenes/MenuScene';
import GameHUD from '../scenes/GameHUD';

export default class OptionsMenu extends Menu {
  constructor(protected scene: MenuScene | GameHUD, parent: Menu) {
    super(scene, 'OPTIONS', ['MUSIC VOLUME: '+scene.game.musicManager.getVolume(), 'BACK'], undefined, parent);
  }

  confirm(i: number): void {
    switch (i) {
      case 0:
        if (this.scene.game.musicManager.getVolume()) {
          this.scene.game.musicManager.setVolume(0);
        } else {
          this.scene.game.musicManager.setVolume(1);
        }
        break;
      case 1:
        this.back();
        break;
      default:
        break;
    }
  }

  leftPress() {
    if (this.selected === 0) {
      this.scene.game.musicManager.setVolume(Math.max(this.scene.game.musicManager.getVolume() - 0.1, 0));
    }

    this.scene.sound.playAudioSprite('sounds', 'GAME_CLICK');
  }

  rightPress() {
    if (this.selected === 0) {
      this.scene.game.musicManager.setVolume(Math.min(this.scene.game.musicManager.getVolume() + 0.1, 1));
    }

    this.scene.sound.playAudioSprite('sounds', 'GAME_CLICK');
  }
}