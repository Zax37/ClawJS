import Menu from './Menu';
import MenuScene from '../scenes/MenuScene';
import GameHUD from '../scenes/GameHUD';

export default class OptionsMenu extends Menu {
  constructor(protected scene: MenuScene | GameHUD, parent: Menu) {
    super(scene, 'OPTIONS', ['MUSIC: '+scene.game.musicManager.getVolume(), 'SOUNDS:', 'VOCALS:', 'AMBIENTS:', 'BACK'], undefined, parent);
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
        if (this.scene.game.soundsManager.getSoundsVolume()) {
          this.scene.game.soundsManager.setSoundsVolume(0);
        } else {
          this.scene.game.soundsManager.setSoundsVolume(1);
        }
        break;
      case 2:
        if (this.scene.game.soundsManager.getVocalsVolume()) {
          this.scene.game.soundsManager.setVocalsVolume(0);
        } else {
          this.scene.game.soundsManager.setVocalsVolume(1);
        }
        break;
      case 3:
        if (this.scene.game.soundsManager.getAmbientVolume()) {
          this.scene.game.soundsManager.setAmbientVolume(0);
        } else {
          this.scene.game.soundsManager.setAmbientVolume(1);
        }
        break;
      case 4:
        this.back();
        break;
      default:
        break;
    }
  }

  leftPress() {
    switch (this.selected) {
      case 0:
        this.scene.game.musicManager.setVolume(Math.max(this.scene.game.musicManager.getVolume() - 0.1, 0));
        break;
      case 1:
        this.scene.game.soundsManager.setSoundsVolume(Math.max(this.scene.game.soundsManager.getSoundsVolume() - 0.1, 0));
        break;
      case 2:
        this.scene.game.soundsManager.setVocalsVolume(Math.max(this.scene.game.soundsManager.getVocalsVolume() - 0.1, 0));
        break;
      case 3:
        this.scene.game.soundsManager.setAmbientVolume(Math.max(this.scene.game.soundsManager.getAmbientVolume() - 0.1, 0));
        break;
      default:
        break;
    }
    this.scene.game.soundsManager.playSound('GAME_CLICK');
  }

  rightPress() {
    switch (this.selected) {
      case 0:
        this.scene.game.musicManager.setVolume(Math.min(this.scene.game.musicManager.getVolume() + 0.1, 1));
        break;
      case 1:
        this.scene.game.soundsManager.setSoundsVolume(Math.min(this.scene.game.soundsManager.getSoundsVolume() + 0.1, 1));
        break;
      case 2:
        this.scene.game.soundsManager.setVocalsVolume(Math.min(this.scene.game.soundsManager.getVocalsVolume() + 0.1, 1));
        break;
      case 3:
        this.scene.game.soundsManager.setAmbientVolume(Math.min(this.scene.game.soundsManager.getAmbientVolume() + 0.1, 1));
        break;
      default:
        break;
    }
    this.scene.game.soundsManager.playSound('GAME_CLICK');
  }
}
